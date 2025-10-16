// Database types (shared with web application)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          location_name: string | null
          location_coordinates: any | null
          phone: string | null
          is_verified: boolean
          is_active: boolean
          rating_average: number
          rating_count: number
          successful_swaps: number
          role: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location_name?: string | null
          location_coordinates?: any | null
          phone?: string | null
          is_verified?: boolean
          is_active?: boolean
          rating_average?: number
          rating_count?: number
          successful_swaps?: number
          role?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          location_name?: string | null
          location_coordinates?: any | null
          phone?: string | null
          is_verified?: boolean
          is_active?: boolean
          rating_average?: number
          rating_count?: number
          successful_swaps?: number
          role?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          user_id: string
          category_id: string
          title: string
          description: string
          condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor'
          is_free: boolean
          images: string[] | null
          location_name: string | null
          location_coordinates: any | null
          is_available: boolean
          is_boosted: boolean
          boost_expires_at: string | null
          view_count: number
          save_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          title: string
          description: string
          condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor'
          is_free?: boolean
          images?: string[] | null
          location_name?: string | null
          location_coordinates?: any | null
          is_available?: boolean
          is_boosted?: boolean
          boost_expires_at?: string | null
          view_count?: number
          save_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          title?: string
          description?: string
          condition?: 'new' | 'likeNew' | 'good' | 'fair' | 'poor'
          is_free?: boolean
          images?: string[] | null
          location_name?: string | null
          location_coordinates?: any | null
          is_available?: boolean
          is_boosted?: boolean
          boost_expires_at?: string | null
          view_count?: number
          save_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          parent_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          last_message_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          last_message_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          last_message_at?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'swap_proposal' | 'system'
          swap_proposal_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          message_type?: 'text' | 'swap_proposal' | 'system'
          swap_proposal_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          message_type?: 'text' | 'swap_proposal' | 'system'
          swap_proposal_id?: string | null
          created_at?: string
        }
      }
      saved_items: {
        Row: {
          id: string
          user_id: string
          item_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          created_at?: string
        }
      }
      swap_requests: {
        Row: {
          id: string
          requester_id: string
          owner_id: string
          requested_item_id: string
          offered_item_id: string | null
          message: string | null
          status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed'
          is_claim_request: boolean
          meetup_location: string | null
          meetup_coordinates: any | null
          meetup_time: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          requester_id: string
          owner_id: string
          requested_item_id: string
          offered_item_id?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed'
          is_claim_request?: boolean
          meetup_location?: string | null
          meetup_coordinates?: any | null
          meetup_time?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          requester_id?: string
          owner_id?: string
          requested_item_id?: string
          offered_item_id?: string | null
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed'
          is_claim_request?: boolean
          meetup_location?: string | null
          meetup_coordinates?: any | null
          meetup_time?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          categories_of_interest: string[] | null
          notification_preferences: any | null
          location_preferences: any | null
          privacy_settings: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          categories_of_interest?: string[] | null
          notification_preferences?: any | null
          location_preferences?: any | null
          privacy_settings?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          categories_of_interest?: string[] | null
          notification_preferences?: any | null
          location_preferences?: any | null
          privacy_settings?: any | null
          created_at?: string
          updated_at?: string
        }
      }   
   reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string | null
          reported_item_id: string | null
          report_type: 'user' | 'item' | 'message'
          category: string
          description: string | null
          status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id?: string | null
          reported_item_id?: string | null
          report_type: 'user' | 'item' | 'message'
          category: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string | null
          reported_item_id?: string | null
          report_type?: 'user' | 'item' | 'message'
          category?: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          item_id: string | null
          amount: number
          payment_type: 'boost' | 'premium'
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_id?: string | null
          amount: number
          payment_type: 'boost' | 'premium'
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string | null
          amount?: number
          payment_type?: 'boost' | 'premium'
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      item_condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor'
      item_type: 'swap' | 'drop'
      item_status: 'available' | 'pending' | 'swapped' | 'dropped' | 'claimed'
      message_type: 'text' | 'swap_proposal' | 'system'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Mobile-specific type extensions
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface NotificationPreferences {
  push_enabled: boolean;
  email_enabled: boolean;
  swap_requests: boolean;
  messages: boolean;
  nearby_items: boolean;
  marketing: boolean;
}

export interface LocationPreferences {
  auto_detect: boolean;
  search_radius: number; // in kilometers
  preferred_locations: string[];
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'private';
  location_sharing: boolean;
  activity_status: boolean;
  contact_info_visible: boolean;
}