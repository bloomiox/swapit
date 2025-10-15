import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (updated to match actual schema)
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
          description: string | null
          condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor'
          estimated_value: number | null
          looking_for: string | null
          location: string | null
          images: string[] | null
          type: 'swap' | 'drop'
          status: 'available' | 'pending' | 'swapped' | 'dropped' | 'claimed'
          is_boosted: boolean
          boost_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id: string
          title: string
          description?: string | null
          condition: 'new' | 'likeNew' | 'good' | 'fair' | 'poor'
          estimated_value?: number | null
          looking_for?: string | null
          location?: string | null
          images?: string[] | null
          type: 'swap' | 'drop'
          status?: 'available' | 'pending' | 'swapped' | 'dropped' | 'claimed'
          is_boosted?: boolean
          boost_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string
          title?: string
          description?: string | null
          condition?: 'new' | 'likeNew' | 'good' | 'fair' | 'poor'
          estimated_value?: number | null
          looking_for?: string | null
          location?: string | null
          images?: string[] | null
          type?: 'swap' | 'drop'
          status?: 'available' | 'pending' | 'swapped' | 'dropped' | 'claimed'
          is_boosted?: boolean
          boost_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: Record<string, string>
          created_at: string
        }
        Insert: {
          id?: string
          name: Record<string, string>
          created_at?: string
        }
        Update: {
          id?: string
          name?: Record<string, string>
          created_at?: string
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
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
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