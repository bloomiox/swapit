import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Button } from '../../src/components/shared/Button/Button';
import { SocialButton } from '../../src/components/shared/SocialButton/SocialButton';
import { TextInput } from '../../src/components/forms/TextInput';
import { ValidationMessage } from '../../src/components/forms/ValidationMessage';
import { useAuthStore } from '../../src/stores/authStore';
import { signInWithGoogle, signInWithApple, resetPassword } from '../../src/services/supabase';
import { validateEmail, validateRequired, getAuthErrorMessage } from '../../src/utils';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { signIn } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate email
    const emailError = validateRequired(formData.email, 'Email');
    if (emailError) {
      newErrors.email = emailError;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    const passwordError = validateRequired(formData.password, 'Password');
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear general error
    if (errors.general) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        setErrors({ general: getAuthErrorMessage(error) });
      } else {
        // Navigation will be handled by auth state change
        router.replace('/(tabs)/discover');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setErrors({});

    try {
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else {
        result = await signInWithApple();
      }

      if (result.error) {
        setErrors({ general: getAuthErrorMessage(result.error) });
      }
      // Success will be handled by auth state change
    } catch (error) {
      setErrors({ 
        general: `Failed to sign in with ${provider}. Please try again.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await resetPassword(formData.email);

      if (error) {
        setErrors({ general: getAuthErrorMessage(error) });
      } else {
        Alert.alert(
          'Password Reset Sent',
          'Check your email for password reset instructions.',
          [{ text: 'OK', onPress: () => setShowForgotPassword(false) }]
        );
      }
    } catch (error) {
      setErrors({ general: 'Failed to send password reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignUp = () => {
    router.push('/(auth)/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Content */}
          <View style={styles.content}>
            {/* Header Text */}
            <View style={styles.textSection}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to continue swapping</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {errors.general && (
                <ValidationMessage
                  message={errors.general}
                  type="error"
                  visible={true}
                />
              )}

              <TextInput
                label="Email"
                placeholder="ex: johndoe@gmail.com"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />

              <TextInput
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                error={errors.password}
                secureTextEntry
                autoComplete="password"
                editable={!isLoading}
              />

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => setShowForgotPassword(true)}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <Button
                title={isLoading ? 'Logging in...' : 'Login'}
                onPress={handleSignIn}
                disabled={isLoading}
                variant="primary"
                size="large"
                style={styles.loginButton}
              />
            </View>

            {/* OR Divider */}
            <View style={styles.orSection}>
              <View style={styles.dividerLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialButtons}>
              <SocialButton
                provider="google"
                onPress={() => handleSocialSignIn('google')}
                disabled={isLoading}
                size="large"
                style={styles.socialButton}
              />
              
              {Platform.OS === 'ios' && (
                <SocialButton
                  provider="apple"
                  onPress={() => handleSocialSignIn('apple')}
                  disabled={isLoading}
                  size="large"
                  style={styles.socialButton}
                />
              )}

              {/* Sign Up Link */}
              <TouchableOpacity 
                onPress={navigateToSignUp} 
                disabled={isLoading}
                style={styles.signUpButton}
              >
                <Text style={styles.signUpText}>Don't have an account? Join us</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail"
              editable={!isLoading}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowForgotPassword(false)}
                variant="outline"
                disabled={isLoading}
                style={styles.modalButton}
              />
              <Button
                title={isLoading ? 'Sending...' : 'Send Reset Link'}
                onPress={handleForgotPassword}
                disabled={isLoading}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC', // General/BG from Figma
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 52,
  },
  content: {
    flex: 1,
    // gap: 24,
  },
  textSection: {
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#021229', // General/Primary
    lineHeight: 40, // 1.25em
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6E6D7A', // General/Secondary
    lineHeight: 24, // 1.5em
  },
  form: {
    // gap: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#119C21', // Primary/Primary
    lineHeight: 20, // 1.4285714285714286em
  },
  loginButton: {
    backgroundColor: '#119C21', // Primary/Primary
    borderRadius: 16,
    minHeight: 48,
  },
  orSection: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C7D1D9', // General/Tertiary
  },
  orText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6E6D7A', // General/Secondary
    lineHeight: 20, // 1.4285714285714286em
    textAlign: 'center',
  },
  socialButtons: {
    alignItems: 'center',
    // gap: 8,
  },
  socialButton: {
    backgroundColor: '#FFFFFF', // General/White
    borderColor: '#E7E8EC', // General/Stroke
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 48,
  },
  signUpButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#119C21', // Primary/Primary
    lineHeight: 24, // 1.5em
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    // gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
  },
});