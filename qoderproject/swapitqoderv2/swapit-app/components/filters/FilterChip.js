import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterChip = ({ 
  title, 
  isActive, 
  onPress, 
  icon, 
  style 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.filterChip,
        isActive && styles.activeFilterChip,
        style
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        isActive && styles.activeFilterChipText
      ]}>
        {title}
      </Text>
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={isActive ? '#119C21' : '#000'} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  activeFilterChip: {
    borderColor: '#119C21',
    backgroundColor: '#D8F7D7',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginRight: 4,
  },
  activeFilterChipText: {
    color: '#119C21',
  },
});

export default FilterChip;