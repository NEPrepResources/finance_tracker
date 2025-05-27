import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { DollarSign, Calendar, Tag, FileText } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validateExpenseForm } from '@/utils/validation';
import { useExpenses } from '@/hooks/useExpenses';
import { formatDateForInput } from '@/utils/formatters';

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return formatDateForInput(today.toISOString());
};

// Category options
const CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Health',
  'Other',
];

const ExpenseForm: React.FC = () => {
  const { createExpense, isLoading, error } = useExpenses();
  const user = global.currentUser;
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'Food', // Default category
    date: getTodayDate(),
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showCategories, setShowCategories] = useState(false);
  
  // Handle input changes
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle category selection
  const handleSelectCategory = (category: string) => {
    setFormData((prev) => ({ ...prev, category }));
    setShowCategories(false);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    const errors = validateExpenseForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      // Create expense
      if (!user) throw new Error('User not authenticated');
      
      await createExpense({
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: formData.date,
        userId: user.id,
      });
      
      // Navigate back to expenses list
      router.push('/(tabs)');
    } catch (error) {
      console.error('Create expense error:', error);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Add New Expense</Text>
          <Text style={styles.subtitle}>Track your spending by adding expenses</Text>
        </View>
        
        {error && <ErrorMessage message={error} />}
        
        <View style={styles.formContainer}>
          <Input
            label="Amount"
            placeholder="0.00"
            leftIcon={<DollarSign size={20} color={COLORS.textLight} />}
            value={formData.amount}
            onChangeText={(value) => handleChange('amount', value)}
            error={formErrors.amount}
            keyboardType="numeric"
          />
          
          <Input
            label="Description"
            placeholder="What did you spend on?"
            leftIcon={<FileText size={20} color={COLORS.textLight} />}
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            error={formErrors.description}
          />
          
          <View style={styles.categoryContainer}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategories(!showCategories)}
            >
              <Tag size={20} color={COLORS.textLight} />
              <Text style={styles.categoryText}>{formData.category}</Text>
            </TouchableOpacity>
            {formErrors.category && (
              <Text style={styles.errorText}>{formErrors.category}</Text>
            )}
            
            {showCategories && (
              <View style={styles.categoriesList}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      formData.category === category && styles.selectedCategory,
                    ]}
                    onPress={() => handleSelectCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        formData.category === category && styles.selectedCategoryText,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            leftIcon={<Calendar size={20} color={COLORS.textLight} />}
            value={formData.date}
            onChangeText={(value) => handleChange('date', value)}
            error={formErrors.date}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="Save Expense"
              onPress={handleSubmit}
              isLoading={isLoading}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SIZES.xl,
  },
  header: {
    marginBottom: SIZES.xl,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  formContainer: {
    marginBottom: SIZES.xl,
  },
  categoryContainer: {
    marginBottom: SIZES.md,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.sm,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  categoryText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: SIZES.md,
  },
  categoriesList: {
    marginTop: SIZES.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.sm,
  },
  categoryOption: {
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary + '20', // Add transparency
  },
  categoryOptionText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
  },
  selectedCategoryText: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  errorText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.error,
    marginTop: SIZES.xs,
  },
  buttonContainer: {
    marginTop: SIZES.xl,
  },
  cancelButton: {
    marginTop: SIZES.md,
  },
});

export default ExpenseForm;