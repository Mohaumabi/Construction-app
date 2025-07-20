import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { commonStyles } from '@/utils/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  elevation?: boolean;
}

export default function Card({
  children,
  style,
  padding = commonStyles.spacing.md,
  margin = 0,
  elevation = true,
}: CardProps) {
  const { theme } = useSelector((state: RootState) => state.theme);

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: commonStyles.borderRadius.large,
    padding,
    margin,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...(elevation && commonStyles.shadow),
  };

  return <View style={[cardStyle, style]}>{children}</View>;
}