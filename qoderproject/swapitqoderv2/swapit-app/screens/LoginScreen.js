import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const handleLogin = () => {
    // Simple validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Navigate to main app (in a real app, you would authenticate first)
    navigation.replace('MainTabs');
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue swapping</Text>
        </View>
        
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="ex: johndoe@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={hidePassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityIcon}>
                <Text>{hidePassword ? 'Show' : 'Hide'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => {}}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          
          {/* Divider */}
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>
          
          {/* Sign Up */}
          <TouchableOpacity 
            style={styles.signUpButton} 
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpText}>Don't have an account? Join us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    gap: 24,
  },
  textContainer: {
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#021229',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 12,
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#6E6D7A',
  },
  visibilityIcon: {
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#119C21',
  },
  loginButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#C7D1D9',
  },
  orText: {
    fontSize: 14,
    color: '#6E6D7A',
  },
  socialButtonsContainer: {
    gap: 8,
  },
  socialButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 16,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#021229',
  },
  signUpButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#119C21',
  },
});

export default LoginScreen;