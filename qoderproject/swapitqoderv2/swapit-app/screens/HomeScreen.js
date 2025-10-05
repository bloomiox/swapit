import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
// Import components
import ItemCard from '../components/items/ItemCard';
import SectionHeader from '../components/common/SectionHeader';
import FilterChip from '../components/filters/FilterChip';
import AppliedFilterChip from '../components/filters/AppliedFilterChip';
import HomeAppBar from '../components/common/HomeAppBar';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: null,
    condition: null,
    distance: 10,
    free: false
  });

  // Sample data for items
  const featuredItems = [
    { id: '1', title: 'Stool', location: 'Berkeley CA · 9.3km', image: null, free: true },
  ];

  const recommendedItems = [
    { id: '2', title: 'Stool', location: 'Berkeley CA · 9.3km', image: null, free: true },
    { id: '3', title: 'Designer Handbag', location: 'Berkeley CA · 9.3km', image: null, free: false },
    { id: '4', title: 'Sofa chair', location: 'Berkeley CA · 9.3km', image: null, free: false },
  ];

  const trendingItems = [
    { id: '5', title: 'Leather bag with original strap and long 3 pockets', location: 'Berkeley CA · 9.3km', image: null, free: false },
    { id: '6', title: 'Sofa chair', location: 'Berkeley CA · 9.3km', image: null, free: false },
    { id: '7', title: 'Chair', location: 'Berkeley CA · 9.3km', image: null, free: false },
  ];

  const exploreItems = [
    { id: '8', title: 'iPhone', location: 'Berkeley CA · 9.3km', image: null, free: false },
    { id: '9', title: 'Office Bag', location: 'Berkeley CA · 9.3km', image: null, free: true },
    { id: '10', title: 'Wooden table with stool', location: 'Berkeley CA · 9.3km', image: null, free: false },
    { id: '11', title: 'Original Airpods 2', location: 'Berkeley CA · 9.3km', image: null, free: false },
  ];

  // Sample filter data
  const filterOptions = [
    { id: 'category', title: 'Category', icon: 'grid-outline' },
    { id: 'condition', title: 'Condition', icon: 'heart-half' },
    { id: 'distance', title: 'Distance', icon: 'location-outline' },
    { id: 'free', title: 'Free', icon: 'pricetag-outline' },
  ];

  // Get user location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setLocationError('Unable to retrieve location');
      }
    })();
  }, []);

  const formatLocation = () => {
    if (locationError) {
      return 'Rorschach, Sankt Gallen';
    }
    
    if (location) {
      // In a real app, you would use reverse geocoding to get the actual address
      return 'Current Location';
    }
    
    return 'Rorschach, Sankt Gallen';
  };

  const handleFilterPress = (filterId) => {
    switch (filterId) {
      case 'category':
        navigation.navigate('CategoryFilter', {
          selectedCategory: selectedFilters.category,
          onCategorySelect: (category) => {
            setSelectedFilters(prev => ({ ...prev, category }));
            // Add to applied filters
            if (category) {
              setAppliedFilters(prev => {
                // Remove existing category filter if any
                const filtered = prev.filter(f => f.type !== 'category');
                // Add new category filter
                return [...filtered, { type: 'category', value: getCategoryName(category), icon: 'grid-outline' }];
              });
            } else {
              // Remove category filter
              setAppliedFilters(prev => prev.filter(f => f.type !== 'category'));
            }
          }
        });
        break;
      case 'condition':
        navigation.navigate('ConditionFilter', {
          selectedCondition: selectedFilters.condition,
          onConditionSelect: (condition) => {
            setSelectedFilters(prev => ({ ...prev, condition }));
            // Add to applied filters
            if (condition) {
              setAppliedFilters(prev => {
                // Remove existing condition filter if any
                const filtered = prev.filter(f => f.type !== 'condition');
                // Add new condition filter
                return [...filtered, { type: 'condition', value: getConditionName(condition), icon: 'heart-half' }];
              });
            } else {
              // Remove condition filter
              setAppliedFilters(prev => prev.filter(f => f.type !== 'condition'));
            }
          }
        });
        break;
      case 'distance':
        navigation.navigate('DistanceFilter', {
          selectedDistance: selectedFilters.distance,
          onDistanceSelect: (distance) => {
            setSelectedFilters(prev => ({ ...prev, distance }));
            // Add to applied filters
            setAppliedFilters(prev => {
              // Remove existing distance filter if any
              const filtered = prev.filter(f => f.type !== 'distance');
              // Add new distance filter
              return [...filtered, { type: 'distance', value: `${distance} km`, icon: 'location-outline' }];
            });
          }
        });
        break;
      case 'free':
        // Toggle free filter
        const newFreeValue = !selectedFilters.free;
        setSelectedFilters(prev => ({ ...prev, free: newFreeValue }));
        if (newFreeValue) {
          setAppliedFilters(prev => [...prev, { type: 'free', value: 'Free', icon: 'pricetag-outline' }]);
        } else {
          setAppliedFilters(prev => prev.filter(f => f.type !== 'free'));
        }
        break;
      default:
        break;
    }
  };

  const getCategoryName = (categoryId) => {
    const categories = [
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Clothing' },
      { id: '3', name: 'Books' },
      { id: '4', name: 'Furniture' },
      { id: '5', name: 'Sports' },
      { id: '6', name: 'Toys' },
    ];
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };

  const getConditionName = (conditionId) => {
    const conditions = [
      { id: '1', name: 'New' },
      { id: '2', name: 'Like New' },
      { id: '3', name: 'Good' },
      { id: '4', name: 'Fair' },
      { id: '5', name: 'Poor' },
    ];
    const condition = conditions.find(c => c.id === conditionId);
    return condition ? condition.name : '';
  };

  const handleClearFilter = (filterType) => {
    // Remove filter from applied filters
    setAppliedFilters(appliedFilters.filter(filter => filter.type !== filterType));
    
    // Reset the corresponding selected filter
    switch (filterType) {
      case 'category':
        setSelectedFilters(prev => ({ ...prev, category: null }));
        break;
      case 'condition':
        setSelectedFilters(prev => ({ ...prev, condition: null }));
        break;
      case 'distance':
        setSelectedFilters(prev => ({ ...prev, distance: 10 }));
        break;
      case 'free':
        setSelectedFilters(prev => ({ ...prev, free: false }));
        break;
      default:
        break;
    }
  };

  const handleClearAllFilters = () => {
    setAppliedFilters([]);
    setSelectedFilters({
      category: null,
      condition: null,
      distance: 10,
      free: false
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F5EC" />
      
      {/* Home App Bar */}
      <HomeAppBar 
        location={formatLocation()}
        onLocationPress={() => console.log('Location pressed')}
        onSearchPress={() => navigation.navigate('Search')}
        onNotificationsPress={() => navigation.navigate('Notifications')}
      />

      {/* Filter Chips - placed right under the HomeAppBar */}
      <View style={styles.filterChipsSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsContent}
        >
          {filterOptions.map((filter) => (
            <FilterChip
              key={filter.id}
              title={filter.title}
              icon={filter.icon}
              onPress={() => handleFilterPress(filter.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <View style={styles.appliedFiltersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.appliedFiltersContent}
          >
            {appliedFilters.map((filter, index) => (
              <AppliedFilterChip
                key={index}
                icon={filter.icon}
                value={filter.value}
                onClear={() => handleClearFilter(filter.type)}
              />
            ))}
          </ScrollView>
          <TouchableOpacity 
            style={styles.clearAllButton}
            onPress={handleClearAllFilters}
          >
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.contentContainer}>
        {/* Featured Items Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader 
            icon={<Ionicons name="star" size={20} color="#FFD700" />}
            title="Featured items for you"
            showArrow={true}
            onArrowPress={() => navigation.navigate('SearchResults')}
          />
          <FlatList
            data={featuredItems}
            renderItem={({ item }) => (
              <ItemCard 
                item={item} 
                onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Recommended Items Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader 
            icon={<Ionicons name="crown" size={20} color="#000" />}
            title="Recommended for you"
            subtitle="Based on your saved items and preferences"
            showArrow={true}
            onArrowPress={() => navigation.navigate('SearchResults')}
          />
          <FlatList
            data={recommendedItems}
            renderItem={({ item }) => (
              <ItemCard 
                item={item} 
                onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Trending Items Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader 
            icon={<Ionicons name="flame" size={20} color="#FF4500" />}
            title="Trending Now"
            subtitle="Popular Items in your area"
            showArrow={true}
            onArrowPress={() => navigation.navigate('SearchResults')}
          />
          <FlatList
            data={trendingItems}
            renderItem={({ item }) => (
              <ItemCard 
                item={item} 
                onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Explore Items Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader 
            icon={<Ionicons name="cart" size={20} color="#000" />}
            title="Explore More"
            onArrowPress={() => navigation.navigate('SearchResults')}
          />
          <FlatList
            data={exploreItems}
            renderItem={({ item }) => (
              <ItemCard 
                item={item} 
                onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              />
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </ScrollView>

      {/* View Switcher - Floating button at bottom right */}
      <View style={styles.floatingViewSwitcher}>
        <TouchableOpacity 
          style={[styles.viewButton, styles.activeViewButton]}
        >
          <Ionicons name="list" size={20} color="#021229" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => navigation.navigate('MapView')}
        >
          <Ionicons name="map" size={20} color="#021229" />
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
  filterChipsSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChipsContent: {
    alignItems: 'center',
  },
  appliedFiltersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  appliedFiltersContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  clearAllButton: {
    padding: 8,
  },
  clearAllText: {
    fontSize: 14,
    color: '#119C21',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  floatingViewSwitcher: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  viewButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeViewButton: {
    backgroundColor: '#D8F7D7',
  },
});

export default HomeScreen;