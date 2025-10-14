import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, StatusBar, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import components
import ItemCard from '../components/items/ItemCard';
import SectionHeader from '../components/common/SectionHeader';
import FilterChip from '../components/filters/FilterChip';
import AppliedFilterChip from '../components/filters/AppliedFilterChip';
import HomeAppBar from '../components/common/HomeAppBar';
import VerificationModal from '../components/common/VerificationModal';
// Import API service
import { getItems, getCategories, getConditions, getNotifications } from '../utils/api';
// Import Auth context
import { useAuth } from '../contexts/AuthContext';

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
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // State for items data (will be fetched from Supabase)
  const [featuredItems, setFeaturedItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [trendingItems, setTrendingItems] = useState([]);
  const [exploreItems, setExploreItems] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [conditions, setConditions] = useState([]);
  const { user, isEmailVerified } = useAuth();

  // Fetch unread notifications count
  useEffect(() => {
    fetchUnreadNotificationCount();
  }, [user]);

  const fetchUnreadNotificationCount = async () => {
    if (!user) return;
    
    try {
      const notifications = await getNotifications(user.id);
      const unreadCount = notifications.filter(notification => !notification.read).length;
      setUnreadNotificationCount(unreadCount);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      setUnreadNotificationCount(0);
    }
  };

  // Show verification modal when user is not verified
  useEffect(() => {
    console.log('=== HomeScreen useEffect triggered ===');
    console.log('User object:', user);
    console.log('User type:', typeof user);
    
    // Check if user is logged in
    if (!user) {
      console.log('No user logged in - not showing verification modal');
      return;
    }
    
    // Check if user object is valid
    if (typeof user !== 'object' || user === null) {
      console.log('User object is invalid - not showing verification modal');
      return;
    }
    
    // Check if user has an ID
    if (!user.id) {
      console.log('User object missing ID - not showing verification modal');
      return;
    }
    
    console.log('User ID:', user.id);
    
    // Log all properties of the user object
    console.log('User object properties:');
    for (let key in user) {
      console.log(`  ${key}: ${user[key]}`);
    }
    
    // Check if user's email is verified
    const verified = isEmailVerified();
    console.log('User verification status:', verified);
    
    if (!verified) {
      // Check if we've already shown the modal for this user
      checkAndShowVerificationModal();
    } else {
      console.log('User is verified - not showing verification modal');
    }
    
    console.log('=== End of HomeScreen useEffect ===');
  }, [user, isEmailVerified]);

  const checkAndShowVerificationModal = async () => {
    try {
      // Create a unique key for each user
      const storageKey = `hasShownVerificationModal_${user.id}`;
      
      // Check if we've already shown the modal for this user
      const hasShownModal = await AsyncStorage.getItem(storageKey);
      
      if (!hasShownModal) {
        console.log('User is not verified and modal has not been shown - showing modal');
        setShowVerificationModal(true);
        
        // Mark that we've shown the modal for this user
        await AsyncStorage.setItem(storageKey, 'true');
      } else {
        console.log('User is not verified but modal has already been shown');
      }
    } catch (error) {
      console.log('Error checking if modal has been shown:', error);
      // Show the modal anyway if there's an error
      setShowVerificationModal(true);
    }
  };

  // Fetch items data from Supabase
  useEffect(() => {
    fetchItemsData();
    fetchCategoriesAndConditions();
  }, []);

  const fetchItemsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all items
      const items = await getItems();
      
      // For demo purposes, we'll distribute items across sections
      // In a real app, you would have specific queries for each section
      setFeaturedItems(items.slice(0, 5));
      setRecommendedItems(items.slice(5, 10));
      setTrendingItems(items.slice(10, 15));
      setExploreItems(items.slice(15, 20));
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', 'Failed to load items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndConditions = async () => {
    try {
      const categoriesData = await getCategories();
      const conditionsData = await getConditions();
      setCategories(categoriesData);
      setConditions(conditionsData);
    } catch (error) {
      console.error('Error fetching categories/conditions:', error);
    }
  };

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
          categories: categories,
          onCategorySelect: (category) => {
            setSelectedFilters(prev => ({ ...prev, category }));
            // Add to applied filters
            if (category) {
              setAppliedFilters(prev => {
                // Remove existing category filter if any
                const filtered = prev.filter(f => f.type !== 'category');
                // Add new category filter
                return [...filtered, { type: 'category', value: category.name, icon: 'grid-outline' }];
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
          conditions: conditions,
          onConditionSelect: (condition) => {
            setSelectedFilters(prev => ({ ...prev, condition }));
            // Add to applied filters
            if (condition) {
              setAppliedFilters(prev => {
                // Remove existing condition filter if any
                const filtered = prev.filter(f => f.type !== 'condition');
                // Add new condition filter
                return [...filtered, { type: 'condition', value: condition.name, icon: 'heart-half' }];
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

  const handleVerifyPress = () => {
    setShowVerificationModal(false);
    navigation.navigate('EmailVerification');
  };

  // Reset the modal flag when the modal is closed without verifying
  const handleModalClose = () => {
    setShowVerificationModal(false);
  };

  // Render item list with loading state
  const renderItemSection = (title, items, icon, onArrowPress) => {
    return (
      <View style={styles.sectionContainer}>
        <SectionHeader 
          icon={icon}
          title={title}
          showArrow={true}
          onArrowPress={onArrowPress}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No items available</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <ItemCard 
                item={item} 
                onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              />
            )}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F5EC" />
      
      {/* Verification Modal - only shown to unverified users */}
      <VerificationModal 
        visible={showVerificationModal}
        onClose={handleModalClose}
        onVerify={handleVerifyPress}
      />
      
      {/* Home App Bar */}
      <HomeAppBar 
        location={formatLocation()}
        onLocationPress={() => console.log('Location pressed')}
        onSearchPress={() => navigation.navigate('Search')}
        onNotificationsPress={() => {
          // Reset unread count when user navigates to notifications
          setUnreadNotificationCount(0);
          navigation.navigate('Notifications');
        }}
        unreadNotificationCount={unreadNotificationCount}
      />

      {/* Filter Chips - placed right under the HomeAppBar */}
      <View style={styles.filterChipsSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsContent}
        >
          <FilterChip
            key="category"
            title="Category"
            icon="grid-outline"
            onPress={() => handleFilterPress('category')}
          />
          <FilterChip
            key="condition"
            title="Condition"
            icon="heart-half"
            onPress={() => handleFilterPress('condition')}
          />
          <FilterChip
            key="distance"
            title="Distance"
            icon="location-outline"
            onPress={() => handleFilterPress('distance')}
          />
          <FilterChip
            key="free"
            title="Free"
            icon="pricetag-outline"
            onPress={() => handleFilterPress('free')}
          />
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
        {renderItemSection(
          "Featured items for you",
          featuredItems,
          <Ionicons name="star" size={20} color="#FFD700" />,
          () => navigation.navigate('SearchResults')
        )}

        {/* Recommended Items Section */}
        {renderItemSection(
          "Recommended for you",
          recommendedItems,
          <Ionicons name="crown" size={20} color="#000" />,
          () => navigation.navigate('SearchResults')
        )}

        {/* Trending Items Section */}
        {renderItemSection(
          "Trending Now",
          trendingItems,
          <Ionicons name="flame" size={20} color="#FF4500" />,
          () => navigation.navigate('SearchResults')
        )}

        {/* Explore Items Section */}
        {renderItemSection(
          "Explore More",
          exploreItems,
          <Ionicons name="cart" size={20} color="#000" />,
          () => navigation.navigate('SearchResults')
        )}
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
  loadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    alignItems: 'center',
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