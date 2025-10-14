import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotifications } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getNotifications(user.id);
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const groupNotifications = (notifications) => {
    const newNotifications = [];
    const allNotifications = [];
    
    notifications.forEach(notification => {
      // For now, we'll consider notifications as "new" if they haven't been marked as read
      // In a real app, you might use a timestamp or other criteria
      if (!notification.read) {
        newNotifications.push({ ...notification, isNew: true });
      } else {
        allNotifications.push({ ...notification, isNew: false });
      }
    });
    
    return { newNotifications, allNotifications };
  };

  const { newNotifications, allNotifications } = groupNotifications(notifications);

  const NotificationItem = ({ notification }) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          {notification.text || notification.message || 'Notification'}
        </Text>
        <Text style={styles.notificationTime}>
          {notification.timestamp 
            ? new Date(notification.timestamp).toLocaleString()
            : notification.created_at 
            ? new Date(notification.created_at).toLocaleString()
            : 'Unknown time'}
        </Text>
      </View>
      {notification.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>New</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#021229" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alerts</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#119C21" />
        </View>
      </SafeAreaView>
    );
  }

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

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#119C21']} />
        }
      >
        {/* New Notifications Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.flameIcon}>
              <Ionicons name="flame" size={20} color="#FF4500" />
            </View>
            <Text style={styles.sectionTitle}>New</Text>
          </View>
          <View style={styles.notificationsContainer}>
            {newNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No new notifications</Text>
              </View>
            ) : (
              newNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
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
            {allNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No notifications yet</Text>
              </View>
            ) : (
              allNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
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
    paddingVertical: 40,
    backgroundColor: '#F7F5EC',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021229',
    fontFamily: 'DM Sans',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 14,
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
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E8EC',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6E6D7A',
    fontFamily: 'DM Sans',
  },
});

export default NotificationsScreen;