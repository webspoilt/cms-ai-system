import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';

import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rateLimitMiddleware } from '../middleware/rateLimit.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  body('role')
    .optional()
    .isIn(['editor', 'author', 'viewer'])
    .withMessage('Invalid role'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
];

// Configure Passport strategies
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await authController.googleAuth(profile);
    return done(null, result);
  } catch (error) {
    logger.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: "/api/auth/github/callback",
  scope: ['user:email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await authController.githubAuth(profile);
    return done(null, result);
  } catch (error) {
    logger.error('GitHub OAuth error:', error);
    return done(error, null);
  }
}));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID!,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
  callbackURL: "/api/auth/linkedin/callback",
  state: true,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await authController.linkedinAuth(profile);
    return done(null, result);
  } catch (error) {
    logger.error('LinkedIn OAuth error:', error);
    return done(error, null);
  }
}));

// Initialize Passport
router.use(passport.initialize());

// ========== PUBLIC ROUTES ==========

// Health check
router.get('/health', authController.healthCheck);

// Register new user
router.post('/register', 
  registerValidation,
  validationMiddleware,
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 5 }), // 5 registrations per 15 minutes
  authController.register
);

// Login
router.post('/login',
  loginValidation,
  validationMiddleware,
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 5 }), // 5 login attempts per 15 minutes
  authController.login
);

// Forgot password
router.post('/forgot-password',
  forgotPasswordValidation,
  validationMiddleware,
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 3 }), // 3 password reset requests per 15 minutes
  authController.forgotPassword
);

// Reset password
router.post('/reset-password',
  resetPasswordValidation,
  validationMiddleware,
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 3 }),
  authController.resetPassword
);

// Verify email
router.post('/verify-email', authController.verifyEmail);

// Resend verification email
router.post('/resend-verification', 
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 2 }),
  authController.resendVerification
);

// OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false,
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  authController.oAuthCallback
);

router.get('/github', passport.authenticate('github', { 
  scope: ['user:email'],
  session: false,
}));

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  authController.oAuthCallback
);

router.get('/linkedin', passport.authenticate('linkedin', { 
  state: true,
  session: false,
}));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { session: false }),
  authController.oAuthCallback
);

// ========== PROTECTED ROUTES ==========

// Get current user
router.get('/me', 
  authMiddleware,
  authController.getCurrentUser
);

// Refresh token
router.post('/refresh', 
  authMiddleware,
  authController.refreshToken
);

// Logout
router.post('/logout', 
  authMiddleware,
  authController.logout
);

// Change password
router.post('/change-password',
  authMiddleware,
  changePasswordValidation,
  validationMiddleware,
  authController.changePassword
);

// ========== 2FA ROUTES ==========

// Enable 2FA
router.post('/2fa/enable',
  authMiddleware,
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 3 }),
  authController.enable2FA
);

// Verify 2FA setup
router.post('/2fa/verify',
  authMiddleware,
  [
    body('token')
      .isLength({ min: 6, max: 6 })
      .withMessage('2FA token must be 6 digits'),
  ],
  validationMiddleware,
  authController.verify2FA
);

// Disable 2FA
router.post('/2fa/disable',
  authMiddleware,
  [
    body('token')
      .isLength({ min: 6, max: 6 })
      .withMessage('2FA token must be 6 digits'),
  ],
  validationMiddleware,
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 3 }),
  authController.disable2FA
);

// ========== SESSION MANAGEMENT ==========

// Get active sessions
router.get('/sessions',
  authMiddleware,
  authController.getActiveSessions
);

// Revoke specific session
router.delete('/sessions/:sessionId',
  authMiddleware,
  authController.revokeSession
);

// Revoke all sessions
router.post('/sessions/revoke-all',
  authMiddleware,
  rateLimitMiddleware({ windowMs: 15 * 60 * 1000, max: 1 }),
  authController.revokeAllSessions
);

export default router;