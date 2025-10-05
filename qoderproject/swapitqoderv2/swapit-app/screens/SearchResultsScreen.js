import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchResultsScreen = ({ navigation }) => {
  // Sample search results
  const searchResults = [
    { id: '1', title: 'Vintage Camera', category: 'Electronics', location: 'Berkeley CA · 9.3km', free: false },
    { id: '2', title: 'Leather Jacket', category: 'Clothing', location: 'Berkeley CA · 9.3km', free: true },
    { id: '3', title: 'Cookbook Collection', category: 'Books', location: 'Berkeley CA · 9.3km', free: false },
    { id: '4', title: 'Bluetooth Speaker', category: 'Electronics', location: 'Berkeley CA · 9.3km', free: false },
    { id: '5', title: 'Wooden Stool', category: 'Furniture', location: 'Berkeley CA · 9.3km', free: false },
    { id: '6', title: 'Office Bag', category: 'Bags', location: 'Berkeley CA · 9.3km', free: true },
  ];

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
    >
      <View style={styles.searchResultImagePlaceholder} />
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultTitle}>{item.title}</Text>
        <View style={styles.searchResultCategoryContainer}>
          <Ionicons name="pricetag-outline" size={12} color="#6E6D7A" />
          <Text style={styles.searchResultCategory}>{item.category}</Text>
        </View>
        <View style={styles.searchResultLocationContainer}>
          <Ionicons name="location-outline" size={12} color="#6E6D7A" />
          <Text style={styles.searchResultLocation}>{item.location}</Text>
        </View>
        {item.free && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.appBarTitle}>Search Results</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {/* Results Header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>120 items found</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color="#021229" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Search Results */}
      <FlatList
        data={searchResults}
        renderItem={renderSearchItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.searchResultsContainer}
        showsVerticalScrollIndicator={false}
      />
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
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#021229',
    marginLeft: 8,
  },
  searchResultsContainer: {
    paddingHorizontal: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  searchResultImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#E7E8EC',
    borderRadius: 12,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 8,
  },
  searchResultCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  searchResultCategory: {
    fontSize: 12,
    color: '#6E6D7A',
    marginLeft: 4,
  },
  searchResultLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchResultLocation: {
    fontSize: 12,
    color: '#6E6D7A',
    marginLeft: 4,
  },
  freeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#119C21',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default SearchResultsScreen;