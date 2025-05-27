import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { formatCurrency } from '@/utils/formatters';
import { Expense } from '@/types';

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  // Calculate total expenses
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenses.forEach((expense) => {
    const category = expense.category;
    expensesByCategory[category] = (expensesByCategory[category] || 0) + expense.amount;
  });
  
  // Sort categories by amount (descending)
  const sortedCategories = Object.keys(expensesByCategory).sort(
    (a, b) => expensesByCategory[b] - expensesByCategory[a]
  );
  
  // Calculate percentages
  const getPercentage = (amount: number) => {
    return totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
  };
  
  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: COLORS.primary,
      Transportation: COLORS.secondary,
      Entertainment: COLORS.accent,
      Shopping: COLORS.warning,
      Utilities: COLORS.success,
      Health: COLORS.error,
    };
    
    return colors[category] || COLORS.textLight;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Spending Summary</Text>
        <Text style={styles.total}>{formatCurrency(totalAmount)}</Text>
      </View>
      
      <View style={styles.categoriesContainer}>
        {sortedCategories.map((category) => {
          const amount = expensesByCategory[category];
          const percentage = getPercentage(amount);
          const color = getCategoryColor(category);
          
          return (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryDot, { backgroundColor: color }]} />
                <Text style={styles.categoryName}>{category}</Text>
                <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${percentage}%`, backgroundColor: color }
                  ]} 
                />
              </View>
              
              <Text style={styles.categoryAmount}>{formatCurrency(amount)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.lg,
    ...SHADOWS.small,
  },
  header: {
    marginBottom: SIZES.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  total: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
  },
  categoriesContainer: {
    marginTop: SIZES.md,
  },
  categoryItem: {
    marginBottom: SIZES.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xs,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SIZES.xs,
  },
  categoryName: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  categoryPercentage: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginBottom: SIZES.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryAmount: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'right',
  },
});

export default ExpenseSummary;