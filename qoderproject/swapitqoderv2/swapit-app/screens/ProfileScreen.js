import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import new components
import ItemCard from '../components/items/ItemCard';
// Import API service
import { getUserItems } from '../utils/api';
// Import Auth context
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('My Items');
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout, user: authUser, isEmailVerified } = useAuth();

  // Fetch user data and items from Supabase
  useEffect(() => {
    fetchUserData();
    fetchUserItems();
  }, [authUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in
      if (!authUser) {
        throw new Error('No user logged in');
      }
      
      // Use the user profile from auth context
      if (authUser.profile) {
        setUser(authUser.profile);
      } else {
        setUser({
          name: authUser.email?.split('@')[0] || 'User',
          email: authUser.email,
          bio: '',
          location: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      // Check if user is logged in
      if (!authUser) {
        throw new Error('No user logged in');
      }
      
      // Fetch user items
      const userItems = await getUserItems(authUser.id);
      setItems(userItems);
    } catch (error) {
      console.error('Error fetching user items:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => {
            logout();
            navigation.replace('Login');
          } 
        }
      ]
    );
  };

  const handleHelp = () => {
    navigation.navigate('Help');
  };

  const handleVerifyEmail = () => {
    navigation.navigate('EmailVerification');
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

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Render empty state
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text>User not found</Text>
        </View>
      </View>
    );
  }

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
          <TouchableOpacity 
            style={styles.appBarButton}
            onPress={handleHelp}
          >
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
                <Text style={styles.avatarText}>
                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </Text>
              </View>
              {/* Unverified indicator - only shown to unverified users */}
              {!isEmailVerified() && (
                <View style={styles.unverifiedIndicator}>
                  <Text style={styles.unverifiedText}>!</Text>
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name || 'Unknown User'}</Text>
              <Text style={styles.userBio}>{user.bio || 'No bio available'}</Text>
            </View>
          </View>
          
          {/* Verification Banner - only shown to unverified users */}
          {!isEmailVerified() && (
            <View style={styles.verificationBanner}>
              <View style={styles.verificationContent}>
                <Ionicons name="alert-circle-outline" size={20} color="#FF9500" />
                <Text style={styles.verificationText}>Email not verified</Text>
                <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail}>
                  <Text style={styles.verifyButtonText}>Verify</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          <View style={styles.userDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#6E6D7A" />
              <Text style={styles.detailText}>{user.join_date ? new Date(user.join_date).toLocaleDateString() : 'Join date not available'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={16} color="#6E6D7A" />
              <Text style={styles.detailText}>{user.location || 'Location not available'}</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.swaps || 0}</Text>
              <Text style={styles.statLabel}>Swaps</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{user.items || 0}</Text>
              <Text style={styles.statLabel}>Items</Text>
            </View>
            <View style={styles.statBox}>
              <View style={styles.ratingContainer}>
                <Text style={styles.statNumber}>{user.rating || 0}</Text>
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
          {renderTab('My Items', user.items || 0)}
          {renderTab('Saved Items', 0)} // TODO: Fetch saved items count from Supabase
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
        
        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#FFFFFF" style={styles.logoutIcon} />
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
  unverifiedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unverifiedText: {
    color: '#FFFFFF',
    fontSize: 14,
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
  verificationBanner: {
    backgroundColor: '#FFF4E5',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE5B4',
    marginBottom: 16,
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginLeft: 12,
  },
  verifyButton: {
    backgroundColor: '#FF9500',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  logoutContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;