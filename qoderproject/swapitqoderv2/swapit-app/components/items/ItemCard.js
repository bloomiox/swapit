import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ItemCard = ({ item, onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.itemCard, style]}
      onPress={onPress}
    >
      <View style={styles.itemImageContainer}>
        <View style={styles.itemImagePlaceholder}>
          <Text style={styles.placeholderText}>Image</Text>
        </View>
        {item.free && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>FREE</Text>
          </View>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title || item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={12} color="#666" />
          <Text style={styles.itemLocation}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: 160,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImagePlaceholder: {
    height: 120,
    backgroundColor: '#eee',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4e6aff',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default ItemCard;