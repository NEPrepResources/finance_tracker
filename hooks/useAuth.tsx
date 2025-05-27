import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { authService, LoginCredentials } from '@/services/authService';
import { AuthState, User } from '@/types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const isAuthenticated = authService.isAuthenticated();
        if (isAuthenticated) {
          const user = authService.getCurrentUser();
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to initialize authentication',
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await authService.login(credentials);
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      // Navigate to home screen on successful login
      router.replace('/(tabs)');
      return result.user;
    } catch (error: any) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Login failed',
      });
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    // Navigate to login screen on logout
    router.replace('/(auth)/login');
  }, []);

  // Update user function
  const updateUser = useCallback((user: User) => {
    setAuthState((prev) => ({ ...prev, user }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    updateUser,
  };
};