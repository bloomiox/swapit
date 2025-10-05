import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatDetailsScreen = ({ route, navigation }) => {
  const { userName } = route.params || { userName: 'Sarah Miller' };
  const [message, setMessage] = useState('');
  
  // Sample messages data
  const messages = [
    { 
      id: '1', 
      text: 'This is how a message will look from other person', 
      sender: 'other', 
      time: '12:04 PM',
      date: 'Today'
    },
    { 
      id: '2', 
      text: 'The bubble will have certain length', 
      sender: 'other', 
      time: '12:04 PM',
      date: 'Today'
    },
    { 
      id: '3', 
      text: 'This is how a message will look from myself', 
      sender: 'me', 
      time: '12:04 PM',
      date: 'Today'
    },
    { 
      id: '4', 
      text: 'Messages will be separated by date. Today and Yesterday will be used and then the date will be shown afterwards', 
      sender: 'me', 
      time: '12:04 PM',
      date: 'Yesterday'
    },
    { 
      id: '5', 
      text: 'Sure, Alright', 
      sender: 'other', 
      time: '12:04 PM',
      date: 'Yesterday'
    },
    { 
      id: '6', 
      text: 'Oh! and consecutive messages from the same user will have less spacing as compared to other person message', 
      sender: 'other', 
      time: '12:04 PM',
      date: 'Yesterday'
    },
    { 
      id: '7', 
      text: 'Cool! Let\'s see how this project goes. Maybe in the future, we can have more like this.', 
      sender: 'me', 
      time: '12:04 PM',
      date: 'Yesterday'
    },
  ];

  const sendMessage = () => {
    if (message.trim()) {
      // In a real app, you would send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const renderDateSeparator = (date) => (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeText}>{date}</Text>
      </View>
      <View style={styles.dateLine} />
    </View>
  );

  const renderMessage = ({ item, index }) => {
    const showDateSeparator = index === 0 || 
      (index > 0 && messages[index - 1].date !== item.date);
    
    return (
      <View>
        {showDateSeparator && renderDateSeparator(item.date)}
        <View style={[
          styles.messageContainer,
          item.sender === 'me' ? styles.myMessageContainer : styles.otherMessageContainer
        ]}>
          <View style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
            ]}>
              {item.text}
            </Text>
            <Text style={[
              styles.messageTime,
              item.sender === 'me' ? styles.myMessageTimeMe : styles.myMessageTimeOther
            ]}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar backgroundColor="#F7F5EC" barStyle="dark-content" />
      
      {/* Chat App Bar */}
      <View style={styles.chatAppBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{userName}</Text>
            <View style={styles.userStatus}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      
      {/* Type Message */}
      <View style={styles.inputContainer}>
        <View style={styles.textField}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message here..."
            placeholderTextColor="#6E6D7A"
            value={message}
            onChangeText={setMessage}
          />
        </View>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  chatAppBar: {
    backgroundColor: '#F7F5EC',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E8EC',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatarContainer: {
    marginRight: 12,
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
  userDetails: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#021229',
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#119C21',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  messagesContainer: {
    paddingVertical: 8,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C7D1D9',
  },
  dateBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E8EC',
    borderRadius: 400,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#021229',
  },
  messageContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  myMessageBubble: {
    backgroundColor: '#119C21',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#021229',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
  myMessageTimeMe: {
    color: '#FFFFFF',
  },
  myMessageTimeOther: {
    color: '#6E6D7A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 24,
    backgroundColor: '#F7F5EC',
  },
  textField: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    marginRight: 8,
  },
  messageInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#021229',
  },
  sendButton: {
    backgroundColor: '#119C21',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#021229',
    borderRadius: 100,
  },
});

export default ChatDetailsScreen;