import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppliedFilterChip = ({ 
  icon, 
  value, 
  onClear, 
  style 
}) => {
  return (
    <View style={[styles.appliedFilterChip, style]}>
      {icon && (
        <Ionicons name={icon} size={14} color="#119C21" style={styles.appliedFilterIcon} />
      )}
      <Text style={styles.appliedFilterText}>
        {value}
      </Text>
      <TouchableOpacity 
        style={styles.clearFilterButton}
        onPress={onClear}
      >
        <Ionicons name="close-circle" size={16} color="#119C21" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appliedFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#119C21',
  },
  appliedFilterIcon: {
    marginRight: 4,
  },
  appliedFilterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#021229',
    marginRight: 4,
  },
  clearFilterButton: {
    padding: 2,
  },
});

export default AppliedFilterChip;