import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useExpenses } from '@/hooks/useExpenses';
import ExpenseSummary from '@/components/dashboard/ExpenseSummary';
import { formatCurrency } from '@/utils/formatters';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { ChevronRight, CirclePlus as PlusCircle, Wallet, TrendingUp, Bell, Zap } from 'lucide-react-native';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { expenses, fetchExpenses, isLoading, error } = useExpenses();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);
  
  // Fetch expenses on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchExpenses();
    }
  }, [isAuthenticated, fetchExpenses]);
  
  // Get current month and year
  const currentDate = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  // Calculate total expenses for the month
  const totalMonthlyExpenses = expenses.reduce((sum, expense) => {
    const expenseDate = new Date(expense.date);
    if (
      expenseDate.getMonth() === currentDate.getMonth() &&
      expenseDate.getFullYear() === currentDate.getFullYear()
    ) {
      return sum + expense.amount;
    }
    return sum;
  }, 0);
  
  // Calculate recent expenses (last 7 days)
  const recentExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const diffTime = Math.abs(currentDate.getTime() - expenseDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });
  
  // Navigate to add expense
  const handleAddExpense = () => {
    router.push('/(tabs)/add');
  };
  
  // Navigate to expense details
  const handleViewAllExpenses = () => {
    router.push('/(tabs)/expenses');
  };
  
  if (isLoading && expenses.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
          <Text style={styles.date}>{currentMonth} {currentYear}</Text>
        </View>
        <Image
          source={{ 
            uri: user?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300' 
          }}
          style={styles.avatar}
        />
      </View>
      
      {error && <ErrorMessage message={error} />}
      
      {/* Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Monthly Overview</Text>
        </View>
        
        <View style={styles.overviewContent}>
          <View style={styles.overviewItem}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '20' }]}>
              <Wallet size={24} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.overviewLabel}>Monthly Spent</Text>
              <Text style={styles.overviewValue}>{formatCurrency(totalMonthlyExpenses)}</Text>
            </View>
          </View>
          
          <View style={styles.separator} />
          
          <View style={styles.overviewItem}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary + '20' }]}>
              <TrendingUp size={24} color={COLORS.secondary} />
            </View>
            <View>
              <Text style={styles.overviewLabel}>Expenses</Text>
              <Text style={styles.overviewValue}>{expenses.length}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add New Expense</Text>
          <PlusCircle size={20} color={COLORS.background} />
        </TouchableOpacity>
      </View>
      
      {/* Expense Summary */}
      {expenses.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Analysis</Text>
          </View>
          
          <ExpenseSummary expenses={expenses} />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Expenses Yet</Text>
          <Text style={styles.emptyText}>
            Start tracking your spending by adding your first expense
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddExpense}>
            <Text style={styles.emptyButtonText}>Add Your First Expense</Text>
            <PlusCircle size={20} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <Bell size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.quickActionText}>Set Budget Alert</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary + '20' }]}>
              <Zap size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.quickActionText}>Spending Insights</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Recent Expenses */}
      {recentExpenses.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity onPress={handleViewAllExpenses}>
              <View style={styles.viewAllContainer}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          </View>
          
          {recentExpenses.slice(0, 3).map((expense) => (
            <View key={expense.id} style={styles.recentExpense}>
              <View style={styles.recentExpenseLeft}>
                <View 
                  style={[
                    styles.recentExpenseCategory, 
                    { backgroundColor: COLORS.primary + '20' }
                  ]}
                />
                <View>
                  <Text style={styles.recentExpenseDescription} numberOfLines={1}>
                    {expense.description}
                  </Text>
                  <Text style={styles.recentExpenseDate}>
                    {new Date(expense.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.recentExpenseAmount}>
                {formatCurrency(expense.amount)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SIZES.xl,
    paddingBottom: SIZES.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  greeting: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  overviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    marginBottom: SIZES.xl,
    ...SHADOWS.medium,
  },
  overviewHeader: {
    marginBottom: SIZES.md,
  },
  overviewTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  overviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  overviewLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SIZES.xs,
  },
  overviewValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  separator: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.border,
    marginHorizontal: SIZES.md,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.md,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.background,
    marginRight: SIZES.sm,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
    marginRight: SIZES.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    width: '48%',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  quickActionText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  recentExpense: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  recentExpenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recentExpenseCategory: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SIZES.md,
  },
  recentExpenseDescription: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SIZES.xs,
    maxWidth: 150,
  },
  recentExpenseDate: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
  recentExpenseAmount: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
  },
  emptyContainer: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.xl,
    alignItems: 'center',
    ...SHADOWS.small,
    marginBottom: SIZES.xl,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.md,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.background,
    marginRight: SIZES.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: SIZES.md,
  },
});