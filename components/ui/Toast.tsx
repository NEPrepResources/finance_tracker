import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  duration = 3000,
  onHide,
}) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color={COLORS.success} />;
      case 'error':
        return <AlertCircle size={20} color={COLORS.error} />;
      case 'info':
        return <Info size={20} color={COLORS.primary} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return COLORS.available;
      case 'error':
        return COLORS.unavailable;
      case 'info':
        return COLORS.confirmed;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, backgroundColor: getBackgroundColor() },
      ]}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={onHide} style={styles.closeButton}>
        <X size={16} color={COLORS.textLight} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SIZES.xl * 2,
    left: SIZES.md,
    right: SIZES.md,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.md,
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SIZES.sm,
    flex: 1,
  },
  closeButton: {
    marginLeft: SIZES.sm,
    padding: SIZES.xs,
  },
});

export default Toast; 