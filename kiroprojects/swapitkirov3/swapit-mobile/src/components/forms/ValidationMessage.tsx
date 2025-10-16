import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ValidationMessageProps {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  visible?: boolean;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = 'error',
  visible = true,
}) => {
  if (!visible || !message) {
    return null;
  }

  const getIconName = () => {
    switch (type) {
      case 'error':
        return 'alert-circle';
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'info':
        return 'information-circle';
      default:
        return 'alert-circle';
    }
  };

  return (
    <View style={[styles.container, styles[type]]}>
      <Ionicons
        name={getIconName()}
        size={16}
        color={styles[`${type}Text`].color}
        style={styles.icon}
      />
      <Text style={[styles.text, styles[`${type}Text`]]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  error: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  success: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  warning: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  info: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  errorText: {
    color: '#DC2626',
  },
  successText: {
    color: '#16A34A',
  },
  warningText: {
    color: '#D97706',
  },
  infoText: {
    color: '#2563EB',
  },
});