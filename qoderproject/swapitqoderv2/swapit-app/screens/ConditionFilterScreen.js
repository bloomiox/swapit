import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConditionFilterScreen = ({ navigation, route }) => {
  const { selectedCondition, onConditionSelect } = route.params || {};
  const [localSelectedCondition, setLocalSelectedCondition] = useState(selectedCondition || null);

  const conditions = [
    { id: '1', name: 'New', icon: 'happy-outline' },
    { id: '2', name: 'Like New', icon: 'happy' },
    { id: '3', name: 'Good', icon: 'heart-half' },
    { id: '4', name: 'Fair', icon: 'sad' },
    { id: '5', name: 'Poor', icon: 'heart-dislike' },
  ];

  const handleApply = () => {
    if (onConditionSelect) {
      onConditionSelect(localSelectedCondition);
    }
    navigation.goBack();
  };

  const handleReset = () => {
    setLocalSelectedCondition(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F5EC" />
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Condition</Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.conditionBadges}>
          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition.id}
              style={[
                styles.conditionBadge,
                localSelectedCondition === condition.id && styles.selectedConditionBadge
              ]}
              onPress={() => setLocalSelectedCondition(
                localSelectedCondition === condition.id ? null : condition.id
              )}
            >
              <Ionicons 
                name={condition.icon} 
                size={16} 
                color={localSelectedCondition === condition.id ? '#119C21' : '#021229'} 
              />
              <Text style={[
                styles.conditionText,
                localSelectedCondition === condition.id && styles.selectedConditionText
              ]}>
                {condition.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
    paddingTop: 50,
  },
  backButton: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
  },
  resetButton: {
    padding: 4,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#119C21',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  conditionBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    backgroundColor: '#FFFFFF',
  },
  selectedConditionBadge: {
    borderColor: '#119C21',
    backgroundColor: '#D8F7D7',
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#021229',
    marginLeft: 4,
  },
  selectedConditionText: {
    color: '#119C21',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
  },
  applyButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ConditionFilterScreen;