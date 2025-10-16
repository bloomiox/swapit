import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import type { QueuedAction } from '../types';
import { logError, log } from '../config/environment';
import { itemsApi, swapRequestsApi } from './api';

export interface OfflineQueueItem {
  id: string;
  action: QueuedAction;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items to cache
}

// Offline service for handling cached data and action queuing
export class OfflineService {
  private readonly QUEUE_KEY = '@swapit_offline_queue';
  private readonly CACHE_KEY_PREFIX = '@swapit_cache_';
  private readonly CONNECTION_KEY = '@swapit_connection_status';
  
  private isOnline: boolean = true;
  private queue: OfflineQueueItem[] = [];
  private connectionListeners: ((isOnline: boolean) => void)[] = [];

  constructor() {
    this.initializeNetworkListener();
    this.loadQueue();
  }

  // Initialize network status monitoring
  private async initializeNetworkListener() {
    try {
      // Get initial connection state
      const netInfoState = await NetInfo.fetch();
      this.isOnline = netInfoState.isConnected ?? false;
      
      // Listen for connection changes
      NetInfo.addEventListener(state => {
        const wasOnline = this.isOnline;
        this.isOnline = state.isConnected ?? false;
        
        log('Network status changed:', { wasOnline, isOnline: this.isOnline });
        
        // Notify listeners
        this.connectionListeners.forEach(listener => listener(this.isOnline));
        
        // Process queue when coming back online
        if (!wasOnline && this.isOnline) {
          this.processQueue();
        }
        
        // Store connection status
        this.storeConnectionStatus();
      });
    } catch (error) {
      logError('Failed to initialize network listener:', error);
    }
  }

  // Get current connection status
  getConnectionStatus(): boolean {
    return this.isOnline;
  }

