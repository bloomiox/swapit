import { supabase } from './supabase';
import type { 
  UserProfile, 
  UserStats, 
  Item, 
  ItemFilters, 
  Category, 
  SwapRequest, 
  CreateSwapRequestData 
} from '../types';
import { logError } from '../config/environment';

// Base API service with error handling and retry logic
class BaseApiService {
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        logError(`API operation failed (attempt ${attempt}/${maxRetries}):`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  }

  protected handleError(error: any, context: string) {
    logError(`${context} error:`, error);
    
    // Network errors
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return new Error('Network error. Please check your connection and try again.');
    }
    
    // Authentication errors
    if (error.message?.includes('JWT') || error.message?.includes('auth')) {
      return new Error('Authentication error. Please sign in again.');
    }
    
    // Permission errors
    if (error.message?.includes('permission') || error.message?.includes('RLS')) {
      return new Error('Permission denied. Please check your access rights.');
    }
    
    return error;
  }
}

// User API Service
export class UserApiService extends BaseApiService {
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { data: newProfile, error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email || 'User'
            })
            .select('*')
            .single();

          if (insertError) {
            throw this.handleError(insertError, 'Create user profile');
          }

          return newProfile;
        }
        throw this.handleError(error, 'Get user profile');
      }

      return data;
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.withRetry(async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw this.handleError(error, 'Get user profile');
      }

      return data;
    });
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select('*')
        .single();

      if (error) {
        throw this.handleError(error, 'Update user profile');
      }

      return data;
    });
  }

  async getUserStats(userId?: string): Promise<UserStats> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        throw new Error('User ID required');
      }

      // Fetch active items count
      const { count: activeItemsCount, error: itemsError } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId)
        .eq('is_available', true);

      if (itemsError) {
        throw this.handleError(itemsError, 'Get user items count');
      }

      // Fetch saved items count
      const { count: savedItemsCount, error: savedError } = await supabase
        .from('saved_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId);

      if (savedError) {
        throw this.handleError(savedError, 'Get saved items count');
      }

      return {
        total_items: activeItemsCount || 0,
        active_items: activeItemsCount || 0,
        total_swaps: 0,
        completed_swaps: 0,
        rating_average: 0,
        rating_count: 0,
        saved_items_count: savedItemsCount || 0,
        reviews_count: 0
      };
    });
  }

  async uploadAvatar(file: File): Promise<string> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw this.handleError(uploadError, 'Upload avatar');
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await this.updateUserProfile({ avatar_url: data.publicUrl });

      return data.publicUrl;
    });
  }
}

// Items API Service
export class ItemsApiService extends BaseApiService {
  async getItems(filters?: ItemFilters): Promise<Item[]> {
    return this.withRetry(async () => {
      let query = supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category_ids && filters.category_ids.length > 0) {
        query = query.in('category_id', filters.category_ids);
      }

      if (filters?.condition) {
        query = query.eq('condition', filters.condition);
      }

      if (filters?.is_free !== undefined) {
        query = query.eq('is_free', filters.is_free);
      }

      if (filters?.search_query) {
        query = query.textSearch('title,description', filters.search_query);
      }

      const { data, error } = await query;

      if (error) {
        throw this.handleError(error, 'Get items');
      }

      return data || [];
    });
  }

  async getItem(itemId: string): Promise<Item | null> {
    return this.withRetry(async () => {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .eq('id', itemId)
        .eq('is_available', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.handleError(error, 'Get item');
      }

      return data;
    });
  }

  async getUserItems(userId?: string): Promise<Item[]> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        throw new Error('User ID required');
      }

      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(id, name, description, icon)
        `)
        .eq('user_id', targetUserId)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw this.handleError(error, 'Get user items');
      }

      return data || [];
    });
  }

  async getSavedItems(): Promise<Item[]> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('saved_items')
        .select(`
          item:items(
            *,
            category:categories(id, name, description, icon),
            user:users(id, full_name, avatar_url, rating_average, rating_count)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw this.handleError(error, 'Get saved items');
      }

      return data?.map((saved: any) => saved.item).filter(Boolean) || [];
    });
  }

  async createItem(itemData: {
    title: string;
    description: string | null;
    category_id: string;
    condition: 'like_new' | 'good' | 'fair' | 'poor';
    is_free: boolean;
    images?: string[] | null;
    location_name: string;
    location_coordinates?: { latitude: number; longitude: number };
  }): Promise<Item> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const insertData: any = {
        title: itemData.title,
        description: itemData.description,
        category_id: itemData.category_id,
        condition: itemData.condition,
        is_free: itemData.is_free,
        images: itemData.images || [],
        location_name: itemData.location_name,
        user_id: user.id
      };

      // Handle location coordinates safely
      if (itemData.location_coordinates && 
          typeof itemData.location_coordinates.latitude === 'number' && 
          typeof itemData.location_coordinates.longitude === 'number') {
        insertData.location_coordinates = {
          latitude: itemData.location_coordinates.latitude,
          longitude: itemData.location_coordinates.longitude
        };
      }

      const { data, error } = await supabase
        .from('items')
        .insert(insertData)
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .single();

      if (error) {
        throw this.handleError(error, 'Create item');
      }

      return data;
    });
  }

  async updateItem(itemId: string, updates: Partial<Item>): Promise<Item> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', itemId)
        .eq('user_id', user.id)
        .select(`
          *,
          category:categories(id, name, description, icon),
          user:users(id, full_name, avatar_url, rating_average, rating_count)
        `)
        .single();

      if (error) {
        throw this.handleError(error, 'Update item');
      }

      return data;
    });
  }

  async deleteItem(itemId: string): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) {
        throw this.handleError(error, 'Delete item');
      }
    });
  }

  async saveItem(itemId: string): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('saved_items')
        .insert({ user_id: user.id, item_id: itemId });

      if (error) {
        throw this.handleError(error, 'Save item');
      }
    });
  }

  async unsaveItem(itemId: string): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', itemId);

      if (error) {
        throw this.handleError(error, 'Unsave item');
      }
    });
  }

  async checkIfSaved(itemId: string): Promise<boolean> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !itemId) {
        return false;
      }

      const { data, error } = await supabase
        .from('saved_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .maybeSingle();

      if (error) {
        logError('Error checking if item is saved:', error);
        return false;
      }

      return !!data;
    });
  }
}

