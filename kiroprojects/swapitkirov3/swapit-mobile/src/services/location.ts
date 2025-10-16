import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError, log } from '../config/environment';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface LocationAddress {
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  name?: string;
}

export interface LocationPreferences {
  autoDetect: boolean;
  searchRadius: number; // in kilometers
  backgroundUpdates: boolean;
  highAccuracy: boolean;
}

// Location service for handling GPS and location-based features
export class LocationService {
  private readonly PREFERENCES_KEY = '@swapit_location_preferences';
  private readonly LAST_LOCATION_KEY = '@swapit_last_location';
  
  private preferences: LocationPreferences = {
    autoDetect: true,
    searchRadius: 10,
    backgroundUpdates: false,
    highAccuracy: true
  };

  private lastKnownLocation: LocationCoordinates | null = null;
  private watchSubscription: Location.LocationSubscription | null = null;

  constructor() {
    this.initialize();
  }

  // Initialize location service
  private async initialize(): Promise<void> {
    try {
      await this.loadPreferences();
      await this.loadLastLocation();
    } catch (error) {
      logError('Failed to initialize location service:', error);
    }
  }

  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        log('Foreground location permission not granted');
        return false;
      }

      // Request background permissions if needed
      if (this.preferences.backgroundUpdates) {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          log('Background location permission not granted');
          // Continue with foreground only
        }
      }

      return true;
    } catch (error) {
      logError('Failed to request location permissions:', error);
      return false;
    }
  }

  // Get current location
  async getCurrentLocation(): Promise<LocationCoordinates | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: this.preferences.highAccuracy 
          ? Location.Accuracy.High 
          : Location.Accuracy.Balanced,
        timeInterval: 60000, // 1 minute
      });

      const coordinates: LocationCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        ...(location.coords.accuracy !== null && { accuracy: location.coords.accuracy }),
        ...(location.coords.altitude !== null && { altitude: location.coords.altitude }),
        ...(location.coords.heading !== null && { heading: location.coords.heading }),
        ...(location.coords.speed !== null && { speed: location.coords.speed }),
      };

      this.lastKnownLocation = coordinates;
      await this.saveLastLocation(coordinates);
      
      log('Current location obtained:', coordinates);
      return coordinates;
    } catch (error) {
      logError('Failed to get current location:', error);
      return this.lastKnownLocation;
    }
  }

  // Get last known location
  getLastKnownLocation(): LocationCoordinates | null {
    return this.lastKnownLocation;
  }

  // Start watching location changes
  async startWatchingLocation(
    callback: (location: LocationCoordinates) => void,
    options?: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    }
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      // Stop existing watch
      if (this.watchSubscription) {
        this.watchSubscription.remove();
      }

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: options?.accuracy || (this.preferences.highAccuracy 
            ? Location.Accuracy.High 
            : Location.Accuracy.Balanced),
          timeInterval: options?.timeInterval || 10000, // 10 seconds
          distanceInterval: options?.distanceInterval || 10, // 10 meters
        },
        (location) => {
          const coordinates: LocationCoordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            ...(location.coords.accuracy !== null && { accuracy: location.coords.accuracy }),
            ...(location.coords.altitude !== null && { altitude: location.coords.altitude }),
            ...(location.coords.heading !== null && { heading: location.coords.heading }),
            ...(location.coords.speed !== null && { speed: location.coords.speed }),
          };

          this.lastKnownLocation = coordinates;
          this.saveLastLocation(coordinates);
          callback(coordinates);
        }
      );

      log('Started watching location changes');
      return true;
    } catch (error) {
      logError('Failed to start watching location:', error);
      return false;
    }
  }

  // Stop watching location changes
  stopWatchingLocation(): void {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
      this.watchSubscription = null;
      log('Stopped watching location changes');
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(coordinates: LocationCoordinates): Promise<LocationAddress | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        if (address) {
          return {
            ...(address.street && { street: address.street }),
            ...(address.city && { city: address.city }),
            ...(address.region && { region: address.region }),
            ...(address.country && { country: address.country }),
            ...(address.postalCode && { postalCode: address.postalCode }),
            ...(address.name && { name: address.name }),
          };
        }
      }

      return null;
    } catch (error) {
      logError('Failed to reverse geocode:', error);
      return null;
    }
  }

  // Geocode address to coordinates
  async geocode(address: string): Promise<LocationCoordinates | null> {
    try {
      const locations = await Location.geocodeAsync(address);

      if (locations.length > 0) {
        const location = locations[0];
        if (location) {
          return {
            latitude: location.latitude,
            longitude: location.longitude,
          };
        }
      }

      return null;
    } catch (error) {
      logError('Failed to geocode address:', error);
      return null;
    }
  }

  // Calculate distance between two coordinates (in kilometers)
  calculateDistance(
    coord1: LocationCoordinates,
    coord2: LocationCoordinates
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * 
      Math.cos(this.toRadians(coord2.latitude)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Check if coordinates are within search radius
  isWithinRadius(
    center: LocationCoordinates,
    target: LocationCoordinates,
    radiusKm?: number
  ): boolean {
    const radius = radiusKm || this.preferences.searchRadius;
    const distance = this.calculateDistance(center, target);
    return distance <= radius;
  }

  // Get location preferences
  getPreferences(): LocationPreferences {
    return { ...this.preferences };
  }

  // Update location preferences
  async updatePreferences(updates: Partial<LocationPreferences>): Promise<void> {
    try {
      this.preferences = { ...this.preferences, ...updates };
      await this.savePreferences();
      log('Location preferences updated');
    } catch (error) {
      logError('Failed to update location preferences:', error);
    }
  }

  // Format coordinates for display
  formatCoordinates(coordinates: LocationCoordinates): string {
    return `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
  }

  // Format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceKm)}km`;
    }
  }

  // Convert degrees to radians
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Load preferences from storage
  private async loadPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.PREFERENCES_KEY);
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      logError('Failed to load location preferences:', error);
    }
  }

  // Save preferences to storage
  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      logError('Failed to save location preferences:', error);
    }
  }

  // Load last known location from storage
  private async loadLastLocation(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.LAST_LOCATION_KEY);
      if (stored) {
        this.lastKnownLocation = JSON.parse(stored);
      }
    } catch (error) {
      logError('Failed to load last location:', error);
    }
  }

  // Save last known location to storage
  private async saveLastLocation(location: LocationCoordinates): Promise<void> {
    try {
      await AsyncStorage.setItem(this.LAST_LOCATION_KEY, JSON.stringify(location));
    } catch (error) {
      logError('Failed to save last location:', error);
    }
  }
}

// Create service instance
export const locationService = new LocationService();