import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '@/constants/theme';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import { useAuth } from '@/hooks/useAuth';

export default function AddExpenseScreen() {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);
  
  return (
    <View style={styles.container}>
      <ExpenseForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});