import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'flat' | 'elevated';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  style,
  children,
  ...props
}) => {
  // Get card style based on variant
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'flat':
        return styles.flatCard;
      case 'elevated':
        return styles.elevatedCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <View style={[styles.card, getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.md,
    padding: SIZES.md,
    backgroundColor: COLORS.card,
  },
  defaultCard: {
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flatCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  elevatedCard: {
    ...SHADOWS.medium,
  },
});

export default Card;