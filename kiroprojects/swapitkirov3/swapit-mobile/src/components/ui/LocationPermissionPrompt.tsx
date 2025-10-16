import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationPermissionPromptProps {
  visible: boolean;
  onRequestPermission: () => void;
  onDismiss: () => void;
  title?: string;
  message?: string;
}

export const LocationPermissionPrompt: React.FC<LocationPermissionPromptProps> = ({
  visible,
  onRequestPermission,
  onDismiss,
  title = "Enable Location Access",
  message = "Allow SwapIt to access your location to find items near you and show accurate distances.",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={48} color="#3B82F6" />
          </View>

          {/* Content */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name="search" size={16} color="#10B981" />
              <Text style={styles.benefitText}>Find items near you</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="navigate" size={16} color="#10B981" />
              <Text style={styles.benefitText}>See accurate distances</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="filter" size={16} color="#10B981" />
              <Text style={styles.benefitText}>Filter by location</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onDismiss}
              style={styles.dismissButton}
            >
              <Text style={styles.dismissButtonText}>Not Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onRequestPermission}
              style={styles.allowButton}
            >
              <Text style={styles.allowButtonText}>Allow Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  dismissButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  allowButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});