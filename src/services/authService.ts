import { apiClient } from './apiClient';
import type { AuthResponse, UserLogin, UserSession } from '@/types/auth';

const TOKEN_KEY = 'california_token';
const USER_KEY = 'california_user';

export const authService = {
  async login(credentials: UserLogin): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    const { token } = response.data;
    
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      const session: UserSession = {
        username: credentials.username,
        token,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(session));
    }
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getCurrentUser(): UserSession | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
