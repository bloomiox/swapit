import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError, log } from '../config/environment';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  categoryId?: string;
  sound?: boolean;
  badge?: number;
}

export interface NotificationPreferences {
  enabled: boolean;
  swapRequests: boolean;
  messages: boolean;
  nearbyItems: boolean;
  marketing: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

// Notification service for handling push notifications
export class NotificationService {
  private readonly PREFERENCES_KEY = '@swapit_notification_preferences';
  private readonly TOKEN_KEY = '@swapit_push_token';
  private preferences: NotificationPreferences = {
    enabled: true,
    swapRequests: true,
    messages: true,
    nearbyItems: true,
    marketing: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  };

  constructor() {
    this.initialize();
  }

  // Initialize notification service
  private async initialize(): Promise<void> {
    try {
      // Load preferences
      await this.loadPreferences();
      
      log('Notification service initialized (simplified version without expo-notifications)');
    } catch (error) {
      logError('Failed to initialize notification service:', error);
    }
  }

  // Request notification permissions (simplified)
  async requestPermissions(): Promise<boolean> {
    try {
      log('Notification permissions requested (simplified version)');
      return true; // Always return true for simplified version
    } catch (error) {
      logError('Failed to request notification permissions:', error);
      return false;
    }
  }

  // Get push notification token (simplified)
  private async getPushToken(): Promise<string | null> {
    try {
      log('Push token not available in simplified notification service');
      return null;
    } catch (error) {
      logError('Failed to get push token:', error);
      return null;
    }
  }

  // Store push token
  private async storePushToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
      
      // TODO: Send token to backend when user API is available
      // await userApi.updatePushToken(token);
    } catch (error) {
      logError('Failed to store push token:', error);
    }
  }

  // Get stored push token
  async getStoredPushToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      logError('Failed to get stored push token:', error);
      return null;
    }
  }

  // Schedule local notification (simplified)
  async scheduleNotification(
    notification: NotificationData,
    trigger?: any
  ): Promise<string | null> {
    try {
      if (!this.preferences.enabled) {
        log('Notifications disabled, skipping local notification');
        return null;
      }

      // Check quiet hours
      if (this.isQuietHours()) {
        log('Quiet hours active, skipping notification');
        return null;
      }

      log('Local notification would be scheduled:', notification.title);
      return 'mock-notification-id';
    } catch (error) {
      logError('Failed to schedule notification:', error);
      return null;
    }
  }

  // Cancel notification (simplified)
  async cancelNotification(identifier: string): Promise<void> {
    try {
      log('Notification cancelled (simplified):', identifier);
    } catch (error) {
      logError('Failed to cancel notification:', error);
    }
  }

  // Cancel all notifications (simplified)
  async cancelAllNotifications(): Promise<void> {
    try {
      log('All notifications cancelled (simplified)');
    } catch (error) {
      logError('Failed to cancel all notifications:', error);
    }
  }

  // Handle notification received (simplified)
  addNotificationReceivedListener(
    listener: (notification: any) => void
  ): any {
    log('Notification received listener added (simplified)');
    return { remove: () => log('Notification listener removed') };
  }

  // Handle notification response (simplified)
  addNotificationResponseReceivedListener(
    listener: (response: any) => void
  ): any {
    log('Notification response listener added (simplified)');
    return { remove: () => log('Notification response listener removed') };
  }

  // Get notification preferences
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Update notification preferences
  async updatePreferences(updates: Partial<NotificationPreferences>): Promise<void> {
    try {
      this.preferences = { ...this.preferences, ...updates };
      await this.savePreferences();
      log('Notification preferences updated');
    } catch (error) {
      logError('Failed to update notification preferences:', error);
    }
  }

  // Check if currently in quiet hours
  private isQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const { start, end } = this.preferences.quietHours;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    }
    
    // Handle same-day quiet hours (e.g., 12:00 to 14:00)
    return currentTime >= start && currentTime <= end;
  }

  // Load preferences from storage
  private async loadPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.PREFERENCES_KEY);
      if (stored) {
        this.preferences = { ...this.preferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      logError('Failed to load notification preferences:', error);
    }
  }

  // Save preferences to storage
  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(this.preferences));
    } catch (error) {
      logError('Failed to save notification preferences:', error);
    }
  }

  // Set badge count (simplified)
  async setBadgeCount(count: number): Promise<void> {
    try {
      log('Badge count set (simplified):', count);
    } catch (error) {
      logError('Failed to set badge count:', error);
    }
  }

  // Get badge count (simplified)
  async getBadgeCount(): Promise<number> {
    try {
      return 0;
    } catch (error) {
      logError('Failed to get badge count:', error);
      return 0;
    }
  }

  // Clear badge (simplified)
  async clearBadge(): Promise<void> {
    try {
      log('Badge cleared (simplified)');
    } catch (error) {
      logError('Failed to clear badge:', error);
    }
  }
}

// Create service instance
export const notificationService = new NotificationService();