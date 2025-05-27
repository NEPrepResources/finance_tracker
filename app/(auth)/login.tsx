import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState<string>('');

  const handleLogin = async (username: string, password: string) => {
    try {
      setError('');
      await login({ username, password });
      showToast('Successfully logged in!', 'success');
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  return (
    <View style={styles.container}>
      <LoginForm onSubmit={handleLogin} error={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 20,
  },
});