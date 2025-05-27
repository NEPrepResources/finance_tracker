// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 chars, at least one number)
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6 && /\d/.test(password);
};

// Field is required validation
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Number validation
export const isValidNumber = (value: string): boolean => {
  return !isNaN(Number(value)) && Number(value) > 0;
};

// Date validation (YYYY-MM-DD format)
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

// Form validation
export const validateLoginForm = (values: { username: string; password: string }): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!isRequired(values.username)) {
    errors.username = 'Username is required';
  }
  
  if (!isRequired(values.password)) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

export const validateExpenseForm = (values: { 
  amount: string; 
  description: string; 
  category: string; 
  date: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!isRequired(values.amount)) {
    errors.amount = 'Amount is required';
  } else if (!isValidNumber(values.amount)) {
    errors.amount = 'Amount must be a positive number';
  }
  
  if (!isRequired(values.description)) {
    errors.description = 'Description is required';
  }
  
  if (!isRequired(values.category)) {
    errors.category = 'Category is required';
  }
  
  if (!isRequired(values.date)) {
    errors.date = 'Date is required';
  } else if (!isValidDate(values.date)) {
    errors.date = 'Date must be in YYYY-MM-DD format';
  }
  
  return errors;
};