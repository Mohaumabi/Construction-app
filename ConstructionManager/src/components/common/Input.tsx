import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/store';
import { commonStyles } from '@/utils/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  autoCapitalize = 'sentences',
}: InputProps) {
  const { theme } = useSelector((state: RootState) => state.theme);
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle: ViewStyle = {
    marginBottom: commonStyles.spacing.md,
    ...style,
  };

  const labelStyle: TextStyle = {
    fontSize: commonStyles.fontSize.sm,
    fontWeight: commonStyles.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: commonStyles.spacing.xs,
  };

  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: error
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.border,
    borderRadius: commonStyles.borderRadius.medium,
    paddingHorizontal: commonStyles.spacing.md,
    paddingVertical: multiline ? commonStyles.spacing.md : commonStyles.spacing.sm,
    minHeight: multiline ? numberOfLines * 20 + 32 : 44,
  };

  const textInputStyle: TextStyle = {
    flex: 1,
    fontSize: commonStyles.fontSize.md,
    color: theme.colors.text,
    paddingHorizontal: leftIcon || rightIcon ? commonStyles.spacing.xs : 0,
    textAlignVertical: multiline ? 'top' : 'center',
    ...inputStyle,
  };

  const errorStyle: TextStyle = {
    fontSize: commonStyles.fontSize.xs,
    color: theme.colors.error,
    marginTop: commonStyles.spacing.xs,
  };

  const iconColor = disabled
    ? theme.colors.textSecondary
    : error
    ? theme.colors.error
    : isFocused
    ? theme.colors.primary
    : theme.colors.accent;

  return (
    <View style={containerStyle}>
      {label && <Text style={labelStyle}>{label}</Text>}
      <View style={inputContainerStyle}>
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={iconColor}
            style={{ marginRight: commonStyles.spacing.xs }}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={!disabled}
          style={textInputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={autoCapitalize}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} disabled={!onRightIconPress}>
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={iconColor}
              style={{ marginLeft: commonStyles.spacing.xs }}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
}