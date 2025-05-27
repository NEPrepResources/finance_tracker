import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { User, AtSign, Lock } from 'lucide-react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { validateLoginForm } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Handle input changes
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle login
  const handleLogin = async () => {
    // Validate form
    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      await login(formData);
    } catch (error) {
      // Error is already handled by the useAuth hook
      console.log('Login error in component:', error);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=300' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Personal Finance</Text>
        <Text style={styles.subtitle}>Track your spending, achieve your goals</Text>
      </View>
      
      {error && <ErrorMessage message={error} />}
      
      <View style={styles.formContainer}>
        <Input
          label="Username"
          placeholder="Enter your username"
          leftIcon={<AtSign size={20} color={COLORS.textLight} />}
          value={formData.username}
          onChangeText={(value) => handleChange('username', value)}
          error={formErrors.username}
          autoCapitalize="none"
        />
        
        <Input
          label="Password"
          placeholder="Enter your password"
          leftIcon={<Lock size={20} color={COLORS.textLight} />}
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          error={formErrors.password}
          isPassword={true}
        />
        
        <Button
          title="Log In"
          onPress={handleLogin}
          isLoading={isLoading}
          style={styles.loginButton}
        />
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.xl,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SIZES.md,
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
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: SIZES.xl,
  },
  loginButton: {
    marginTop: SIZES.md,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: SIZES.lg,
  },
  forgotPasswordText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginRight: SIZES.xs,
  },
  signupText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default LoginForm;