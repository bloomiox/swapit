import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { locationService, LocationCoordinates, LocationAddress, LocationPreferences } from '../services/location';

export interface UseLocationReturn {
  // Current location state
  currentLocation: LocationCoordinates | null;
  lastKnownLocation: LocationCoordinates | null;
  currentAddress: LocationAddress | null;
  
  // Loading and error states
  isLoading: boolean;
  isWatching: boolean;
  error: string | null;
  hasPermission: boolean;
  
  // Location preferences
  preferences: LocationPreferences;
  
  // Actions
  getCurrentLocation: () => Promise<LocationCoordinates | null>;
  startWatching: (callback?: (location: LocationCoordinates) => void) => Promise<boolean>;
  stopWatching: () => void;
  requestPermissions: () => Promise<boolean>;
  updatePreferences: (updates: Partial<LocationPreferences>) => Promise<void>;
  reverseGeocode: (coordinates: LocationCoordinates) => Promise<LocationAddress | null>;
  geocode: (address: string) => Promise<LocationCoordinates | null>;
  calculateDistance: (coord1: LocationCoordinates, coord2: LocationCoordinates) => number;
  formatDistance: (distanceKm: number) => string;
  isWithinRadius: (center: LocationCoordinates, target: LocationCoordinates, radiusKm?: number) => boolean;
}

export const useLocation = (): UseLocationReturn => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [currentAddress, setCurrentAddress] = useState<LocationAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [preferences, setPreferences] = useState<LocationPreferences>(locationService.getPreferences());

  // Initialize location service and check permissions
  useEffect(() => {
    checkPermissions();
    loadLastKnownLocation();
  }, []);

  // Check if we have location permissions
  const checkPermissions = async () => {
    try {
      const granted = await locationService.requestPermissions();
      setHasPermission(granted);
      
      if (!granted) {
        setError('Location permission is required to find nearby items');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to check location permissions');
      console.error('Permission check error:', err);
    }
  };

  // Load last known location
  const loadLastKnownLocation = () => {
    const lastLocation = locationService.getLastKnownLocation();
    if (lastLocation) {
      setCurrentLocation(lastLocation);
    }
  };

  // Request location permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const granted = await locationService.requestPermissions();
      setHasPermission(granted);
      
      if (!granted) {
        setError('Location permission denied');
        Alert.alert(
          'Location Permission Required',
          'Please enable location access in your device settings to find nearby items.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => {/* Open settings */ } }
          ]
        );
      }
      
      return granted;
    } catch (err) {
      const errorMessage = 'Failed to request location permissions';
      setError(errorMessage);
      console.error('Permission request error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const location = await locationService.getCurrentLocation();
      
      if (location) {
        setCurrentLocation(location);
        
        // Reverse geocode to get address
        try {
          const address = await locationService.reverseGeocode(location);
          setCurrentAddress(address);
        } catch (geocodeError) {
          console.warn('Failed to reverse geocode:', geocodeError);
        }
      } else {
        setError('Unable to get current location');
      }
      
      return location;
    } catch (err) {
      const errorMessage = 'Failed to get current location';
      setError(errorMessage);
      console.error('Get location error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start watching location changes
  const startWatching = useCallback(async (
    callback?: (location: LocationCoordinates) => void
  ): Promise<boolean> => {
    try {
      setError(null);
      
      const success = await locationService.startWatchingLocation(
        (location) => {
          setCurrentLocation(location);
          callback?.(location);
          
          // Update address periodically
          locationService.reverseGeocode(location)
            .then(setCurrentAddress)
            .catch(console.warn);
        }
      );
      
      setIsWatching(success);
      
      if (!success) {
        setError('Failed to start location tracking');
      }
      
      return success;
    } catch (err) {
      const errorMessage = 'Failed to start location tracking';
      setError(errorMessage);
      console.error('Start watching error:', err);
      return false;
    }
  }, []);

  // Stop watching location changes
  const stopWatching = useCallback(() => {
    locationService.stopWatchingLocation();
    setIsWatching(false);
  }, []);

  // Update location preferences
  const updatePreferences = useCallback(async (updates: Partial<LocationPreferences>): Promise<void> => {
    try {
      await locationService.updatePreferences(updates);
      setPreferences(locationService.getPreferences());
    } catch (err) {
      console.error('Failed to update preferences:', err);
      setError('Failed to update location preferences');
    }
  }, []);

  // Reverse geocode coordinates to address
  const reverseGeocode = useCallback(async (coordinates: LocationCoordinates): Promise<LocationAddress | null> => {
    try {
      return await locationService.reverseGeocode(coordinates);
    } catch (err) {
      console.error('Reverse geocode error:', err);
      return null;
    }
  }, []);

  // Geocode address to coordinates
  const geocode = useCallback(async (address: string): Promise<LocationCoordinates | null> => {
    try {
      return await locationService.geocode(address);
    } catch (err) {
      console.error('Geocode error:', err);
      return null;
    }
  }, []);

  // Calculate distance between coordinates
  const calculateDistance = useCallback((
    coord1: LocationCoordinates,
    coord2: LocationCoordinates
  ): number => {
    return locationService.calculateDistance(coord1, coord2);
  }, []);

  // Format distance for display
  const formatDistance = useCallback((distanceKm: number): string => {
    return locationService.formatDistance(distanceKm);
  }, []);

  // Check if coordinates are within radius
  const isWithinRadius = useCallback((
    center: LocationCoordinates,
    target: LocationCoordinates,
    radiusKm?: number
  ): boolean => {
    return locationService.isWithinRadius(center, target, radiusKm);
  }, []);

  return {
    // State
    currentLocation,
    lastKnownLocation: locationService.getLastKnownLocation(),
    currentAddress,
    isLoading,
    isWatching,
    error,
    hasPermission,
    preferences,
    
    // Actions
    getCurrentLocation,
    startWatching,
    stopWatching,
    requestPermissions,
    updatePreferences,
    reverseGeocode,
    geocode,
    calculateDistance,
    formatDistance,
    isWithinRadius,
  };
};