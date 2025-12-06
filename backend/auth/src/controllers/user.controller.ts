import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export const userController = {
  // Get all users (admin only)
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, role, search } = req.query;

      const query: any = {};
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const users = await User.find(query)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.id);
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

  // Update user
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, role, isActive } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, role, isActive },
        { new: true, runValidators: true }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      logger.info(`User updated: ${user.email}`);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      logger.info(`User deleted: ${user.email}`);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Update profile
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, avatar } = req.body;

      const user = await User.findByIdAndUpdate(
        (req as any).userId,
        { name, avatar },
        { new: true, runValidators: true }
      );

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

  // Update preferences
  updatePreferences: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { preferences } = req.body;

      const user = await User.findByIdAndUpdate(
        (req as any).userId,
        { preferences },
        { new: true, runValidators: true }
      );

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
};
