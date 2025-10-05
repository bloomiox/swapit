import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const BoostItemPopup = ({ visible, onClose, onBoost }) => {
  const { isDarkMode } = useTheme();

  const boostOptions = [
    { days: 1, price: 'CHF 1.90' },
    { days: 3, price: 'CHF 4.90' },
    { days: 5, price: 'CHF 7.90' },
  ];

  // Apply theme styles
  const themedStyles = {
    ...styles,
    container: {
      ...styles.container,
      backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(0, 0, 0, 0.5)',
    },
    popupContent: {
      ...styles.popupContent,
      backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    },
    title: {
      ...styles.title,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    description: {
      ...styles.description,
      color: isDarkMode ? '#B0B0B0' : '#6E6D7A',
    },
    optionButton: {
      ...styles.optionButton,
      backgroundColor: isDarkMode ? '#333333' : '#F7F5EC',
      borderColor: isDarkMode ? '#444444' : '#E7E8EC',
    },
    optionText: {
      ...styles.optionText,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    optionPrice: {
      ...styles.optionPrice,
      color: isDarkMode ? '#119C21' : '#119C21',
    },
    laterButton: {
      ...styles.laterButton,
      backgroundColor: isDarkMode ? '#333333' : '#F0F0F0',
    },
    laterText: {
      ...styles.laterText,
      color: isDarkMode ? '#FFFFFF' : '#021229',
    },
    closeButton: {
      ...styles.closeButton,
      backgroundColor: isDarkMode ? '#119C21' : '#119C21',
    },
    closeText: {
      ...styles.closeText,
      color: '#FFFFFF',
    },
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={themedStyles.container}>
        <View style={themedStyles.popupContent}>
          <View style={themedStyles.header}>
            <Text style={themedStyles.title}>Boost Item</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={isDarkMode ? "#FFFFFF" : "#021229"} />
            </TouchableOpacity>
          </View>
          
          <Text style={themedStyles.description}>
            Get more visibility for your item. Choose how long you want to boost it:
          </Text>
          
          <View style={themedStyles.optionsContainer}>
            {boostOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={themedStyles.optionButton}
                onPress={() => onBoost(option)}
              >
                <Text style={themedStyles.optionText}>{option.days} day{option.days > 1 ? 's' : ''}</Text>
                <Text style={themedStyles.optionPrice}>{option.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={themedStyles.buttonContainer}>
            <TouchableOpacity style={themedStyles.laterButton} onPress={onClose}>
              <Text style={themedStyles.laterText}>Maybe Later</Text>
            </TouchableOpacity>
            <TouchableOpacity style={themedStyles.closeButton} onPress={onClose}>
              <Text style={themedStyles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
  },
  description: {
    fontSize: 16,
    color: '#6E6D7A',
    marginBottom: 24,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F5EC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#119C21',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  laterButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  laterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#119C21',
    borderRadius: 16,
    padding: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default BoostItemPopup;