import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import new components
import ItemCard from '../components/items/ItemCard';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('My Items');
  
  // Sample user data
  const user = {
    name: 'John Doe',
    bio: 'Eco-conscious swapper. Love giving items a second life!',
    joinDate: 'Joined at 19 Dec 2024',
    location: 'Rorschach, Sankt Gallen',
    swaps: 24,
    items: 4,
    rating: 4.5,
  };

  const menuItems = [
    { id: '1', title: 'My Listings', icon: 'list', screen: 'MyListings' },
    { id: '2', title: 'Saved Items', icon: 'heart', screen: 'SavedItems' },
    { id: '3', title: 'Settings', icon: 'settings', screen: 'Settings' },
    { id: '4', title: 'Payment History', icon: 'card', screen: 'PaymentHistory' },
    { id: '5', title: 'Help & Support', icon: 'help-circle', screen: 'Help' },
  ];

  const items = [
    { id: '1', name: 'iPhone', location: 'Berkeley CA · 9.3km' },
    { id: '2', name: 'Office Bag', location: 'Berkeley CA · 9.3km', free: true },
    { id: '3', name: 'Wooden table with stool', location: 'Berkeley CA · 9.3km' },
    { id: '4', name: 'Original Airpods 2', location: 'Berkeley CA · 9.3km' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  const renderTab = (tabName, badgeCount) => (
    <TouchableOpacity 
      style={[styles.tab, activeTab === tabName && styles.activeTab]}
      onPress={() => setActiveTab(tabName)}
    >
      <Text style={[styles.tabText, activeTab === tabName && styles.activeTabText]}>{tabName}</Text>
      <View style={[styles.badge, activeTab === tabName && styles.activeBadge]}>
        <Text style={[styles.badgeText, activeTab === tabName && styles.activeBadgeText]}>{badgeCount}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#F7F5EC" barStyle="dark-content" />
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Profile</Text>
        <View style={styles.appBarIcons}>
          <TouchableOpacity 
            style={styles.appBarButton} 
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#021229" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.appBarButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#021229" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.appBarButton}>
            <Ionicons name="help-circle-outline" size={24} color="#021229" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userBio}>{user.bio}</Text>
            </View>
          </View>
          
          <View style={styles.userDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#6E6D7A" />
              <Text style={styles.detailText}>{user.joinDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#6E6D7A" />
              <Text style={styles.detailText}>{user.location}</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.swaps}</Text>
              <Text style={styles.statLabel}>Swaps</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.items}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.ratingContainer}>
                <Text style={styles.statNumber}>{user.rating}</Text>
                <Ionicons name="star" size={16} color="#FFC107" />
              </View>
              <Text style={styles.statLabel}>Ratings</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="pencil" size={16} color="#021229" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {renderTab('My Items', 12)}
          {renderTab('Saved Items', 3)}
        </View>
        
        {/* Items Grid */}
        <View style={styles.itemsContainer}>
          {items.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
              style={styles.itemCard}
            />
          ))}
        </View>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Ionicons name={item.icon} size={20} color="#021229" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#6E6D7A" />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FFFFFF" style={styles.menuIcon} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
    paddingTop: 50,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#021229',
  },
  appBarIcons: {
    flexDirection: 'row',
  },
  appBarButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  profileInfo: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4e6aff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#119C21',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#021229',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#6E6D7A',
  },
  userDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6E6D7A',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#021229',
  },
  statLabel: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8F7D7',
    borderRadius: 16,
    paddingVertical: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeTab: {
    backgroundColor: '#D8F7D7',
    borderRadius: 16,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6D7A',
  },
  activeTabText: {
    color: '#119C21',
  },
  badge: {
    backgroundColor: '#E7E8EC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  activeBadge: {
    backgroundColor: '#119C21',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E6D7A',
  },
  activeBadgeText: {
    color: '#FFFFFF',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  itemCard: {
    width: '48%',
    marginBottom: 16,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#021229',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    marginTop: 16,
    borderBottomWidth: 0,
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProfileScreen;