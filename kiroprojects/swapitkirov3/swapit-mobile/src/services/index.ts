// API and external services
export * from './supabase';
export * from './api';
export * from './storage';
export * from './notifications';
export * from './location';
export * from './camera';
export * from './offline';

// Service instances for easy import
export { userApi, itemsApi, categoriesApi, swapRequestsApi } from './api';
export { storageService } from './storage';
export { notificationService } from './notifications';
export { locationService } from './location';
export { cameraService } from './camera';
export { offlineService } from './offline';