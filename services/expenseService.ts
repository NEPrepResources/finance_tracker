import api from './api';
import { ENDPOINTS } from '@/constants/api';

// Types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdAt: string;
}

export interface ExpenseCreateData {
  amount: number;
  description: string;
  category: string;
  date: string;
  userId: string;
}

// Expense service functions
export const expenseService = {
  // Get all expenses for current user
  async getAllExpenses(): Promise<Expense[]> {
    try {
      const user = global.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const response = await api.get(ENDPOINTS.EXPENSES);
      // Filter expenses for current user in a real app
      // For mockAPI, we'll return all expenses
      return response.data;
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  },
  
  // Get expense by ID
  async getExpenseById(id: string): Promise<Expense> {
    try {
      const response = await api.get(`${ENDPOINTS.EXPENSES}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get expense error:', error);
      throw error;
    }
  },
  
  // Create new expense
  async createExpense(data: ExpenseCreateData): Promise<Expense> {
    try {
      const response = await api.post(ENDPOINTS.EXPENSES, data);
      return response.data;
    } catch (error) {
      console.error('Create expense error:', error);
      throw error;
    }
  },
  
  // Delete expense
  async deleteExpense(id: string): Promise<void> {
    try {
      await api.delete(`${ENDPOINTS.EXPENSES}/${id}`);
    } catch (error) {
      console.error('Delete expense error:', error);
      throw error;
    }
  }
};