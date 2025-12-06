import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocket = (io: SocketIOServer) => {
  // Authentication middleware for Socket.io
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token as string, JWT_SECRET) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join user's personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Handle joining content rooms for real-time collaboration
    socket.on('join:content', (contentId: string) => {
      socket.join(`content:${contentId}`);
      logger.info(`User ${socket.userId} joined content room: ${contentId}`);

      // Notify others in the room
      socket.to(`content:${contentId}`).emit('user:joined', {
        userId: socket.userId,
        contentId,
      });
    });

    // Handle leaving content rooms
    socket.on('leave:content', (contentId: string) => {
      socket.leave(`content:${contentId}`);
      logger.info(`User ${socket.userId} left content room: ${contentId}`);

      // Notify others in the room
      socket.to(`content:${contentId}`).emit('user:left', {
        userId: socket.userId,
        contentId,
      });
    });

    // Handle real-time content updates
    socket.on('content:update', (data: { contentId: string; changes: any }) => {
      socket.to(`content:${data.contentId}`).emit('content:updated', {
        userId: socket.userId,
        changes: data.changes,
      });
    });

    // Handle cursor position updates for collaboration
    socket.on('cursor:move', (data: { contentId: string; position: any }) => {
      socket.to(`content:${data.contentId}`).emit('cursor:moved', {
        userId: socket.userId,
        position: data.position,
      });
    });

    // Handle typing indicators
    socket.on('typing:start', (contentId: string) => {
      socket.to(`content:${contentId}`).emit('user:typing', {
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (contentId: string) => {
      socket.to(`content:${contentId}`).emit('user:typing', {
        userId: socket.userId,
        isTyping: false,
      });
    });

    // Handle notifications
    socket.on('notification:read', (notificationId: string) => {
      logger.info(`Notification ${notificationId} marked as read by ${socket.userId}`);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.userId}, reason: ${reason}`);

      // Notify all content rooms the user was in
      socket.rooms.forEach((room) => {
        if (room.startsWith('content:')) {
          io.to(room).emit('user:left', {
            userId: socket.userId,
          });
        }
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  logger.info('Socket.io server initialized');
};

// Helper function to emit to specific user
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

// Helper function to emit to content room
export const emitToContent = (io: SocketIOServer, contentId: string, event: string, data: any) => {
  io.to(`content:${contentId}`).emit(event, data);
};

// Helper function to broadcast to all
export const broadcast = (io: SocketIOServer, event: string, data: any) => {
  io.emit(event, data);
};
