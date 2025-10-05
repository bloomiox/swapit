import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryFilterScreen = ({ navigation, route }) => {
  const { selectedCategory, onCategorySelect } = route.params || {};
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory || null);

  const categories = [
    { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: '2', name: 'Clothing', icon: 'shirt-outline' },
    { id: '3', name: 'Books', icon: 'book-outline' },
    { id: '4', name: 'Furniture', icon: 'bed-outline' },
    { id: '5', name: 'Sports', icon: 'football-outline' },
    { id: '6', name: 'Toys', icon: 'game-controller-outline' },
  ];

  const handleApply = () => {
    if (onCategorySelect) {
      onCategorySelect(localSelectedCategory);
    }
    navigation.goBack();
  };

  const handleReset = () => {
    setLocalSelectedCategory(null);
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
        <Text style={styles.appBarTitle}>Category</Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                localSelectedCategory === category.id && styles.selectedCategoryItem
              ]}
              onPress={() => setLocalSelectedCategory(
                localSelectedCategory === category.id ? null : category.id
              )}
            >
              <View style={styles.categoryIconContainer}>
                <Ionicons 
                  name={category.icon} 
                  size={24} 
                  color={localSelectedCategory === category.id ? '#119C21' : '#021229'} 
                />
              </View>
              <Text style={[
                styles.categoryText,
                localSelectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  selectedCategoryItem: {
    borderColor: '#119C21',
    backgroundColor: '#D8F7D7',
  },
  categoryIconContainer: {
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#021229',
  },
  selectedCategoryText: {
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

export default CategoryFilterScreen;