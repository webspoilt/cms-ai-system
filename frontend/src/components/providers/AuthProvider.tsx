'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthTokens } from '@/types';
import { authService } from '@/services/auth';
import { getFromStorage, setToStorage, removeFromStorage } from '@/utils';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; confirmPassword: string }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshTokens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokens;

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokens = getFromStorage<AuthTokens>('tokens', null);
        const storedUser = getFromStorage<User>('user', null);

        if (storedTokens && storedUser) {
          setTokens(storedTokens);
          setUser(storedUser);

          // Verify tokens are still valid
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            setToStorage('user', currentUser);
          } catch (error) {
            // Tokens are invalid, clear storage
            removeFromStorage('tokens');
            removeFromStorage('user');
            setTokens(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setTokens(response.tokens);
      
      setToStorage('user', response.user);
      setToStorage('tokens', response.tokens);
      
      // Set remember me expiration if needed
      if (!credentials.rememberMe) {
        // Set session storage expiration
        setTimeout(() => {
          logout();
        }, response.tokens.expiresIn * 1000);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      setUser(response.user);
      setTokens(response.tokens);
      
      setToStorage('user', response.user);
      setToStorage('tokens', response.tokens);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTokens(null);
      removeFromStorage('user');
      removeFromStorage('tokens');
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      setToStorage('user', updatedUser);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const refreshTokens = async () => {
    try {
      const newTokens = await authService.refreshTokens();
      setTokens(newTokens);
      setToStorage('tokens', newTokens);
    } catch (error) {
      console.error('Failed to refresh tokens:', error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}