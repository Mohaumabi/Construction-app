import { Theme } from '@/types';

export const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: '#FFC107',      // Construction Yellow
    secondary: '#212121',    // Matte Black
    accent: '#757575',       // Steel Gray
    alert: '#FF5722',        // Bright Orange
    background: '#F5F5F5',   // Background Light
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    card: '#FFFFFF',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
};

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: '#FFC107',      // Construction Yellow
    secondary: '#212121',    // Matte Black
    accent: '#757575',       // Steel Gray
    alert: '#FF5722',        // Bright Orange
    background: '#121212',   // Background Dark
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    card: '#1E1E1E',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  },
};

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};

export const commonStyles = {
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};