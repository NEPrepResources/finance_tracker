import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/theme';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowLeft, Calendar, Tag, DollarSign, Trash2 } from 'lucide-react-native';

const ExpenseDetails: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedExpense, fetchExpenseById, deleteExpense, isLoading, error } = useExpenses();
  
  useEffect(() => {
    if (id) {
      fetchExpenseById(id);
    }
  }, [id, fetchExpenseById]);
  
  const handleBack = () => {
    router.back();
  };
  
  const handleDelete = async () => {
    if (!selectedExpense) return;
    
    try {
      await deleteExpense(selectedExpense.id);
      router.back();
    } catch (error) {
      console.error('Delete expense error:', error);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading expense details...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <ErrorMessage message={error} />
      </View>
    );
  }
  
  if (!selectedExpense) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
        </View>
        <ErrorMessage message="Expense not found" />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Details</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>{formatCurrency(selectedExpense.amount)}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <FileText size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{selectedExpense.description}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Tag size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{selectedExpense.category}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color={COLORS.primary} />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(selectedExpense.date)}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <Button
          title="Edit Expense"
          variant="outline"
          style={styles.editButton}
        />
        <Button
          title="Delete Expense"
          variant="outline"
          style={styles.deleteButton}
          textStyle={styles.deleteButtonText}
          onPress={handleDelete}
          leftIcon={<Trash2 size={20} color={COLORS.error} />}
        />
      </View>
    </ScrollView>
  );
};

// Import FileText icon
import { FileText } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SIZES.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  backButton: {
    marginRight: SIZES.md,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    ...SHADOWS.medium,
    marginBottom: SIZES.xl,
  },
  amountContainer: {
    padding: SIZES.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SIZES.xs,
  },
  amount: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.text,
  },
  detailsContainer: {
    padding: SIZES.xl,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.lg,
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20', // 20% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SIZES.xs,
  },
  detailValue: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
  },
  actionsContainer: {
    marginTop: SIZES.md,
  },
  editButton: {
    marginBottom: SIZES.md,
  },
  deleteButton: {
    borderColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.error,
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

export default ExpenseDetails;