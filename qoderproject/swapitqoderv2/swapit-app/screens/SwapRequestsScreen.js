import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import API service
import { getCurrentUser, getSwapRequests } from '../utils/api';

const SwapRequestsScreen = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // Fetch swap requests data from Supabase
  useEffect(() => {
    fetchSwapRequestsData();
  }, []);

  const fetchSwapRequestsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Fetch swap requests
      const allRequests = await getSwapRequests(currentUser.id);
      
      // Separate received and sent requests
      const received = allRequests.filter(request => request.owner_id === currentUser.id);
      const sent = allRequests.filter(request => request.requester_id === currentUser.id);
      
      // Format the data to match the existing structure
      const formattedReceived = received.map(request => ({
        id: request.id.toString(),
        user: {
          name: request.requester?.name || 'Unknown User',
          timestamp: new Date(request.created_at).toLocaleString()
        },
        items: {
          want: {
            name: request.items?.title || 'Unknown Item',
            label: 'Wants'
          },
          offer: {
            name: 'Item for trade', // This would need to be fetched from a related item
            label: 'Offering'
          }
        },
        message: request.message || 'No message provided',
        status: request.status || 'pending'
      }));
      
      const formattedSent = sent.map(request => ({
        id: request.id.toString(),
        user: {
          name: request.owner?.name || 'Unknown User',
          timestamp: new Date(request.created_at).toLocaleString()
        },
        items: {
          want: {
            name: request.items?.title || 'Unknown Item',
            label: 'You Want'
          },
          offer: {
            name: 'Your item', // This would need to be fetched from a related item
            label: 'You Offering'
          }
        },
        message: request.message || 'No message provided',
        status: request.status || 'pending'
      }));
      
      setReceivedRequests(formattedReceived);
      setSentRequests(formattedSent);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      setError('Failed to load swap requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const requests = activeTab === 'received' ? receivedRequests : sentRequests;

  const renderRequestItem = (request) => (
    <View key={request.id} style={styles.requestCard}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatarPlaceholder} />
        <View style={styles.userText}>
          <Text style={styles.userName}>{request.user.name}</Text>
          <Text style={styles.timestamp}>{request.user.timestamp}</Text>
        </View>
      </View>

      {/* Items Swap */}
      <View style={styles.itemsContainer}>
        {/* Want Item */}
        <View style={styles.itemCard}>
          <View style={styles.itemMedia}>
            <View style={styles.itemImageContainer}>
              <View style={styles.imagePlaceholder} />
            </View>
          </View>
          <View style={styles.itemInfo}>
            <View style={styles.itemText}>
              <Text style={styles.itemLabel}>{request.items.want.label}</Text>
              <Text style={styles.itemName}>{request.items.want.name}</Text>
            </View>
          </View>
        </View>

        {/* Swap Icon */}
        <View style={styles.swapIconContainer}>
          <Ionicons name="repeat" size={20} color="#119C21" />
        </View>

        {/* Offer Item */}
        <View style={styles.itemCard}>
          <View style={styles.itemMedia}>
            <View style={styles.itemImageContainer}>
              <View style={styles.imagePlaceholder} />
            </View>
          </View>
          <View style={styles.itemInfo}>
            <View style={styles.itemText}>
              <Text style={styles.itemLabel}>{request.items.offer.label}</Text>
              <Text style={styles.itemName}>{request.items.offer.name}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageLabel}>Message</Text>
        <Text style={styles.messageText}>{request.message}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#021229" />
        </TouchableOpacity>
        
        {activeTab === 'received' ? (
          <>
            <TouchableOpacity style={styles.rejectButton}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading swap requests...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchSwapRequestsData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.appBarTitle}>Swap Requests</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>
            Received
          </Text>
          <View style={[styles.badge, activeTab === 'received' && styles.activeBadge]}>
            <Text style={[styles.badgeText, activeTab === 'received' && styles.activeBadgeText]}>
              {receivedRequests.length}
            </Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
            Sent
          </Text>
          <View style={[styles.badge, activeTab === 'sent' && styles.activeBadge]}>
            <Text style={[styles.badgeText, activeTab === 'sent' && styles.activeBadgeText]}>
              {sentRequests.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {requests.map(renderRequestItem)}
      </ScrollView>

      {/* Home Indicator */}
      <View style={styles.homeIndicatorContainer}>
        <View style={styles.homeIndicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
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
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F5EC',
    paddingTop: 16,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
    backgroundColor: '#F7F5EC',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeTab: {
    borderBottomColor: '#119C21',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6E6D7A',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#119C21',
  },
  badge: {
    backgroundColor: '#6E6D7A',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: '#119C21',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  activeBadgeText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    padding: 16,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E7E8EC',
    marginRight: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#021229',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
    color: '#6E6D7A',
  },
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 12,
  },
  itemMedia: {
    padding: 4,
  },
  itemImageContainer: {
    width: 92,
    height: 92,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E7E8EC',
  },
  itemInfo: {
    padding: 12,
  },
  itemText: {
    gap: 4,
  },
  itemLabel: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
    height: 40,
  },
  swapIconContainer: {
    backgroundColor: '#D8F7D7',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6E6D7A',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#021229',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FD5F59',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#119C21',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FD5F59',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  homeIndicatorContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F7F5EC',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#021229',
    borderRadius: 100,
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
});

export default SwapRequestsScreen;