import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { itemsApi } from '../../src/services/api';
import { Button } from '../../src/components/shared/Button/Button';
import type { Item } from '../../src/types';

const { width } = Dimensions.get('window');

export default function ItemDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      loadItem();
      checkIfSaved();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      setIsLoading(true);
      const itemData = await itemsApi.getItem(id!);
      setItem(itemData);
    } catch (error) {
      console.error('Error loading item:', error);
      Alert.alert('Error', 'Failed to load item details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const saved = await itemsApi.checkIfSaved(id!);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking if item is saved:', error);
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await itemsApi.unsaveItem(id!);
        setIsSaved(false);
      } else {
        await itemsApi.saveItem(id!);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
    }
  };

  const handleSwapRequest = () => {
    if (!item) return;
    
    // Navigate to swap request creation
    router.push({
      pathname: '/swap/create',
      params: { itemId: item.id }
    });
  };

  const handleContactOwner = () => {
    if (!item?.user) return;
    
    // Navigate to chat with owner
    router.push({
      pathname: '/chat/[id]',
      params: { id: item.user.id }
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading item details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorTitle}>Item not found</Text>
          <Text style={styles.errorSubtitle}>
            This item may have been removed or is no longer available.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveToggle} style={styles.saveButton}>
          <Ionicons 
            name={isSaved ? "heart" : "heart-outline"} 
            size={24} 
            color={isSaved ? "#EF4444" : "#111827"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Image Gallery */}
        {item.images && item.images.length > 0 && (
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
            >
              {item.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            
            {item.images.length > 1 && (
              <View style={styles.imageIndicators}>
                {item.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.indicator,
                      index === currentImageIndex && styles.activeIndicator
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Item Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          
          <View style={styles.conditionContainer}>
            <Text style={styles.conditionLabel}>Condition:</Text>
            <Text style={styles.conditionValue}>{item.condition.replace('_', ' ')}</Text>
          </View>

          {item.is_free && (
            <View style={styles.freeTag}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          )}

          {item.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          )}

          {/* Location */}
          {item.location_name && (
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color="#6B7280" />
              <Text style={styles.locationText}>{item.location_name}</Text>
            </View>
          )}

          {/* Owner Info */}
          {item.user && (
            <View style={styles.ownerContainer}>
              <Text style={styles.ownerTitle}>Listed by</Text>
              <View style={styles.ownerInfo}>
                {item.user.avatar_url ? (
                  <Image
                    source={{ uri: item.user.avatar_url }}
                    style={styles.ownerAvatar}
                  />
                ) : (
                  <View style={[styles.ownerAvatar, styles.ownerAvatarPlaceholder]}>
                    <Ionicons name="person" size={20} color="#6B7280" />
                  </View>
                )}
                <View style={styles.ownerDetails}>
                  <Text style={styles.ownerName}>
                    {item.user.full_name || 'Anonymous User'}
                  </Text>
                  {item.user.rating_average && item.user.rating_count > 0 && (
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.ratingText}>
                        {item.user.rating_average.toFixed(1)} ({item.user.rating_count} reviews)
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Button
          title="Contact Owner"
          onPress={handleContactOwner}
          variant="outline"
          style={styles.contactButton}
        />
        <Button
          title={item.is_free ? "Claim Item" : "Request Swap"}
          onPress={handleSwapRequest}
          style={styles.swapButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: width,
    height: 300,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
  },
  detailsContainer: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  conditionLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 8,
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    textTransform: 'capitalize',
  },
  freeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  freeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  ownerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 20,
  },
  ownerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  ownerAvatarPlaceholder: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
  },
  swapButton: {
    flex: 1,
    marginLeft: 8,
  },
});