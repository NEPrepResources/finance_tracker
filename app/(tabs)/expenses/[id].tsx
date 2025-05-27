import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/theme';
import ExpenseDetails from '@/components/expenses/ExpenseDetails';
import { useAuth } from '@/hooks/useAuth';

export default function ExpenseDetailsScreen() {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);
  
  return (
    <View style={styles.container}>
      <ExpenseDetails />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});