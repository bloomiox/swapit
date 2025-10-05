import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationsScreen = ({ navigation }) => {
  // Sample notification data
  const newNotifications = [
    {
      id: '1',
      text: 'Sarah Miller has requested a swap for your Vintage Stool',
      time: '19 Dec 2024 at 12:00 PM',
      isNew: true,
    },
    {
      id: '2',
      text: 'Joshua has requested a swap for your Vintage Stool',
      time: '19 Dec 2024 at 11:00 PM',
      isNew: true,
    },
  ];

  const allNotifications = [
    {
      id: '3',
      text: 'Henry Wong has requested a swap for your Vintage Stool',
      time: '19 Dec 2024 at 9:00 PM',
      isNew: false,
    },
    {
      id: '4',
      text: 'Ali has requested a swap for your iPhone',
      time: '19 Dec 2024 at 8:40 PM',
      isNew: false,
    },
    {
      id: '5',
      text: 'Jane has requested a swap for your iPhone',
      time: '19 Dec 2024 at 7:11 PM',
      isNew: false,
    },
    {
      id: '6',
      text: 'Jane has requested a swap for your iPhone',
      time: '19 Dec 2024 at 12:00 PM',
      isNew: false,
    },
  ];

  const NotificationItem = ({ notification }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{notification.text}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
      {notification.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>New</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#021229" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* New Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.flameIcon}>
              <Ionicons name="flame" size={20} color="#FF4500" />
            </View>
            <Text style={styles.sectionTitle}>New</Text>
          </View>
          <View style={styles.notificationsContainer}>
            {newNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </View>
        </View>

        {/* All Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.bellIcon}>
              <Ionicons name="notifications" size={20} color="#021229" />
            </View>
            <Text style={styles.sectionTitle}>All Notifications</Text>
          </View>
          <View style={styles.notificationsContainer}>
            {allNotifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F7F5EC',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#021229',
    fontFamily: 'DM Sans',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  flameIcon: {
    marginRight: 12,
  },
  bellIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#021229',
    fontFamily: 'DM Sans',
  },
  notificationsContainer: {
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#021229',
    fontFamily: 'DM Sans',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 14,
    color: '#6E6D7A',
    fontFamily: 'DM Sans',
  },
  newBadge: {
    backgroundColor: '#FD5F59',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  newBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'DM Sans',
  },
});

export default NotificationsScreen;