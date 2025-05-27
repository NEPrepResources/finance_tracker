import { useState, useEffect, useCallback } from 'react';
import { expenseService, ExpenseCreateData } from '@/services/expenseService';
import { ExpenseState, Expense } from '@/types';

export const useExpenses = () => {
  const [state, setState] = useState<ExpenseState>({
    expenses: [],
    selectedExpense: null,
    isLoading: false,
    error: null,
  });

  // Fetch all expenses
  const fetchExpenses = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const expenses = await expenseService.getAllExpenses();
      setState({
        expenses,
        selectedExpense: null,
        isLoading: false,
        error: null,
      });
      return expenses;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch expenses',
      }));
      throw error;
    }
  }, []);

  // Fetch expense by ID
  const fetchExpenseById = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const expense = await expenseService.getExpenseById(id);
      setState((prev) => ({
        ...prev,
        selectedExpense: expense,
        isLoading: false,
        error: null,
      }));
      return expense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to fetch expense',
      }));
      throw error;
    }
  }, []);

  // Create new expense
  const createExpense = useCallback(async (data: ExpenseCreateData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const newExpense = await expenseService.createExpense(data);
      setState((prev) => ({
        ...prev,
        expenses: [...prev.expenses, newExpense],
        isLoading: false,
        error: null,
      }));
      return newExpense;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to create expense',
      }));
      throw error;
    }
  }, []);

  // Delete expense
  const deleteExpense = useCallback(async (id: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await expenseService.deleteExpense(id);
      setState((prev) => ({
        ...prev,
        expenses: prev.expenses.filter((expense) => expense.id !== id),
        selectedExpense: prev.selectedExpense?.id === id ? null : prev.selectedExpense,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to delete expense',
      }));
      throw error;
    }
  }, []);

  // Clear selected expense
  const clearSelectedExpense = useCallback(() => {
    setState((prev) => ({ ...prev, selectedExpense: null }));
  }, []);

  // Calculate expense statistics
  const getExpenseStats = useCallback(() => {
    const total = state.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Group by category
    const byCategory: Record<string, number> = {};
    state.expenses.forEach((expense) => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });
    
    // Group by date (for weekly/monthly trends)
    const byDate: Record<string, number> = {};
    state.expenses.forEach((expense) => {
      const date = expense.date.split('T')[0];
      byDate[date] = (byDate[date] || 0) + expense.amount;
    });
    
    return {
      total,
      byCategory,
      byDate,
      count: state.expenses.length,
    };
  }, [state.expenses]);

  return {
    ...state,
    fetchExpenses,
    fetchExpenseById,
    createExpense,
    deleteExpense,
    clearSelectedExpense,
    getExpenseStats,
  };
};