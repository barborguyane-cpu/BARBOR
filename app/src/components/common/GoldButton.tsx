import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, shadows } from '../../theme';

interface GoldButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GoldButton: React.FC<GoldButtonProps> = ({
  title,
  onPress,
  loading,
  disabled,
  variant = 'gold',
  size = 'md',
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
    md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  };

  const textSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  if (variant === 'gold') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.wrapper, style, isDisabled && styles.disabled]}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={['#F0D060', '#D4AF37', '#A08828']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, sizeStyles[size]]}
        >
          {loading ? (
            <ActivityIndicator color={colors.black} size="small" />
          ) : (
            <Text style={[styles.textGold, { fontSize: textSizes[size] }, textStyle]}>
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[styles.outline, sizeStyles[size], style, isDisabled && styles.disabled]}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={colors.gold} size="small" />
        ) : (
          <Text style={[styles.textOutline, { fontSize: textSizes[size] }, textStyle]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[sizeStyles[size], style, isDisabled && styles.disabled]}
      activeOpacity={0.7}
    >
      <Text style={[styles.textGhost, { fontSize: textSizes[size] }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.gold,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  textGold: {
    color: colors.black,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textOutline: {
    color: colors.gold,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  textGhost: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
