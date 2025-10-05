import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ItemDetailsScreen = ({ route, navigation }) => {
  // Sample item data (in a real app, this would come from route.params or an API)
  const item = {
    id: route.params?.itemId || '1',
    title: 'Vintage Camera',
    description: 'Beautiful vintage film camera in perfect working condition. Great for photography enthusiasts!',
    category: 'Electronics',
    user: {
      name: 'John Doe',
      rating: 4.5,
      swapCount: 24
    },
    location: 'Berkeley CA · 9.3km away',
    condition: 'New Condition',
    publishedAt: 'Published at 19 Dec 2024 at 12:00 PM',
    lookingFor: ['Books', 'Electronics', 'Sports & Fitness', 'Toys & Games'],
    images: [],
    isFree: true
  };

  const handleRequestTrade = () => {
    navigation.navigate('SwapRequest', { item });
  };

  const handleUserPress = () => {
    navigation.navigate('UserDetails', { userId: '123' });
  };

  const handleChatPress = () => {
    navigation.navigate('ChatDetails', { userId: '123' });
  };

  const handleShare = () => {
    Alert.alert('Share', 'This would share the item.');
  };

  const handleSave = () => {
    Alert.alert('Save', 'Item saved to your favorites.');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#021229" />
          </TouchableOpacity>
          <View style={styles.appBarButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
              <Ionicons name="heart-outline" size={24} color="#021229" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={24} color="#021229" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Item Photos */}
        <View style={styles.photosContainer}>
          <View style={styles.mainImageSection}>
            {/* Main Image (3/4 of the column) */}
            <View style={styles.mainImageContainer}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>Main Item Image</Text>
              </View>
            </View>
            
            {/* Additional Images (1/4 of the column) */}
            <View style={styles.additionalImagesContainer}>
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.additionalImageContainer, 
                    index === 0 && styles.activeAdditionalImage
                  ]}
                >
                  <View style={styles.additionalImage} />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Item Info */}
        <View style={styles.infoContainer}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemLocation}>{item.location}</Text>
          </View>

          <View style={styles.badgesContainer}>
            {item.isFree && (
              <View style={styles.badgeFree}>
                <Ionicons name="rocket-outline" size={16} color="#119C21" />
                <Text style={styles.badgeFreeText}>For FREE</Text>
              </View>
            )}
            <View style={styles.badgeCategory}>
              <Ionicons name="phone-portrait-outline" size={16} color="#021229" />
              <Text style={styles.badgeCategoryText}>{item.category}</Text>
            </View>
            <View style={styles.badgeCondition}>
              <Ionicons name="happy-outline" size={16} color="#119C21" />
              <Text style={styles.badgeConditionText}>{item.condition}</Text>
            </View>
          </View>

          <View style={styles.itemDescriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>

          <View style={styles.lookingForContainer}>
            <Text style={styles.lookingForTitle}>Looking for</Text>
            <View style={styles.lookingForBadges}>
              {item.lookingFor.map((category, index) => (
                <View key={index} style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userContainer}>
          <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.userText}>
              <Text style={styles.userName}>{item.user.name}</Text>
              <View style={styles.userRating}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.userRatingText}>{item.user.rating}</Text>
                <Text style={styles.userSwaps}>({item.user.swapCount} swaps)</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={handleChatPress}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#021229" />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Request Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.requestButton}
          onPress={handleRequestTrade}
        >
          <Text style={styles.requestButtonText}>Request Swap</Text>
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
  appBarButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  photosContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  mainImageSection: {
    flexDirection: 'row',
    height: 300,
  },
  mainImageContainer: {
    flex: 3, // 3/4 of the space
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#E7E8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  additionalImagesContainer: {
    flex: 1, // 1/4 of the space
    justifyContent: 'space-between',
  },
  additionalImageContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  activeAdditionalImage: {
    borderColor: '#119C21',
  },
  additionalImage: {
    flex: 1,
    backgroundColor: '#E7E8EC',
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  itemHeader: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 8,
  },
  itemLocation: {
    fontSize: 16,
    color: '#6E6D7A',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badgeFree: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D8F7D7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeFreeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#119C21',
    marginLeft: 4,
  },
  badgeCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
    marginLeft: 4,
  },
  badgeCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D8F7D7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeConditionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#119C21',
    marginLeft: 4,
  },
  itemDescriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
    color: '#6E6D7A',
    lineHeight: 24,
  },
  lookingForContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  lookingForTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 12,
  },
  lookingForBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    fontSize: 14,
    color: '#021229',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E7E8EC',
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 4,
  },
  userRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRatingText: {
    fontSize: 14,
    color: '#6E6D7A',
    marginLeft: 4,
    marginRight: 4,
  },
  userSwaps: {
    fontSize: 14,
    color: '#6E6D7A',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
    marginLeft: 4,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  requestButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ItemDetailsScreen;