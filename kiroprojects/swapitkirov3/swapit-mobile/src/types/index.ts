// Shared types from web application
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location_name: string | null;
  location_coordinates: any | null;
  phone: string | null;
  is_verified: boolean;
  is_active: boolean;
  rating_average: number;
  rating_count: number;
  successful_swaps: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  // Additional profile-specific fields if needed
}

export interface UserStats {
  total_items: number;
  active_items: number;
  total_swaps: number;
  completed_swaps: number;
  rating_average: number;
  rating_count: number;
  saved_items_count: number;
  reviews_count: number;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string;
  condition: 'like_new' | 'good' | 'fair' | 'poor';
  is_free: boolean;
  images: string[] | null;
  location_name: string | null;
  location_coordinates: any | null;
  is_available: boolean;
  is_boosted: boolean;
  boost_expires_at: string | null;
  view_count: number;
  save_count: number;
  looking_for: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  category?: {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
  };
  user?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    rating_average: number | null;
    rating_count: number;
  };
}

export interface ItemFilters {
  category_ids?: string[];
  condition?: 'like_new' | 'good' | 'fair' | 'poor';
  is_free?: boolean;
  search_query?: string;
  user_lat?: number;
  user_lng?: number;
  max_distance_km?: number;
}

export interface SwapRequest {
  id: string;
  requester_id: string;
  owner_id: string;
  requested_item_id: string;
  offered_item_id: string | null;
  message: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  is_claim_request: boolean;
  meetup_location: string | null;
  meetup_coordinates: any | null;
  meetup_time: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  // Joined data
  requester: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  owner: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  requested_item: {
    id: string;
    title: string;
    images: string[];
    is_free: boolean;
  };
  offered_item: {
    id: string;
    title: string;
    images: string[];
  } | null;
}

export interface CreateSwapRequestData {
  requested_item_id: string;
  offered_item_id?: string;
  message?: string;
  is_claim_request?: boolean;
}

// Mobile-specific types
export interface CachedItem extends Item {
  cached_at: string;
  is_offline_available: boolean;
}

export interface QueuedAction {
  id: string;
  type: 'create_item' | 'send_message' | 'swap_request';
  data: any;
  created_at: string;
  retry_count: number;
}

export interface AppSettings {
  notifications_enabled: boolean;
  location_enabled: boolean;
  biometric_enabled: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface NavigationState {
  current_tab: string;
  previous_screen: string;
  deep_link_data?: any;
}// Mobile-specific navigation types
export interface NavigationParams {
  item?: { id: string };
  user?: { id: string };
  chat?: { id: string };
  notification?: any;
}

// Export database types
export * from './database';