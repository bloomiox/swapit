import React, { useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  error?: string | undefined;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: object;
  inputStyle?: object;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  variant = 'outlined',
  size = 'medium',
  secureTextEntry,
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  const showPasswordToggle = secureTextEntry && !rightIcon;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, error && styles.labelError]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.inputContainer,
          styles[variant],
          styles[size],
          isFocused && styles.focused,
          error && styles.error,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={error ? '#EF4444' : isFocused ? '#3B82F6' : '#6B7280'}
            style={styles.leftIcon}
          />
        )}
        
        <RNTextInput
          {...props}
          style={[styles.input, inputStyle]}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor="#9CA3AF"
        />
        
        {showPasswordToggle && (
          <TouchableOpacity onPress={handleToggleSecure} style={styles.rightIcon}>
            <Ionicons
              name={isSecure ? 'eye-off' : 'eye'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={error ? '#EF4444' : isFocused ? '#3B82F6' : '#6B7280'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // Remove default margin to control spacing in parent
  },
  label: {
    fontSize: 16,
    fontWeight: '600', // Body/Normal/Bold
    color: '#021229', // General/Primary
    marginBottom: 8,
  },
  labelError: {
    color: '#EF4444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16, // Match Figma design
    backgroundColor: '#FFFFFF', // General/Input
    paddingHorizontal: 16,
    paddingVertical: 12,
    // gap: 12,
  },
  default: {
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
    backgroundColor: 'transparent',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#E7E8EC', // General/Stroke
  },
  filled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: 16,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  focused: {
    borderColor: '#119C21', // Primary/Primary
    shadowColor: '#119C21',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  error: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400', // Body/Normal/Regular
    color: '#021229', // General/Primary
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 12, // Add margin back since we removed gap
  },
  rightIcon: {
    marginLeft: 12, // Add margin back since we removed gap
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#6E6D7A', // General/Secondary
    marginTop: 4,
  },
  errorText: {
    color: '#EF4444',
  },
});