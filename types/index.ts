// Auth types
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Expense types
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

export interface ExpenseState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
}

// Navigation types
export type AuthStackParamList = {
  Login: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Expenses: undefined;
  Add: undefined;
  Profile: undefined;
};

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  ExpenseDetails: { id: string };
  AddExpense: undefined;
};

// Budget types
export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
}

// Category types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// Common types
export interface ErrorResponse {
  message: string;
  status?: number;
}

declare global {
  var token: string | undefined;
  var currentUser: User | undefined;
}