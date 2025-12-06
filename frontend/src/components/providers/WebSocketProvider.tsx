'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { WebSocketMessage, User } from '@/types';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: Omit<WebSocketMessage, 'userId' | 'timestamp'>) => void;
  sendTyping: (roomId: string, isTyping: boolean) => void;
  sendCursorMove: (roomId: string, x: number, y: number) => void;
  activeUsers: Map<string, User>;
  typingUsers: Set<string>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<Map<string, User>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  
  const { user, tokens, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user || !tokens) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setActiveUsers(new Map());
        setTypingUsers(new Set());
      }
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    
    const newSocket = io(wsUrl, {
      auth: {
        token: tokens.accessToken,
        userId: user.id,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      setIsConnected(false);
      setActiveUsers(new Map());
      setTypingUsers(new Set());
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('user_joined', (data: { user: User; roomId: string }) => {
      console.log('User joined room:', data.user.name);
      setActiveUsers(prev => new Map(prev.set(data.user.id, data.user)));
    });

    newSocket.on('user_left', (data: { userId: string; roomId: string }) => {
      console.log('User left room:', data.userId);
      setActiveUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.userId);
        return newMap;
      });
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    newSocket.on('content_updated', (data: { contentId: string; changes: any; userId: string }) => {
      console.log('Content updated by user:', data.userId);
      // Handle content updates - this would typically trigger a re-fetch
      // or update the local state
    });

    newSocket.on('typing_start', (data: { userId: string; roomId: string }) => {
      if (data.userId !== user.id) {
        setTypingUsers(prev => new Set(prev.add(data.userId)));
      }
    });

    newSocket.on('typing_stop', (data: { userId: string; roomId: string }) => {
      if (data.userId !== user.id) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
      }
    });

    newSocket.on('cursor_move', (data: { userId: string; x: number; y: number; roomId: string }) => {
      if (data.userId !== user.id) {
        // Handle cursor position updates for collaborative editing
        console.log('Cursor moved:', data);
      }
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setActiveUsers(new Map());
      setTypingUsers(new Set());
    };
  }, [isAuthenticated, user, tokens]);

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      console.log('Joining room:', roomId);
      socket.emit('join_room', { roomId, userId: user?.id });
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      console.log('Leaving room:', roomId);
      socket.emit('leave_room', { roomId, userId: user?.id });
      setActiveUsers(new Map());
      setTypingUsers(new Set());
    }
  };

  const sendMessage = (
    roomId: string,
    message: Omit<WebSocketMessage, 'userId' | 'timestamp'>
  ) => {
    if (socket && isConnected && user) {
      const fullMessage: WebSocketMessage = {
        ...message,
        userId: user.id,
        timestamp: new Date(),
      };
      
      socket.emit('send_message', { roomId, message: fullMessage });
    }
  };

  const sendTyping = (roomId: string, isTyping: boolean) => {
    if (socket && isConnected && user) {
      socket.emit('typing', { 
        roomId, 
        userId: user.id, 
        isTyping 
      });
    }
  };

  const sendCursorMove = (roomId: string, x: number, y: number) => {
    if (socket && isConnected && user) {
      socket.emit('cursor_move', { 
        roomId, 
        userId: user.id, 
        x, 
        y 
      });
    }
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    sendCursorMove,
    activeUsers,
    typingUsers,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}