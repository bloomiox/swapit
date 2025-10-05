import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeAppBar = ({ location, onLocationPress, onSearchPress, onNotificationsPress }) => {
  return (
    <View style={styles.appBar}>
      <TouchableOpacity style={styles.locationContainer} onPress={onLocationPress}>
        <Ionicons name="location" size={16} color="#119C21" style={styles.locationIcon} />
        <Text style={styles.locationText} numberOfLines={1}>{location}</Text>
        <Ionicons name="chevron-down" size={16} color="#021229" />
      </TouchableOpacity>
      <View style={styles.appBarButtons}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onSearchPress}
        >
          <Ionicons name="search" size={24} color="#021229" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={onNotificationsPress}
        >
          <Ionicons name="notifications" size={24} color="#021229" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeLabel}>2</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
    paddingTop: 50, // Account for status bar
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
    maxWidth: 150,
    marginRight: 4,
  },
  appBarButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeAppBar;