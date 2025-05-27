import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  if (!message) return null;
  
  return (
    <View style={[styles.container, style]}>
      <AlertTriangle size={20} color={COLORS.error} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.unavailable,
    paddingVertical: SIZES.sm,
    paddingHorizontal: SIZES.md,
    borderRadius: SIZES.sm,
    marginBottom: SIZES.md,
  },
  message: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SIZES.sm,
    flex: 1,
  },
});

export default ErrorMessage;