// Categories API Service
export class CategoriesApiService extends BaseApiService {
  async getCategories(): Promise<Category[]> {
    return this.withRetry(async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw this.handleError(error, 'Get categories');
      }

      return data || [];
    });
  }

  async getCategory(categoryId: string): Promise<Category | null> {
    return this.withRetry(async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw this.handleError(error, 'Get category');
      }

      return data;
    });
  }
}

// Swap Requests API Service
export class SwapRequestsApiService extends BaseApiService {
  async getReceivedRequests(): Promise<SwapRequest[]> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          owner:users!swap_requests_owner_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          requested_item:items!swap_requests_requested_item_id_fkey(
            id,
            title,
            images,
            is_free
          ),
          offered_item:items!swap_requests_offered_item_id_fkey(
            id,
            title,
            images
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw this.handleError(error, 'Get received requests');
      }

      return data || [];
    });
  }

  async getSentRequests(): Promise<SwapRequest[]> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          owner:users!swap_requests_owner_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          requested_item:items!swap_requests_requested_item_id_fkey(
            id,
            title,
            images,
            is_free
          ),
          offered_item:items!swap_requests_offered_item_id_fkey(
            id,
            title,
            images
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw this.handleError(error, 'Get sent requests');
      }

      return data || [];
    });
  }

  async getDropzoneRequests(): Promise<SwapRequest[]> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          owner:users!swap_requests_owner_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          requested_item:items!swap_requests_requested_item_id_fkey(
            id,
            title,
            images,
            is_free
          )
        `)
        .eq('requester_id', user.id)
        .eq('is_claim_request', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw this.handleError(error, 'Get dropzone requests');
      }

      return data || [];
    });
  }

  async createSwapRequest(data: CreateSwapRequestData): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get the owner of the requested item
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .select('user_id, is_free')
        .eq('id', data.requested_item_id)
        .single();

      if (itemError) {
        throw this.handleError(itemError, 'Get item data');
      }

      if (!itemData) {
        throw new Error('Item not found');
      }

      const isClaimRequest = data.is_claim_request || itemData.is_free;

      const { error } = await supabase
        .from('swap_requests')
        .insert({
          requester_id: user.id,
          owner_id: itemData.user_id,
          requested_item_id: data.requested_item_id,
          offered_item_id: data.offered_item_id || null,
          message: data.message || null,
          is_claim_request: isClaimRequest
        });

      if (error) {
        throw this.handleError(error, 'Create swap request');
      }
    });
  }

  async acceptSwapRequest(requestId: string): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('swap_requests')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('owner_id', user.id);

      if (error) {
        throw this.handleError(error, 'Accept swap request');
      }
    });
  }

  async rejectSwapRequest(requestId: string): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('swap_requests')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('owner_id', user.id);

      if (error) {
        throw this.handleError(error, 'Reject swap request');
      }
    });
  }

  async cancelSwapRequest(requestId: string): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('swap_requests')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('requester_id', user.id);

      if (error) {
        throw this.handleError(error, 'Cancel swap request');
      }
    });
  }

  async completeSwapRequest(requestId: string): Promise<void> {
    return this.withRetry(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('swap_requests')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        throw this.handleError(error, 'Complete swap request');
      }
    });
  }
}

// Create service instances
export const userApi = new UserApiService();
export const itemsApi = new ItemsApiService();
export const categoriesApi = new CategoriesApiService();
export const swapRequestsApi = new SwapRequestsApiService();