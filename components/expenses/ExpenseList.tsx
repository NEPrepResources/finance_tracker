import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import ExpenseCard from '@/components/expenses/ExpenseCard';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useExpenses } from '@/hooks/useExpenses';
import { Expense } from '@/types';
import { CirclePlus as PlusCircle } from 'lucide-react-native';

const ExpenseList: React.FC = () => {
  const { expenses, fetchExpenses, deleteExpense, isLoading, error } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState<string | null>(null);
  
  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
  
  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  }, [fetchExpenses]);
  
  // Handle expense press
  const handleExpensePress = (id: string) => {
    router.push(`/(tabs)/expenses/${id}`);
  };
  
  // Handle expense delete
  const handleExpenseDelete = async (id: string) => {
    try {
      await deleteExpense(id);
    } catch (error: any) {
      setShowDeleteError(error.message || 'Failed to delete expense');
      // Clear error after 3 seconds
      setTimeout(() => {
        setShowDeleteError(null);
      }, 3000);
    }
  };
  
  // Handle add expense
  const handleAddExpense = () => {
    router.push('/(tabs)/add');
  };
  
  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Expenses Yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your spending by adding your first expense
      </Text>
      <Button
        title="Add Your First Expense"
        onPress={handleAddExpense}
        style={styles.addFirstButton}
        leftIcon={<PlusCircle size={20} color={COLORS.background} />}
      />
    </View>
  );
  
  // Render header with summary
  const renderHeader = () => {
    if (expenses.length === 0) return null;
    
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Expenses</Text>
        <Text style={styles.headerSubtitle}>
          {expenses.length} expenses totaling ${total.toFixed(2)}
        </Text>
        {showDeleteError && <ErrorMessage message={showDeleteError} />}
      </View>
    );
  };
  
  // Render list footer
  const renderFooter = () => {
    if (expenses.length === 0) return null;
    
    return (
      <View style={styles.footer}>
        <Button
          title="Add New Expense"
          onPress={handleAddExpense}
          leftIcon={<PlusCircle size={20} color={COLORS.background} />}
        />
      </View>
    );
  };
  
  // Render expense item
  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <ExpenseCard
      expense={item}
      onPress={handleExpensePress}
      onDelete={handleExpenseDelete}
    />
  );
  
  if (isLoading && !refreshing && expenses.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {error && <ErrorMessage message={error} />}
      
      <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.xl,
    flexGrow: 1,
  },
  header: {
    marginBottom: SIZES.xl,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
    marginVertical: SIZES.xl * 2,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  addFirstButton: {
    minWidth: 200,
  },
  footer: {
    marginTop: SIZES.xl,
    marginBottom: SIZES.xxl,
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

export default ExpenseList;