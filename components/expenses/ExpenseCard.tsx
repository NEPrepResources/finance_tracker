import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { Expense } from '@/types';
import { formatCurrency, getRelativeTime } from '@/utils/formatters';
import { Clock, Trash2 } from 'lucide-react-native';

interface ExpenseCardProps {
  expense: Expense;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

// Category icons and colors
const getCategoryInfo = (category: string) => {
  const categories: Record<string, { color: string; icon: React.ReactNode }> = {
    food: {
      color: COLORS.primary,
      icon: <View style={[styles.categoryIcon, { backgroundColor: COLORS.primary }]} />,
    },
    transportation: {
      color: COLORS.secondary,
      icon: <View style={[styles.categoryIcon, { backgroundColor: COLORS.secondary }]} />,
    },
    entertainment: {
      color: COLORS.accent,
      icon: <View style={[styles.categoryIcon, { backgroundColor: COLORS.accent }]} />,
    },
    shopping: {
      color: COLORS.warning,
      icon: <View style={[styles.categoryIcon, { backgroundColor: COLORS.warning }]} />,
    },
    utilities: {
      color: COLORS.success,
      icon: <View style={[styles.categoryIcon, { backgroundColor: COLORS.success }]} />,
    },
    health: {
      color: COLORS.error,
      icon: <View style={[styles.categoryIcon, { backgroundColor: COLORS.error }]} />,
    },
    // Default for other categories
    default: {
      color: COLORS.textLight,
      icon: <View style={[styles.categoryIcon, { backgroundColor: COLORS.textLight }]} />,
    },
  };

  return categories[category] || categories.default;
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress, onDelete }) => {
  const { id, amount, description, category, date } = expense;
  const categoryInfo = getCategoryInfo(category.toLowerCase());
  
  // Handle press
  const handlePress = () => {
    onPress(id);
  };
  
  // Handle delete
  const handleDelete = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onDelete(id);
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {categoryInfo.icon}
        <View style={styles.textContainer}>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
          <View style={styles.dateContainer}>
            <Clock size={12} color={COLORS.textLight} />
            <Text style={styles.date}>{getRelativeTime(date)}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.rightContent}>
        <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Trash2 size={16} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SIZES.md,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: SIZES.xs,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  deleteButton: {
    padding: SIZES.xs,
  },
});

export default ExpenseCard;