import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SwapRequestScreen = ({ route, navigation }) => {
  const { item } = route.params || {};
  
  // Sample user items data (in a real app, this would come from an API)
  const userItems = [
    {
      id: '1',
      title: 'Vintage Camera',
      category: 'Electronics',
      condition: 'New',
      image: null,
      isSelected: false
    },
    {
      id: '2',
      title: 'Leather Bag',
      category: 'Fashion',
      condition: 'Like New',
      image: null,
      isSelected: false
    },
    {
      id: '3',
      title: 'Bluetooth Speaker',
      category: 'Electronics',
      condition: 'Good',
      image: null,
      isSelected: false
    },
    {
      id: '4',
      title: 'Wooden Table',
      category: 'Furniture',
      condition: 'Fair',
      image: null,
      isSelected: false
    },
    {
      id: '5',
      title: 'Designer Handbag',
      category: 'Fashion',
      condition: 'New',
      image: null,
      isSelected: false
    },
    {
      id: '6',
      title: 'Vintage Books',
      category: 'Books',
      condition: 'Good',
      image: null,
      isSelected: false
    }
  ];

  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState(userItems);
  const [message, setMessage] = useState('');

  const toggleItemSelection = (itemId) => {
    const updatedItems = items.map(item => {
      if (item.id === itemId) {
        const isSelected = !item.isSelected;
        // Update local state
        if (isSelected) {
          setSelectedItems(prev => [...prev, itemId]);
        } else {
          setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
        return { ...item, isSelected };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleSendRequest = () => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to offer for swap.');
      return;
    }
    
    // In a real app, this would send the request to the backend
    Alert.alert(
      'Swap Request Sent',
      `Your request to swap for "${item?.title}" has been sent!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleAddItem = () => {
    // Navigate to add item screen
    Alert.alert('Add Item', 'This would navigate to the Add Item screen.');
  };

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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Request Swap</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select items to offer</Text>
        <Text style={styles.headerSubtitle}>
          Choose items you'd like to offer in exchange for {item?.title || 'this item'}
        </Text>
      </View>

      {/* Items List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                item.isSelected && styles.selectedItemCard
              ]}
              onPress={() => toggleItemSelection(item.id)}
            >
              <View style={styles.itemCheckbox}>
                {item.isSelected ? (
                  <Ionicons name="checkmark-circle" size={24} color="#119C21" />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color="#6E6D7A" />
                )}
              </View>
              
              <View style={styles.itemImageContainer}>
                <View style={styles.imagePlaceholder} />
              </View>
              
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.itemDetails}>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailText}>{item.category}</Text>
                  </View>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailText}>{item.condition}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Message Box */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageLabel}>Message (Optional)</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Add a personal message to the user..."
          placeholderTextColor="#6E6D7A"
          multiline
          numberOfLines={3}
          value={message}
          onChangeText={setMessage}
        />
      </View>

      {/* Add Item Button */}
      <TouchableOpacity style={styles.addItemButton} onPress={handleAddItem}>
        <Ionicons name="add" size={24} color="#119C21" />
        <Text style={styles.addItemText}>Add Item</Text>
      </TouchableOpacity>

      {/* Send Request Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.sendButton,
            selectedItems.length === 0 && styles.disabledButton
          ]}
          onPress={handleSendRequest}
          disabled={selectedItems.length === 0}
        >
          <Text style={styles.sendButtonText}>
            Send Request {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
          </Text>
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
    height: 64,
  },
  backButton: {
    padding: 4,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
  },
  placeholder: {
    width: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6E6D7A',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  itemsContainer: {
    paddingBottom: 16,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    padding: 12,
    marginBottom: 12,
  },
  selectedItemCard: {
    borderColor: '#119C21',
    backgroundColor: '#D8F7D7',
  },
  itemCheckbox: {
    marginRight: 12,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E7E8EC',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  detailBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6E6D7A',
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#021229',
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E8EC',
    padding: 16,
    fontSize: 16,
    color: '#021229',
    textAlignVertical: 'top',
    height: 100,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#119C21',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#119C21',
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sendButton: {
    backgroundColor: '#119C21',
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#6E6D7A',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SwapRequestScreen;