import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16, // Match Figma design
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#119C21', // Primary/Primary
  },
  secondary: {
    backgroundColor: '#10B981',
  },
  outline: {
    backgroundColor: '#FFFFFF', // General/White
    borderWidth: 1,
    borderColor: '#E7E8EC', // General/Stroke
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600', // Body/Normal/Bold
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF', // General/White
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#021229', // General/Primary
  },
});