  // Add connection status listener
  addConnectionListener(listener: (isOnline: boolean) => void): () => void {
    this.connectionListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.connectionListeners.indexOf(listener);
      if (index > -1) {
        this.connectionListeners.splice(index, 1);
      }
    };
  }

  // Queue action for offline execution
  async queueAction(action: QueuedAction, maxRetries: number = 3): Promise<void> {
    try {
      const queueItem: OfflineQueueItem = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        action,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries
      };

      this.queue.push(queueItem);
      await this.saveQueue();
      
      log('Action queued for offline execution:', action.type);
      
      // Try to process immediately if online
      if (this.isOnline) {
        this.processQueue();
      }
    } catch (error) {
      logError('Failed to queue action:', error);
      throw error;
    }
  }

  // Process queued actions
  async processQueue(): Promise<void> {
    if (!this.isOnline || this.queue.length === 0) {
      return;
    }

    log('Processing offline queue:', this.queue.length, 'items');

    const itemsToProcess = [...this.queue];
    
    for (const item of itemsToProcess) {
      try {
        await this.executeQueuedAction(item);
        
        // Remove successful item from queue
        this.queue = this.queue.filter(q => q.id !== item.id);
      } catch (error) {
        logError('Failed to execute queued action:', error);
        
        // Increment retry count
        const queueItem = this.queue.find(q => q.id === item.id);
        if (queueItem) {
          queueItem.retryCount++;
          
          // Remove if max retries exceeded
          if (queueItem.retryCount >= queueItem.maxRetries) {
            log('Max retries exceeded for queued action:', queueItem.action.type);
            this.queue = this.queue.filter(q => q.id !== item.id);
          }
        }
      }
    }

    await this.saveQueue();
  }

  // Execute a queued action
  private async executeQueuedAction(item: OfflineQueueItem): Promise<void> {
    const { action } = item;
    
    switch (action.type) {
      case 'create_item':
        await itemsApi.createItem(action.data);
        break;
        
      case 'send_message':
        // TODO: Implement message sending when chat service is available
        throw new Error('Message sending not implemented yet');
        
      case 'swap_request':
        await swapRequestsApi.createSwapRequest(action.data);
        break;
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  // Cache data with TTL
  async cacheData<T>(key: string, data: T, options?: CacheOptions): Promise<void> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${key}`;
      const ttl = options?.ttl || 24 * 60 * 60 * 1000; // Default 24 hours
      
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheItem));
      log('Data cached:', key);
    } catch (error) {
      logError('Failed to cache data:', error);
    }
  }

  // Get cached data
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const cacheItem = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is expired
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      logError('Failed to get cached data:', error);
      return null;
    }
  }

  // Clear cached data
  async clearCache(key?: string): Promise<void> {
    try {
      if (key) {
        const cacheKey = `${this.CACHE_KEY_PREFIX}${key}`;
        await AsyncStorage.removeItem(cacheKey);
      } else {
        // Clear all cache
        const keys = await AsyncStorage.getAllKeys();
        const cacheKeys = keys.filter(k => k.startsWith(this.CACHE_KEY_PREFIX));
        await AsyncStorage.multiRemove(cacheKeys);
      }
      
      log('Cache cleared:', key || 'all');
    } catch (error) {
      logError('Failed to clear cache:', error);
    }
  }

  // Get cache size and statistics
  async getCacheStats(): Promise<{
    totalItems: number;
    totalSize: number;
    oldestItem: number | null;
    newestItem: number | null;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith(this.CACHE_KEY_PREFIX));
      
      let totalSize = 0;
      let oldestItem: number | null = null;
      let newestItem: number | null = null;

      for (const key of cacheKeys) {
        const cached = await AsyncStorage.getItem(key);
        if (cached) {
          totalSize += cached.length;
          
          const cacheItem = JSON.parse(cached);
          const timestamp = cacheItem.timestamp;
          
          if (oldestItem === null || timestamp < oldestItem) {
            oldestItem = timestamp;
          }
          if (newestItem === null || timestamp > newestItem) {
            newestItem = timestamp;
          }
        }
      }

      return {
        totalItems: cacheKeys.length,
        totalSize,
        oldestItem,
        newestItem
      };
    } catch (error) {
      logError('Failed to get cache stats:', error);
      return {
        totalItems: 0,
        totalSize: 0,
        oldestItem: null,
        newestItem: null
      };
    }
  }

  // Load queue from storage
  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
        log('Offline queue loaded:', this.queue.length, 'items');
      }
    } catch (error) {
      logError('Failed to load offline queue:', error);
      this.queue = [];
    }
  }

  // Save queue to storage
  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      logError('Failed to save offline queue:', error);
    }
  }

  // Store connection status
  private async storeConnectionStatus(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CONNECTION_KEY, JSON.stringify({
        isOnline: this.isOnline,
        lastUpdate: Date.now()
      }));
    } catch (error) {
      logError('Failed to store connection status:', error);
    }
  }

  // Get queue status
  getQueueStatus(): {
    totalItems: number;
    pendingItems: number;
    failedItems: number;
  } {
    const totalItems = this.queue.length;
    const failedItems = this.queue.filter(item => item.retryCount >= item.maxRetries).length;
    const pendingItems = totalItems - failedItems;

    return {
      totalItems,
      pendingItems,
      failedItems
    };
  }

  // Clear failed items from queue
  async clearFailedItems(): Promise<void> {
    try {
      this.queue = this.queue.filter(item => item.retryCount < item.maxRetries);
      await this.saveQueue();
      log('Failed items cleared from queue');
    } catch (error) {
      logError('Failed to clear failed items:', error);
    }
  }

  // Retry failed items
  async retryFailedItems(): Promise<void> {
    try {
      // Reset retry count for failed items
      this.queue.forEach(item => {
        if (item.retryCount >= item.maxRetries) {
          item.retryCount = 0;
        }
      });
      
      await this.saveQueue();
      
      // Process queue if online
      if (this.isOnline) {
        this.processQueue();
      }
      
      log('Failed items reset for retry');
    } catch (error) {
      logError('Failed to retry failed items:', error);
    }
  }
}

// Create service instance
export const offlineService = new OfflineService();