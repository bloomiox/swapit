import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ navigation }) => {
  // Sample data for conversations
  const conversations = [
    { 
      id: '1', 
      user: 'Sarah Miller', 
      lastMessage: 'Latest message will appear here and will truncate on the first line as well', 
      time: '12:17 PM', 
      unread: 2,
    },
    { 
      id: '2', 
      user: 'Joshua', 
      lastMessage: 'Latest message will appear here and will truncate on the first line as well', 
      time: '24 Dec', 
      unread: 0,
    },
  ];

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
});

export default ChatScreen;