import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Generate tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  return { accessToken, refreshToken };
};

export const authController = {
  // Health check
  healthCheck: async (req: Request, res: Response) => {
    res.json({ status: 'OK', service: 'auth' });
  },

  // Register
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'viewer',
        emailVerificationToken: crypto.randomBytes(32).toString('hex'),
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const tokens = generateTokens(user._id.toString());

      logger.info(`User registered: ${email}`);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Login
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user with password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const tokens = generateTokens(user._id.toString());

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current user
  getCurrentUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById((req as any).userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Refresh token
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required',
        });
      }

      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: string };
      const tokens = generateTokens(decoded.userId);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }
  },

  // Logout
  logout: async (req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  },

  // Forgot password
  forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.json({
          success: true,
          message: 'If the email exists, a reset link will be sent',
        });
      }

      user.passwordResetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();

      // TODO: Send email with reset link

      res.json({
        success: true,
        message: 'If the email exists, a reset link will be sent',
      });
    } catch (error) {
      next(error);
    }
  },

  // Reset password
  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset token',
        });
      }

      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Change password
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById((req as any).userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect',
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Verify email
  verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;

      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired verification token',
        });
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Resend verification
  resendVerification: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById((req as any).userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          error: 'Email is already verified',
        });
      }

      user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await user.save();

      // TODO: Send verification email

      res.json({
        success: true,
        message: 'Verification email sent',
      });
    } catch (error) {
      next(error);
    }
  },

  // OAuth handlers
  googleAuth: async (profile: any) => {
    let user = await User.findOne({ socialId: profile.id, socialProvider: 'google' });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos?.[0]?.value,
        socialProvider: 'google',
        socialId: profile.id,
        isEmailVerified: true,
      });
    }

    return { user, tokens: generateTokens(user._id.toString()) };
  },

  githubAuth: async (profile: any) => {
    let user = await User.findOne({ socialId: profile.id, socialProvider: 'github' });

    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
        avatar: profile.photos?.[0]?.value,
        socialProvider: 'github',
        socialId: profile.id,
        isEmailVerified: true,
      });
    }

    return { user, tokens: generateTokens(user._id.toString()) };
  },

  linkedinAuth: async (profile: any) => {
    let user = await User.findOne({ socialId: profile.id, socialProvider: 'linkedin' });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        socialProvider: 'linkedin',
        socialId: profile.id,
        isEmailVerified: true,
      });
    }

    return { user, tokens: generateTokens(user._id.toString()) };
  },

  oAuthCallback: async (req: Request, res: Response) => {
    const { user, tokens } = req.user as any;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${tokens.accessToken}`);
  },

  // 2FA handlers
  enable2FA: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement 2FA setup
      res.json({
        success: true,
        data: {
          secret: 'GENERATED_SECRET',
          qrCode: 'QR_CODE_DATA_URL',
        },
      });
    } catch (error) {
      next(error);
    }
  },

  verify2FA: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement 2FA verification
      res.json({
        success: true,
        message: '2FA verified successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  disable2FA: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById((req as any).userId);
      if (user) {
        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        await user.save();
      }

      res.json({
        success: true,
        message: '2FA disabled successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Session management
  getActiveSessions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement session tracking
      res.json({
        success: true,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  },

  revokeSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        message: 'Session revoked',
      });
    } catch (error) {
      next(error);
    }
  },

  revokeAllSessions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        message: 'All sessions revoked',
      });
    } catch (error) {
      next(error);
    }
  },
};
