import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';
import { LocationPicker } from './LocationPicker';
import type { LocationCoordinates, LocationAddress } from '../../services/location';

interface LocationFilterProps {
  onLocationChange: (location: LocationCoordinates | null, radius: number) => void;
  initialLocation?: LocationCoordinates | undefined;
  initialRadius?: number;
  disabled?: boolean;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  onLocationChange,
  initialLocation,
  initialRadius = 10,
  disabled = false,
}) => {
  const {
    currentLocation,
    currentAddress,
    updatePreferences,
    formatDistance,
  } = useLocation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(
    initialLocation || null
  );
  const [selectedAddress, setSelectedAddress] = useState<LocationAddress | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [searchRadius, setSearchRadius] = useState(initialRadius);

  // Handle location selection
  const handleLocationSelect = (location: LocationCoordinates, address?: LocationAddress) => {
    setSelectedLocation(location);
    setSelectedAddress(address || null);
    onLocationChange(location, searchRadius);
  };

  // Handle current location toggle
  const handleCurrentLocationToggle = (enabled: boolean) => {
    setUseCurrentLocation(enabled);
    
    if (enabled && currentLocation) {
      setSelectedLocation(currentLocation);
      setSelectedAddress(currentAddress);
      onLocationChange(currentLocation, searchRadius);
    } else if (!enabled) {
      setSelectedLocation(null);
      setSelectedAddress(null);
      onLocationChange(null, searchRadius);
    }
  };

  // Handle radius change
  const handleRadiusChange = (radius: number) => {
    setSearchRadius(radius);
    updatePreferences({ searchRadius: radius });
    
    if (selectedLocation) {
      onLocationChange(selectedLocation, radius);
    }
  };

  // Format location display text
  const getLocationDisplayText = (): string => {
    if (useCurrentLocation && currentAddress) {
      return `Near ${currentAddress.city || 'current location'}`;
    } else if (selectedAddress) {
      return `Near ${selectedAddress.city || selectedAddress.name || 'selected location'}`;
    } else if (selectedLocation) {
      return 'Custom location';
    }
    return 'All locations';
  };

  // Render radius options
  const renderRadiusOptions = () => {
    const radiusOptions = [1, 5, 10, 25, 50];

    return (
      <View style={styles.radiusContainer}>
        <Text style={styles.sectionTitle}>Search Radius</Text>
        <View style={styles.radiusGrid}>
          {radiusOptions.map((radius) => (
            <TouchableOpacity
              key={radius}
              onPress={() => handleRadiusChange(radius)}
              style={[
                styles.radiusOption,
                searchRadius === radius && styles.radiusOptionActive
              ]}
            >
              <Text
                style={[
                  styles.radiusOptionText,
                  searchRadius === radius && styles.radiusOptionTextActive
                ]}
              >
                {formatDistance(radius)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };  return (

    <>
      {/* Filter Button */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={[styles.filterButton, disabled && styles.filterButtonDisabled]}
        disabled={disabled}
      >
        <Ionicons 
          name="location-outline" 
          size={20} 
          color={selectedLocation ? "#3B82F6" : "#6B7280"} 
        />
        <Text style={[
          styles.filterButtonText,
          selectedLocation && styles.filterButtonTextActive
        ]}>
          {getLocationDisplayText()}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6B7280" />
      </TouchableOpacity>

      {/* Location Filter Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Location Filter</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.modalContent}>
            {/* Current Location Toggle */}
            <View style={styles.toggleContainer}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>Use Current Location</Text>
                <Text style={styles.toggleSubtitle}>
                  Find items near your current location
                </Text>
              </View>
              <Switch
                value={useCurrentLocation}
                onValueChange={handleCurrentLocationToggle}
                trackColor={{ false: '#E5E7EB', true: '#BFDBFE' }}
                thumbColor={useCurrentLocation ? '#3B82F6' : '#9CA3AF'}
              />
            </View>

            {/* Custom Location Picker */}
            {!useCurrentLocation && (
              <View style={styles.locationPickerContainer}>
                <Text style={styles.sectionTitle}>Custom Location</Text>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={selectedLocation || undefined}
                  placeholder="Search for a location..."
                  showCurrentLocationButton={false}
                />
              </View>
            )}

            {/* Search Radius */}
            {renderRadiusOptions()}

            {/* Clear Filter */}
            <TouchableOpacity
              onPress={() => {
                setUseCurrentLocation(false);
                setSelectedLocation(null);
                setSelectedAddress(null);
                onLocationChange(null, searchRadius);
                setIsModalVisible(false);
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>Clear Location Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  filterButtonDisabled: {
    opacity: 0.6,
  },
  filterButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  filterButtonTextActive: {
    color: '#3B82F6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 32,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationPickerContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  radiusContainer: {
    marginTop: 24,
  },
  radiusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  clearButton: {
    marginTop: 32,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
});