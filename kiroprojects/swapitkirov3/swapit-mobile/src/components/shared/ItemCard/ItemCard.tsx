import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '../../../types';
import { locationService, LocationCoordinates } from '../../../services/location';

export interface ItemCardProps {
  item: Item;
  onPress?: (item: Item) => void;
  variant?: 'grid' | 'list';
  showDistance?: boolean;
  userLocation?: LocationCoordinates | undefined;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onPress,
  variant = 'grid',
  showDistance = false,
  userLocation,
}) => {
  // Calculate distance if both locations are available
  const distance = React.useMemo(() => {
    if (!showDistance || !userLocation || !item.location_coordinates?.latitude || !item.location_coordinates?.longitude) {
      return null;
    }
    
    const itemLocation = {
      latitude: item.location_coordinates.latitude,
      longitude: item.location_coordinates.longitude,
    };
    
    const distanceKm = locationService.calculateDistance(userLocation, itemLocation);
    return locationService.formatDistance(distanceKm);
  }, [showDistance, userLocation, item.location_coordinates]);
  return (
    <TouchableOpacity
      style={[styles.card, variant === 'list' && styles.listCard]}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {item.images && item.images.length > 0 && (
        <Image
          source={{ uri: item.images[0] }}
          style={[styles.image, variant === 'list' && styles.listImage]}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.condition}>{item.condition}</Text>
        {(item.location_name || distance) && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#6B7280" />
            <Text style={styles.location} numberOfLines={1}>
              {distance ? `${distance} • ${item.location_name || 'Unknown location'}` : item.location_name}
            </Text>
          </View>
        )}
        {!item.is_free && item.looking_for && (
          <View style={styles.lookingForContainer}>
            <Text style={styles.lookingForLabel}>Looking for:</Text>
            <Text style={styles.lookingForText} numberOfLines={1}>
              {item.looking_for}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
  },
  listCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 12,
  },
  content: {
    padding: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  condition: {
    fontSize: 12,
    color: '#10B981',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  lookingForContainer: {
    marginTop: 4,
  },
  lookingForLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  lookingForText: {
    fontSize: 11,
    color: '#10B981',
    fontStyle: 'italic',
  },
});