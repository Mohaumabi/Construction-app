import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { AppDispatch, RootState } from '@/store';
import { signInWithEmail, signInWithGoogle, signInWithApple, clearError } from '@/store/slices/authSlice';
import { NavigationProps } from '@/types';
import { commonStyles } from '@/utils/theme';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';

export default function LoginScreen({ navigation }: NavigationProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.theme);
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(signInWithEmail(formData)).unwrap();
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await dispatch(signInWithGoogle()).unwrap();
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const handleAppleLogin = async () => {
    try {
      await dispatch(signInWithApple()).unwrap();
    } catch (error) {
      // Error is handled by useEffect
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Construction Manager
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Sign in to manage your construction projects
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            leftIcon="mail-outline"
            error={formErrors.email}
            autoCapitalize="none"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry={!showPassword}
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={formErrors.password}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          <Button
            title="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="outline"
            style={styles.forgotButton}
          />
        </Card>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
            Or continue with
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <View style={styles.socialButtons}>
          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            variant="outline"
            style={styles.socialButton}
          />

          {Platform.OS === 'ios' && (
            <Button
              title="Continue with Apple"
              onPress={handleAppleLogin}
              variant="outline"
              style={styles.socialButton}
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <Button
            title="Sign Up"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            size="small"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: commonStyles.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: commonStyles.spacing.xl,
  },
  title: {
    fontSize: commonStyles.fontSize.xxxl,
    fontWeight: commonStyles.fontWeight.bold,
    textAlign: 'center',
    marginBottom: commonStyles.spacing.sm,
  },
  subtitle: {
    fontSize: commonStyles.fontSize.md,
    textAlign: 'center',
    marginBottom: commonStyles.spacing.lg,
  },
  formCard: {
    marginBottom: commonStyles.spacing.lg,
  },
  loginButton: {
    marginTop: commonStyles.spacing.md,
  },
  forgotButton: {
    marginTop: commonStyles.spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: commonStyles.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: commonStyles.spacing.md,
    fontSize: commonStyles.fontSize.sm,
  },
  socialButtons: {
    marginBottom: commonStyles.spacing.lg,
  },
  socialButton: {
    marginBottom: commonStyles.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: commonStyles.spacing.lg,
  },
  footerText: {
    fontSize: commonStyles.fontSize.md,
  },
});