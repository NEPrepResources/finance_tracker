import api from './api';
import { ENDPOINTS } from '@/constants/api';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

// Auth service functions
export const authService = {
  currentUser: null as User | null,

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.get(`${ENDPOINTS.USERS}?username=${credentials.username}`);
      const users = response.data;
      if (users.length === 0) {
        throw new Error('User not found');
      }
      const user = users[0];
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }
      authService.currentUser = user;
      console.log('User logged in:', authService.currentUser); // Debug log
      return { user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout(): void {
    authService.currentUser = null;
    console.log('User logged out'); // Debug log
  },

  getCurrentUser(): User | null {
    return authService.currentUser;
  },

  isAuthenticated(): boolean {
    console.log('isAuthenticated check:', !!authService.currentUser); // Debug log
    return !!authService.currentUser;
  }
};