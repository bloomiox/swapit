import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SocialButtonProps {
  provider: 'google' | 'facebook' | 'apple';
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  disabled = false,
  style,
  size = 'medium',
}) => {
  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          title: 'Continue with Google',
          icon: 'logo-google' as keyof typeof Ionicons.glyphMap,
          backgroundColor: '#FFFFFF', // General/White
          textColor: '#021229', // General/Primary
          borderColor: '#E7E8EC', // General/Stroke
        };
      case 'facebook':
        return {
          title: 'Continue with Facebook',
          icon: 'logo-facebook' as keyof typeof Ionicons.glyphMap,
          backgroundColor: '#1877F2',
          textColor: '#FFFFFF',
          borderColor: '#1877F2',
        };
      case 'apple':
        return {
          title: 'Continue with Apple',
          icon: 'logo-apple' as keyof typeof Ionicons.glyphMap,
          backgroundColor: '#FFFFFF', // General/White
          textColor: '#021229', // General/Primary
          borderColor: '#E7E8EC', // General/Stroke
        };
      default:
        return {
          title: 'Continue',
          icon: 'log-in' as keyof typeof Ionicons.glyphMap,
          backgroundColor: '#FFFFFF',
          textColor: '#021229',
          borderColor: '#E7E8EC',
        };
    }
  };

  const config = getProviderConfig();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[size],
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons
          name={config.icon}
          size={20}
          color={config.textColor}
          style={styles.icon}
        />
        <Text
          style={[
            styles.text,
            size === 'small' ? styles.smallText : size === 'large' ? styles.largeText : styles.mediumText,
            { color: config.textColor },
          ]}
        >
          {config.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16, // Match Figma design
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0, // Remove default margin
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // gap: 8, // Use gap instead of margin
  },
  icon: {
    marginRight: 8, // Add margin back since we removed gap
  },
  text: {
    fontWeight: '600', // Body/Normal/Bold
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 16, // Keep consistent with design
  },
});