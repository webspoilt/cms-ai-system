import express from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/user.controller';
import { authMiddleware, authorize } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all users (admin only)
router.get('/',
  authorize('admin'),
  userController.getAllUsers
);

// Get user by ID
router.get('/:id',
  authorize('admin'),
  userController.getUserById
);

// Update user (admin only)
router.patch('/:id',
  authorize('admin'),
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'editor', 'author', 'viewer'])
      .withMessage('Invalid role'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
  ],
  validationMiddleware,
  userController.updateUser
);

// Delete user (admin only)
router.delete('/:id',
  authorize('admin'),
  userController.deleteUser
);

// Update own profile
router.patch('/profile',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
  ],
  validationMiddleware,
  userController.updateProfile
);

// Update preferences
router.patch('/preferences',
  [
    body('preferences.theme')
      .optional()
      .isIn(['light', 'dark', 'system'])
      .withMessage('Invalid theme'),
    body('preferences.notifications')
      .optional()
      .isBoolean()
      .withMessage('Notifications must be a boolean'),
    body('preferences.language')
      .optional()
      .isString()
      .isLength({ min: 2, max: 5 })
      .withMessage('Invalid language code'),
  ],
  validationMiddleware,
  userController.updatePreferences
);

export default router;
