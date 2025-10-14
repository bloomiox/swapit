import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import API service
import { getChats } from '../utils/api';
// Import Auth context
import { useAuth } from '../contexts/AuthContext';

const ChatScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser, isEmailVerified } = useAuth();

  // Fetch chats data from Supabase
  useEffect(() => {
    if (!isEmailVerified()) {
      Alert.alert(
        'Email Verification Required',
        'Please verify your email address to access chat features.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('EmailVerification')
          }
        ]
      );
      return;
    }
    
    fetchChatsData();
  }, [authUser, isEmailVerified]);

  const fetchChatsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in
      if (!authUser) {
        throw new Error('No user logged in');
      }
      
      // Fetch chats
      const chatsData = await getChats(authUser.id);
      
      // Format the data to match the existing structure
      const formattedChats = chatsData.map(chat => ({
        id: chat.id.toString(),
        user: chat.requester_id === authUser.id ? 
          (chat.owner?.name || 'Unknown User') : 
          (chat.requester?.name || 'Unknown User'),
        lastMessage: 'Latest message will appear here', // This would need to be fetched from messages
        time: new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0, // This would need to be calculated from unread messages
      }));
      
      setConversations(formattedChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setError('Failed to load chats. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationCard}
      onPress={() => navigation.navigate('ChatDetails', { conversationId: item.id, userName: item.user })}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.user.charAt(0)}</Text>
        </View>
      </View>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading chats...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchChatsData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
        <Text style={styles.appBarTitle}>Chat</Text>
      </View>
      
      {/* Chat List */}
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  appBar: {
    backgroundColor: '#F7F5EC',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
    paddingTop: 50,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  conversationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#119C21',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#021229',
  },
  time: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6E6D7A',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#FDE1E0',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#7C0D09',
    fontSize: 8,
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
});

export default ChatScreen;