import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserDetailsScreen = ({ route, navigation }) => {
  // Sample user data (in a real app, this would come from route.params or an API)
  const user = {
    id: route.params?.userId || '123',
    name: 'John Doe',
    location: 'New York, NY',
    memberSince: 'January 2023',
    rating: 4.8,
    itemsListed: 12,
    tradesCompleted: 8,
    bio: 'Passionate collector and trader of vintage items. Love to exchange stories along with items.',
  };

  const items = [
    { id: '1', title: 'Vintage Camera', category: 'Electronics', image: 'image1' },
    { id: '2', title: 'Leather Jacket', category: 'Clothing', image: 'image2' },
    { id: '3', title: 'Cookbook Collection', category: 'Books', image: 'image3' },
    { id: '4', title: 'Vinyl Records', category: 'Music', image: 'image4' },
    { id: '5', title: 'Antique Watch', category: 'Accessories', image: 'image5' },
    { id: '6', title: 'Art Prints', category: 'Art', image: 'image6' },
  ];

  const handleContactUser = () => {
    // In a real app, this would navigate to the chat screen
    navigation.navigate('ChatDetails', { userId: user.id });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemCard}>
      <View style={styles.itemImagePlaceholder}>
        <Text style={styles.placeholderText}>{item.title}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <View style={styles.statusIcons}>
          <Ionicons name="signal" size={16} color="#021229" />
          <Ionicons name="wifi" size={16} color="#021229" />
          <View style={styles.batteryContainer}>
            <View style={styles.batteryFill} />
          </View>
        </View>
      </View>

      {/* App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>User Profile</Text>
        <View style={styles.emptySpace} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#6E6D7A" />
              <Text style={styles.userLocation}>{user.location}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{user.rating}</Text>
              <Text style={styles.ratingCount}>(128)</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.itemsListed}</Text>
            <Text style={styles.statLabel}>Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.tradesCompleted}</Text>
            <Text style={styles.statLabel}>Swaps</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Response</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          <View style={styles.memberSinceContainer}>
            <Text style={styles.memberLabel}>Member since</Text>
            <Text style={styles.memberValue}>{user.memberSince}</Text>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.itemsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Items Listed</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.itemsList}
          />
        </View>
      </ScrollView>

      {/* Contact Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactUser}>
          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFFFFF" />
          <Text style={styles.contactButtonText}>Contact User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  content: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 7,
    backgroundColor: '#F7F5EC',
    height: 32,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
    letterSpacing: -0.41,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  batteryContainer: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: '#021229',
    borderRadius: 3,
    justifyContent: 'center',
    paddingHorizontal: 1,
  },
  batteryFill: {
    height: 8,
    backgroundColor: '#021229',
    borderRadius: 2,
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
  },
  backButton: {
    padding: 4,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
  },
  emptySpace: {
    width: 32,
  },
  profileHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userLocation: {
    fontSize: 16,
    color: '#6E6D7A',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 16,
    color: '#6E6D7A',
    marginLeft: 4,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#119C21',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6E6D7A',
  },
  aboutSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#6E6D7A',
    lineHeight: 24,
    marginBottom: 16,
  },
  memberSinceContainer: {
    flexDirection: 'row',
  },
  memberLabel: {
    fontSize: 16,
    color: '#6E6D7A',
    marginRight: 4,
  },
  memberValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
  },
  itemsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#119C21',
    fontWeight: '600',
  },
  itemsList: {
    paddingVertical: 8,
  },
  itemCard: {
    width: 160,
    backgroundColor: '#F7F5EC',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
  },
  itemImagePlaceholder: {
    height: 120,
    backgroundColor: '#E7E8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6E6D7A',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  itemInfo: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: '#6E6D7A',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingVertical: 16,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default UserDetailsScreen;