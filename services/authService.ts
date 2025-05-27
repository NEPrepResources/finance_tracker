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
  token?: string;
}

// Auth service functions
export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In a real app, this would be a POST request to get a token
      // For mockAPI, we'll fetch the user that matches the username
      const response = await api.get(`${ENDPOINTS.USERS}?username=${credentials.username}`);
      
      // Check if user exists and password matches
      const users = response.data;
      if (users.length === 0) {
        throw new Error('User not found');
      }
      
      const user = users[0];
      if (user.password !== credentials.password) {
        throw new Error('Invalid password');
      }
      
      // In a real app, we would store the token in secure storage
      // For this demo, we'll just store the user data
      global.token = 'mock-token';
      global.currentUser = user;
      
      return { user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout(): void {
    // Clear auth data
    global.token = undefined;
    global.currentUser = undefined;
  },
  
  // Get current user
  getCurrentUser(): User | null {
    return global.currentUser || null;
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!global.token && !!global.currentUser;
  }
};