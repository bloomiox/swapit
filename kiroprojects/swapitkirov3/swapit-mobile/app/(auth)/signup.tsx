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
import { signInWithGoogle, signInWithApple } from '../../src/services/supabase';
import { 
  validateEmail, 
  validatePassword, 
  validateRequired, 
  getAuthErrorMessage 
} from '../../src/utils';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignUpScreen() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const { signUp } = useAuthStore();

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
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid && passwordValidation.errors.length > 0) {
        newErrors.password = passwordValidation.errors[0] || 'Password validation failed';
      }
    }

    // Validate confirm password
    const confirmPasswordError = validateRequired(formData.confirmPassword, 'Confirm password');
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await signUp(formData.email, formData.password);

      if (error) {
        // Check if it's an email confirmation required error
        if (error.message?.includes('confirm') || error.message?.includes('verification')) {
          setRegisteredEmail(formData.email);
          setShowEmailVerification(true);
        } else {
          setErrors({ general: getAuthErrorMessage(error) });
        }
      } else {
        // Check if user needs email verification
        setRegisteredEmail(formData.email);
        setShowEmailVerification(true);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider: 'google' | 'apple') => {
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
        general: `Failed to sign up with ${provider}. Please try again.` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerificationClose = () => {
    setShowEmailVerification(false);
    // Navigate to login screen
    router.replace('/(auth)/login');
  };

  const navigateToLogin = () => {
    router.push('/(auth)/login');
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
              <Text style={styles.title}>Create an account</Text>
              <Text style={styles.subtitle}>Join the swapping community</Text>
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
                autoComplete="new-password"
                editable={!isLoading}
              />

              <TextInput
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                error={errors.confirmPassword}
                secureTextEntry
                autoComplete="new-password"
                editable={!isLoading}
              />

              {/* Terms Text */}
              <Text style={styles.termsText}>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </Text>

              {/* Continue Button */}
              <Button
                title={isLoading ? 'Creating Account...' : 'Continue'}
                onPress={handleSignUp}
                disabled={isLoading}
                variant="primary"
                size="large"
                style={styles.continueButton}
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
                onPress={() => handleSocialSignUp('google')}
                disabled={isLoading}
                size="large"
                style={styles.socialButton}
              />
              
              {Platform.OS === 'ios' && (
                <SocialButton
                  provider="apple"
                  onPress={() => handleSocialSignUp('apple')}
                  disabled={isLoading}
                  size="large"
                  style={styles.socialButton}
                />
              )}

              {/* Login Link */}
              <TouchableOpacity 
                onPress={navigateToLogin} 
                disabled={isLoading}
                style={styles.loginButton}
              >
                <Text style={styles.loginText}>Already have an account? Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Email Verification Modal */}
      {showEmailVerification && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Check Your Email</Text>
            <Text style={styles.modalSubtitle}>
              We've sent a verification link to{'\n'}
              <Text style={styles.modalEmail}>{registeredEmail}</Text>
            </Text>
            
            <Text style={styles.modalInstructions}>
              Please check your email and click the verification link to activate your account. 
              You may need to check your spam folder.
            </Text>

            <Button
              title="Continue to Login"
              onPress={handleEmailVerificationClose}
              style={styles.modalButton}
            />
            
            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                // TODO: Implement resend verification email
                Alert.alert('Resend Email', 'Resend verification email functionality will be implemented.');
              }}
            >
              <Text style={styles.resendButtonText}>Didn't receive the email? Resend</Text>
            </TouchableOpacity>
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
  termsText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6E6D7A', // General/Secondary
    lineHeight: 24, // 1.5em
    textAlign: 'left',
  },
  continueButton: {
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
  loginButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loginText: {
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
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalEmail: {
    fontWeight: '600',
    color: '#111827',
  },
  modalInstructions: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  modalButton: {
    width: '100%',
    marginBottom: 16,
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    textAlign: 'center',
  },
});