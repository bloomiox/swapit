import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { LocationCoordinates } from '../../services/location';

interface MapViewProps {
  location: LocationCoordinates;
  title?: string;
  showMarker?: boolean;
  style?: any;
}

// Placeholder component for map functionality
// TODO: Integrate with react-native-maps when needed
export const MapView: React.FC<MapViewProps> = ({
  location,
  title,
  showMarker = true,
  style,
}) => {
  const formatCoordinates = (coords: LocationCoordinates): string => {
    return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.placeholder}>
        <Ionicons name="map" size={48} color="#6B7280" />
        <Text style={styles.title}>
          {title || 'Map View'}
        </Text>
        <Text style={styles.coordinates}>
          {formatCoordinates(location)}
        </Text>
        <Text style={styles.note}>
          Map integration coming soon
        </Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  placeholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});