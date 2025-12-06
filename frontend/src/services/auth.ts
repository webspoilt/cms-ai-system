import { apiService } from './api';
import { User, AuthTokens, LoginRequest, RegisterRequest, SocialAuthRequest } from '@/types';

export class AuthService {
  // Authentication methods
  async login(credentials: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiService.post<{ user: User; tokens: AuthTokens }>('/auth/login', credentials);
    return response;
  }

  async register(userData: RegisterRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiService.post<{ user: User; tokens: AuthTokens }>('/auth/register', userData);
    return response;
  }

  async socialAuth(authData: SocialAuthRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await apiService.post<{ user: User; tokens: AuthTokens }>('/auth/social', authData);
    return response;
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  }

  async forgotPassword(email: string): Promise<void> {
    await apiService.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/reset-password', { token, newPassword });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/change-password', { currentPassword, newPassword });
  }

  async verifyEmail(token: string): Promise<void> {
    await apiService.post('/auth/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<void> {
    await apiService.post('/auth/resend-verification');
  }

  // Token management
  async refreshTokens(): Promise<AuthTokens> {
    const response = await apiService.post<AuthTokens>('/auth/refresh');
    return response;
  }

  // User management
  async getCurrentUser(): Promise<User> {
    return await apiService.get<User>('/auth/me');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return await apiService.patch<User>('/auth/profile', userData);
  }

  async updatePreferences(preferences: User['preferences']): Promise<User> {
    return await apiService.patch<User>('/auth/preferences', { preferences });
  }

  async deleteAccount(password: string): Promise<void> {
    await apiService.post('/auth/delete-account', { password });
  }

  // Two-factor authentication
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    return await apiService.post('/auth/2fa/enable');
  }

  async verify2FA(token: string): Promise<void> {
    await apiService.post('/auth/2fa/verify', { token });
  }

  async disable2FA(token: string): Promise<void> {
    await apiService.post('/auth/2fa/disable', { token });
  }

  // Session management
  async getActiveSessions(): Promise<Array<{
    id: string;
    device: string;
    location: string;
    lastActivity: Date;
    current: boolean;
  }>> {
    return await apiService.get('/auth/sessions');
  }

  async revokeSession(sessionId: string): Promise<void> {
    await apiService.delete(`/auth/sessions/${sessionId}`);
  }

  async revokeAllSessions(): Promise<void> {
    await apiService.post('/auth/sessions/revoke-all');
  }
}

export const authService = new AuthService();