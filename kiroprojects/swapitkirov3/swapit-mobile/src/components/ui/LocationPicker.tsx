import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';
import type { LocationCoordinates, LocationAddress } from '../../services/location';

interface LocationPickerProps {
  onLocationSelect: (location: LocationCoordinates, address?: LocationAddress) => void;
  initialLocation?: LocationCoordinates | undefined;
  placeholder?: string;
  showCurrentLocationButton?: boolean;
  showSearchRadius?: boolean;
  disabled?: boolean;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation,
  placeholder = "Enter location or use current location",
  showCurrentLocationButton = true,
  showSearchRadius = false,
  disabled = false,
}) => {
  const {
    currentLocation,
    currentAddress,
    isLoading,
    error,
    hasPermission,
    preferences,
    getCurrentLocation,
    requestPermissions,
    geocode,
    reverseGeocode,
    updatePreferences,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(initialLocation || null);
  const [selectedAddress, setSelectedAddress] = useState<LocationAddress | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ address: string; coordinates: LocationCoordinates }>>([]);
  const [showResults, setShowResults] = useState(false);

  // Initialize with current location if available
  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation(currentLocation);
      if (currentAddress) {
        setSelectedAddress(currentAddress);
        setSearchQuery(formatAddressForDisplay(currentAddress));
      }
    }
  }, [currentLocation, currentAddress, selectedLocation]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() && searchQuery.length > 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Format address for display
  const formatAddressForDisplay = (address: LocationAddress): string => {
    const parts = [];
    if (address.name) parts.push(address.name);
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    return parts.join(', ');
  };

  // Handle location search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsSearching(true);
      const coordinates = await geocode(searchQuery.trim());
      
      if (coordinates) {
        const address = await reverseGeocode(coordinates);
        setSearchResults([{
          address: address ? formatAddressForDisplay(address) : searchQuery,
          coordinates,
        }]);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (err) {
      console.error('Search error:', err);
      Alert.alert('Search Error', 'Failed to search for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle current location button press
  const handleCurrentLocation = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) return;
    }

    try {
      const location = await getCurrentLocation();
      if (location) {
        setSelectedLocation(location);
        const address = await reverseGeocode(location);
        setSelectedAddress(address);
        
        if (address) {
          setSearchQuery(formatAddressForDisplay(address));
        }
        
        onLocationSelect(location, address || undefined);
      }
    } catch (err) {
      console.error('Current location error:', err);
      Alert.alert('Location Error', 'Failed to get current location. Please try again.');
    }
  };

  // Handle search result selection
  const handleResultSelect = async (result: { address: string; coordinates: LocationCoordinates }) => {
    setSelectedLocation(result.coordinates);
    setSearchQuery(result.address);
    setShowResults(false);
    
    // Get detailed address
    const address = await reverseGeocode(result.coordinates);
    setSelectedAddress(address);
    
    onLocationSelect(result.coordinates, address || undefined);
  };

  // Handle search radius change
  const handleRadiusChange = async (radius: number) => {
    await updatePreferences({ searchRadius: radius });
  };

  // Render search results
  const renderSearchResults = () => {
    if (!showResults || searchResults.length === 0) return null;

    return (
      <View style={styles.resultsContainer}>
        <ScrollView style={styles.resultsList} keyboardShouldPersistTaps="handled">
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleResultSelect(result)}
              style={styles.resultItem}
            >
              <Ionicons name="location-outline" size={20} color="#6B7280" />
              <Text style={styles.resultText}>{result.address}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render search radius selector
  const renderRadiusSelector = () => {
    if (!showSearchRadius) return null;

    const radiusOptions = [1, 5, 10, 25, 50];

    return (
      <View style={styles.radiusContainer}>
        <Text style={styles.radiusLabel}>Search Radius</Text>
        <View style={styles.radiusOptions}>
          {radiusOptions.map((radius) => (
            <TouchableOpacity
              key={radius}
              onPress={() => handleRadiusChange(radius)}
              style={[
                styles.radiusOption,
                preferences.searchRadius === radius && styles.radiusOptionActive
              ]}
            >
              <Text
                style={[
                  styles.radiusOptionText,
                  preferences.searchRadius === radius && styles.radiusOptionTextActive
                ]}
              >
                {radius}km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      {/* Search Input */}
      <View style={styles.inputContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setShowResults(searchResults.length > 0)}
            placeholder={placeholder}
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
            editable={!disabled}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#3B82F6" />
          )}
          {searchQuery.length > 0 && !isSearching && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowResults(false);
            }}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Current Location Button */}
        {showCurrentLocationButton && (
          <TouchableOpacity
            onPress={handleCurrentLocation}
            style={[styles.currentLocationButton, disabled && styles.buttonDisabled]}
            disabled={disabled || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="location" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results */}
      {renderSearchResults()}

      {/* Search Radius Selector */}
      {renderRadiusSelector()}

      {/* Selected Location Display */}
      {selectedLocation && selectedAddress && (
        <View style={styles.selectedLocationContainer}>
          <Ionicons name="location" size={16} color="#3B82F6" />
          <Text style={styles.selectedLocationText}>
            {formatAddressForDisplay(selectedAddress)}
          </Text>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={16} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Permission Request */}
      {!hasPermission && showCurrentLocationButton && (
        <TouchableOpacity
          onPress={requestPermissions}
          style={styles.permissionButton}
        >
          <Ionicons name="location-outline" size={16} color="#3B82F6" />
          <Text style={styles.permissionText}>Enable Location Access</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  containerDisabled: {
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#111827',
    fontSize: 16,
  },
  currentLocationButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  resultsContainer: {
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
    maxHeight: 200,
  },
  resultsList: {
    maxHeight: 200,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  resultText: {
    marginLeft: 12,
    color: '#374151',
    fontSize: 16,
    flex: 1,
  },
  radiusContainer: {
    marginTop: 16,
  },
  radiusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  radiusOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  radiusOptionActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  radiusOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  radiusOptionTextActive: {
    color: '#FFFFFF',
  },
  selectedLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#EBF8FF',
    borderRadius: 6,
  },
  selectedLocationText: {
    marginLeft: 8,
    color: '#1E40AF',
    fontSize: 14,
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
  },
  errorText: {
    marginLeft: 8,
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  permissionText: {
    marginLeft: 8,
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '500',
  },
});