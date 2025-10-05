import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample search results
  const searchResults = [
    { id: '1', title: 'Vintage Camera', category: 'Electronics', location: 'Berkeley CA · 9.3km' },
    { id: '2', title: 'Leather Jacket', category: 'Clothing', location: 'Berkeley CA · 9.3km' },
    { id: '3', title: 'Cookbook Collection', category: 'Books', location: 'Berkeley CA · 9.3km' },
    { id: '4', title: 'Bluetooth Speaker', category: 'Electronics', location: 'Berkeley CA · 9.3km' },
    { id: '5', title: 'Wooden Stool', category: 'Furniture', location: 'Berkeley CA · 9.3km' },
  ];

  const recentSearches = [
    'Vintage Camera',
    'Leather Bag',
    'Bluetooth Speaker',
    'Cookbooks',
  ];

  const popularCategories = [
    { id: '1', name: 'Electronics', icon: 'phone-portrait-outline' },
    { id: '2', name: 'Clothing', icon: 'shirt-outline' },
    { id: '3', name: 'Books', icon: 'book-outline' },
    { id: '4', name: 'Furniture', icon: 'bed-outline' },
    { id: '5', name: 'Sports', icon: 'football-outline' },
    { id: '6', name: 'Toys', icon: 'game-controller-outline' },
  ];

  const handleSearch = () => {
    if (searchQuery.length > 0) {
      navigation.navigate('SearchResults');
    }
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
    >
      <View style={styles.searchResultImagePlaceholder} />
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultTitle}>{item.title}</Text>
        <Text style={styles.searchResultCategory}>{item.category}</Text>
        <View style={styles.searchResultLocationContainer}>
          <Ionicons name="location-outline" size={12} color="#666" />
          <Text style={styles.searchResultLocation}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity 
      style={styles.recentSearchItem}
      onPress={() => {
        setSearchQuery(item);
        navigation.navigate('SearchResults');
      }}
    >
      <Ionicons name="time-outline" size={16} color="#666" />
      <Text style={styles.recentSearchText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color="#119C21" />
      </View>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.length === 0 ? (
        // Search Suggestions
        <ScrollView style={styles.content}>
          {/* Recent Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <FlatList
              data={recentSearches}
              renderItem={renderRecentSearch}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>

          {/* Popular Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <FlatList
              data={popularCategories}
              renderItem={renderCategory}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        </ScrollView>
      ) : (
        // Search Results
        <FlatList
          data={searchResults}
          renderItem={renderSearchItem}
          keyExtractor={item => item.id}
          style={styles.searchResults}
          contentContainerStyle={styles.searchResultsContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F5EC',
    paddingTop: 50,
  },
  backButton: {
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recentSearchText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D8F7D7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  searchResults: {
    flex: 1,
  },
  searchResultsContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  searchResultImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#E7E8EC',
    borderRadius: 8,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  searchResultCategory: {
    fontSize: 14,
    color: '#6E6D7A',
    marginBottom: 4,
  },
  searchResultLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchResultLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default SearchScreen;