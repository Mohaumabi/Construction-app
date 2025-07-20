import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { commonStyles } from '@/utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const { theme } = useSelector((state: RootState) => state.theme);

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 24 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      borderRadius: commonStyles.borderRadius.medium,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: size === 'small' ? 32 : size === 'large' ? 56 : 44,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.accent : theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.border : theme.colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.colors.border : theme.colors.primary,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: disabled ? theme.colors.border : theme.colors.error,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : '#FFFFFF',
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : '#FFFFFF',
        };
      case 'outline':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : theme.colors.primary,
        };
      case 'danger':
        return {
          ...baseStyle,
          color: disabled ? theme.colors.textSecondary : '#FFFFFF',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <Text style={{ marginRight: 8 }}>{icon}</Text>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}