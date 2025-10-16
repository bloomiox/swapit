import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { itemsApi, categoriesApi } from '../../src/services/api';
import { ItemCard } from '../../src/components/shared/ItemCard/ItemCard';
import { LocationFilter } from '../../src/components/ui/LocationFilter';
import { useLocation } from '../../src/hooks/useLocation';
import type { Item, Category, ItemFilters } from '../../src/types';
import type { LocationCoordinates } from '../../src/services/location';

export default function DiscoverScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationFilter, setLocationFilter] = useState<LocationCoordinates | null>(null);
  const [searchRadius, setSearchRadius] = useState(10);

  const {
    calculateDistance,
    isWithinRadius,
  } = useLocation();

  // Load initial data
  useEffect(() => {
    // Temporarily disable loading data to isolate the issue
    // loadInitialData();
  }, []);

  // Load categories and initial items
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        itemsApi.getItems(),
        categoriesApi.getCategories(),
      ]);
      
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
        generateSearchSuggestions();
      } else {
        loadItems();
        setSearchSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, locationFilter, searchRadius]);

  // Load items with filters
  const loadItems = async (filters?: ItemFilters) => {
    try {
      let itemsData = await itemsApi.getItems(filters);
      
      // Apply location filtering if enabled
      if (locationFilter && itemsData.length > 0) {
        itemsData = itemsData.filter(item => {
          if (!item.location_coordinates?.latitude || !item.location_coordinates?.longitude) {
            return false; // Exclude items without location
          }
          
          const itemLocation = {
            latitude: item.location_coordinates.latitude,
            longitude: item.location_coordinates.longitude,
          };
          
          return isWithinRadius(locationFilter, itemLocation, searchRadius);
        });
        
        // Sort by distance if location filter is active
        itemsData.sort((a, b) => {
          if (!a.location_coordinates?.latitude || !a.location_coordinates?.longitude) return 1;
          if (!b.location_coordinates?.latitude || !b.location_coordinates?.longitude) return -1;
          
          const distanceA = calculateDistance(locationFilter, {
            latitude: a.location_coordinates.latitude,
            longitude: a.location_coordinates.longitude,
          });
          const distanceB = calculateDistance(locationFilter, {
            latitude: b.location_coordinates.latitude,
            longitude: b.location_coordinates.longitude,
          });
          
          return distanceA - distanceB;
        });
      }
      
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
      Alert.alert('Error', 'Failed to load items. Please try again.');
    }
  };

  // Handle search functionality
  const handleSearch = async () => {
    const filters: ItemFilters = {
      search_query: searchQuery.trim(),
      ...(selectedCategory && { category_ids: [selectedCategory] }),
    };
    await loadItems(filters);
  };

  // Handle location filter change
  const handleLocationChange = (location: LocationCoordinates | null, radius: number) => {
    setLocationFilter(location);
    setSearchRadius(radius);
  };

  // Generate search suggestions (mock implementation)
  const generateSearchSuggestions = () => {
    if (searchQuery.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    // Mock suggestions based on common search terms
    const mockSuggestions = [
      'iPhone', 'MacBook', 'Books', 'Furniture', 'Clothes', 'Electronics',
      'Bicycle', 'Camera', 'Headphones', 'Laptop', 'Tablet', 'Watch'
    ];

    const filtered = mockSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);

    setSearchSuggestions(filtered);
  };

  // Handle pull to refresh
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadInitialData();
    setIsRefreshing(false);
  }, []);

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  // Handle search suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Handle item press
  const handleItemPress = (item: Item) => {
    router.push(`/item/${item.id}`);
  };

  // Render category filter
  const renderCategoryFilter = () => (
    <View style={styles.categoryContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => handleCategorySelect(null)}
          style={[
            styles.categoryButton,
            selectedCategory === null && styles.categoryButtonActive
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === null && styles.categoryTextActive
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleCategorySelect(category.id)}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // Render search suggestions
  const renderSearchSuggestions = () => {
    if (!showSuggestions || searchSuggestions.length === 0) return null;

    return (
      <View style={styles.suggestionsContainer}>
        {searchSuggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSuggestionSelect(suggestion)}
            style={styles.suggestionItem}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Render personalized recommendations section
  const renderRecommendations = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        Recommended for You
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.slice(0, 5).map((item) => (
          <View key={item.id} style={styles.horizontalCard}>
            <ItemCard 
              item={item} 
              onPress={handleItemPress}
              showDistance={!!locationFilter}
              userLocation={locationFilter || undefined}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  // Render recent items section
  const renderRecentItems = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>
        Recently Added
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.slice(5, 10).map((item) => (
          <View key={item.id} style={styles.horizontalCard}>
            <ItemCard 
              item={item} 
              onPress={handleItemPress}
              showDistance={!!locationFilter}
              userLocation={locationFilter || undefined}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search items..."
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
          {renderSearchSuggestions()}
        </View>
      </View>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Location Filter */}
      <View style={styles.locationFilterContainer}>
        <LocationFilter
          onLocationChange={handleLocationChange}
          initialLocation={locationFilter || undefined}
          initialRadius={searchRadius}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Personalized Recommendations */}
        {!searchQuery && renderRecommendations()}

        {/* Recently Added */}
        {!searchQuery && renderRecentItems()}

        {/* All Items Grid */}
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${items.length})` : 'All Items'}
          </Text>
          
          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No items found' : 'No items available'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Check back later for new items'
                }
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {items.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <ItemCard 
                    item={item} 
                    onPress={handleItemPress}
                    showDistance={!!locationFilter}
                    userLocation={locationFilter || undefined}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    position: 'relative',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#111827',
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    color: '#374151',
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryButton: {
    marginRight: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontWeight: '500',
    color: '#374151',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  locationFilterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  horizontalCard: {
    marginRight: 16,
    width: 192,
  },
  gridContainer: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#6B7280',
    fontSize: 18,
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
});