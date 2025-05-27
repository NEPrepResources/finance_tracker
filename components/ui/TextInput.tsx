import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';

interface TextInputProps extends RNTextInputProps {
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ style, error, ...props }) => {
  return (
    <RNTextInput
      style={[
        styles.input,
        error && styles.inputError,
        style,
      ]}
      placeholderTextColor={COLORS.textLight}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.sm,
    padding: SIZES.md,
    color: COLORS.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputError: {
    borderColor: COLORS.error,
  },
}); 