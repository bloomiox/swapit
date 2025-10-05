import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FiltersScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [distance, setDistance] = useState(10);
  const [freeItems, setFreeItems] = useState(false);

  const categories = [
    { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: '2', name: 'Clothing', icon: 'shirt-outline' },
    { id: '3', name: 'Books', icon: 'book-outline' },
    { id: '4', name: 'Furniture', icon: 'bed-outline' },
    { id: '5', name: 'Sports', icon: 'football-outline' },
    { id: '6', name: 'Toys', icon: 'game-controller-outline' },
  ];

  const conditions = [
    { id: '1', name: 'New', icon: 'happy-outline' },
    { id: '2', name: 'Like New', icon: 'happy' },
    { id: '3', name: 'Good', icon: 'heart-half' },
    { id: '4', name: 'Fair', icon: 'sad' },
    { id: '5', name: 'Poor', icon: 'heart-dislike' },
  ];

  const handleApplyFilters = () => {
    // Apply filters logic
    navigation.goBack();
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedCondition(null);
    setDistance(10);
    setFreeItems(false);
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
        <Text style={styles.appBarTitle}>Filters</Text>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleResetFilters}
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === category.id && styles.selectedCategoryItem
                ]}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons 
                    name={category.icon} 
                    size={24} 
                    color={selectedCategory === category.id ? '#119C21' : '#021229'} 
                  />
                </View>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Condition Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <View style={styles.conditionBadges}>
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition.id}
                style={[
                  styles.conditionBadge,
                  selectedCondition === condition.id && styles.selectedConditionBadge
                ]}
                onPress={() => setSelectedCondition(
                  selectedCondition === condition.id ? null : condition.id
                )}
              >
                <Ionicons 
                  name={condition.icon} 
                  size={16} 
                  color={selectedCondition === condition.id ? '#119C21' : '#021229'} 
                />
                <Text style={[
                  styles.conditionText,
                  selectedCondition === condition.id && styles.selectedConditionText
                ]}>
                  {condition.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Distance Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceText}>{distance} km</Text>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View 
                  style={[
                    styles.sliderFill, 
                    { width: `${(distance / 50) * 100}%` }
                  ]} 
                />
                <View 
                  style={[
                    styles.sliderThumb, 
                    { left: `${(distance / 50) * 100}%` }
                  ]} 
                />
              </View>
            </View>
            <View style={styles.distanceLabels}>
              <Text style={styles.distanceLabel}>0 km</Text>
              <Text style={styles.distanceLabel}>50 km</Text>
            </View>
          </View>
        </View>

        {/* Free Items Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Free Items</Text>
          <TouchableOpacity 
            style={[
              styles.toggleContainer,
              freeItems && styles.selectedToggleContainer
            ]}
            onPress={() => setFreeItems(!freeItems)}
          >
            <View style={[
              styles.toggleButton,
              freeItems && styles.selectedToggleButton
            ]}>
              <Ionicons 
                name={freeItems ? 'checkmark' : 'close'} 
                size={16} 
                color={freeItems ? '#FFFFFF' : '#6E6D7A'} 
              />
            </View>
            <Text style={styles.toggleText}>Show only free items</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApplyFilters}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
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
  section: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
  conditionBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  distanceContainer: {
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 16,
  },
  sliderContainer: {
    width: '100%',
    marginBottom: 16,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#E7E8EC',
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#119C21',
    borderRadius: 2,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#119C21',
    position: 'absolute',
    top: -8,
    marginLeft: -10,
  },
  distanceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  distanceLabel: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  selectedToggleContainer: {
    borderColor: '#119C21',
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedToggleButton: {
    backgroundColor: '#119C21',
    borderColor: '#119C21',
  },
  toggleText: {
    fontSize: 16,
    color: '#021229',
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

export default FiltersScreen;