import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const OnboardingCategoriesScreen = ({ navigation }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const categories = [
    { id: 1, name: 'Electronics', icon: '📱' },
    { id: 2, name: 'Clothing', icon: '👕' },
    { id: 3, name: 'Books', icon: '📚' },
    { id: 4, name: 'Home & Decor', icon: '🏠' },
    { id: 5, name: 'Sports & Fitness', icon: '⚽' },
    { id: 6, name: 'Toys & Games', icon: '🎮' },
    { id: 7, name: 'Art', icon: '🎨' },
    { id: 8, name: 'Jewelry', icon: '💍' },
    { id: 9, name: 'Furniture', icon: '🪑' },
    { id: 10, name: 'Collectibles', icon: '🏺' },
    { id: 11, name: 'Tools', icon: '🔧' },
    { id: 12, name: 'Other', icon: '📦' }
  ];

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(item => item !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category.id]);
    }
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Error', 'Please select at least one category');
      return;
    }
    
    // Navigate to next onboarding screen
    navigation.replace('OnboardingOverview');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar - Step 2 of 3 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '66.66%' }]} />
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar} />

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.appBarSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Choose your interests</Text>
          <Text style={styles.subtitle}>Select categories you are interested in to personalize your feed</Text>
        </View>

        <ScrollView style={styles.categoriesContainer} contentContainerStyle={styles.categoriesContentContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategories.includes(category.id) && styles.selectedCategory
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategories.includes(category.id) && styles.selectedCategoryText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#FFFFFF',
  },
  progress: {
    height: '100%',
    backgroundColor: '#119C21',
  },
  statusBar: {
    height: 32,
    backgroundColor: '#F7F5EC',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#F7F5EC',
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIcon: {
    fontSize: 20,
    color: '#021229',
  },
  appBarSpacer: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  textContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  categoriesContainer: {
    flex: 1,
  },
  categoriesContentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    width: 171,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#D8F7D7',
    borderColor: '#119C21',
    borderWidth: 2,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#021229',
  },
  selectedCategoryText: {
    color: '#021229',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#F7F5EC',
  },
  continueButton: {
    backgroundColor: '#119C21',
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 134,
    height: 5,
    borderRadius: 100,
    backgroundColor: '#021229',
    marginBottom: 10,
  },
});

export default OnboardingCategoriesScreen;