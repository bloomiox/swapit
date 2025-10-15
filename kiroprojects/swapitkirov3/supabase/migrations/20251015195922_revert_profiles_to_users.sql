-- Revert profiles table back to users table with correct column names
-- This fixes the incorrect migration that renamed users to profiles

-- First, drop all foreign key constraints that reference the profiles table (only if tables exist)
DO $$ 
BEGIN
    -- Drop constraints only if tables exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'items') THEN
        ALTER TABLE items DROP CONSTRAINT IF EXISTS items_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
        ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews') THEN
        ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewee_id_fkey;
        ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'saved_items') THEN
        ALTER TABLE saved_items DROP CONSTRAINT IF EXISTS saved_items_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'swap_requests') THEN
        ALTER TABLE swap_requests DROP CONSTRAINT IF EXISTS swap_requests_owner_id_fkey;
        ALTER TABLE swap_requests DROP CONSTRAINT IF EXISTS swap_requests_requester_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
        ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_participant1_id_fkey;
        ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_participant2_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'swap_proposals') THEN
        ALTER TABLE swap_proposals DROP CONSTRAINT IF EXISTS swap_proposals_proposer_id_fkey;
        ALTER TABLE swap_proposals DROP CONSTRAINT IF EXISTS swap_proposals_target_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
        ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reports') THEN
        ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_reported_user_id_fkey;
        ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_reporter_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        ALTER TABLE user_sessions DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
        ALTER TABLE user_preferences DROP CONSTRAINT IF EXISTS user_preferences_user_id_fkey;
    END IF;
END $$;

-- Rename the profiles table back to users
ALTER TABLE profiles RENAME TO users;

-- Rename columns back to match the DATABASE_SCHEMA.md specification
ALTER TABLE users RENAME COLUMN display_name TO full_name;
ALTER TABLE users RENAME COLUMN location TO location_name;

-- Add back the columns that were removed but are needed according to DATABASE_SCHEMA.md
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_coordinates GEOGRAPHY;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_average NUMERIC DEFAULT 0.00;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS successful_swaps INTEGER DEFAULT 0;

-- Remove columns that don't belong in the users table according to DATABASE_SCHEMA.md
ALTER TABLE users DROP COLUMN IF EXISTS language_preference;
ALTER TABLE users DROP COLUMN IF EXISTS onboarding_completed;
ALTER TABLE users DROP COLUMN IF EXISTS onboarding_completed_at;

-- Update constraint names
ALTER TABLE users RENAME CONSTRAINT profiles_pkey TO users_pkey;
ALTER TABLE users RENAME CONSTRAINT profiles_email_key TO users_email_key;
ALTER TABLE users RENAME CONSTRAINT profiles_id_fkey TO users_id_fkey;

-- Recreate foreign key constraints with the correct table name (only if tables exist)
DO $$ 
BEGIN
    -- Add constraints only if tables exist
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'items') THEN
        ALTER TABLE items ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'messages') THEN
        ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reviews') THEN
        ALTER TABLE reviews ADD CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE;
        ALTER TABLE reviews ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'saved_items') THEN
        ALTER TABLE saved_items ADD CONSTRAINT saved_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'swap_requests') THEN
        ALTER TABLE swap_requests ADD CONSTRAINT swap_requests_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
        ALTER TABLE swap_requests ADD CONSTRAINT swap_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
        ALTER TABLE conversations ADD CONSTRAINT conversations_participant1_id_fkey FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE;
        ALTER TABLE conversations ADD CONSTRAINT conversations_participant2_id_fkey FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'swap_proposals') THEN
        ALTER TABLE swap_proposals ADD CONSTRAINT swap_proposals_proposer_id_fkey FOREIGN KEY (proposer_id) REFERENCES users(id) ON DELETE CASCADE;
        ALTER TABLE swap_proposals ADD CONSTRAINT swap_proposals_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
        ALTER TABLE favorites ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'reports') THEN
        ALTER TABLE reports ADD CONSTRAINT reports_reported_user_id_fkey FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE;
        ALTER TABLE reports ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
        ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
        ALTER TABLE user_preferences ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update indexes
DROP INDEX IF EXISTS idx_profiles_search;
CREATE INDEX idx_users_location ON users (location_name);
CREATE INDEX idx_users_rating ON users (rating_average);
CREATE INDEX idx_users_search ON users USING gin (to_tsvector('english', coalesce(full_name, '') || ' ' || coalesce(bio, '')));

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view public profiles" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create RLS policies for the users table
CREATE POLICY "Users can view public profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Update functions to use the correct table and column names
CREATE OR REPLACE FUNCTION get_user_rating(user_uuid uuid)
RETURNS TABLE(average_rating numeric, total_reviews integer)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(AVG(rating), 0)::numeric(3,2) as average_rating,
        COUNT(*)::integer as total_reviews
    FROM reviews 
    WHERE reviewee_id = user_uuid;
END;
$$;

-- Update the search function to use full_name instead of display_name
CREATE OR REPLACE FUNCTION search_items(
    search_query text,
    category_ids uuid[] DEFAULT NULL,
    condition_filter item_condition DEFAULT NULL,
    is_free_filter boolean DEFAULT NULL,
    user_lat double precision DEFAULT NULL,
    user_lng double precision DEFAULT NULL,
    max_distance_km integer DEFAULT 50,
    limit_count integer DEFAULT 20,
    offset_count integer DEFAULT 0
)
RETURNS TABLE(
    id uuid,
    title varchar,
    description text,
    condition item_condition,
    is_free boolean,
    images text[],
    location_name varchar,
    user_id uuid,
    user_name varchar,
    distance_km double precision,
    created_at timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        i.description,
        i.condition,
        i.is_free,
        i.images,
        i.location_name,
        i.user_id,
        u.full_name::varchar as user_name,
        CASE 
            WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND i.location_coordinates IS NOT NULL
            THEN ST_Distance(
                ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
                i.location_coordinates
            ) / 1000.0
            ELSE NULL
        END as distance_km,
        i.created_at
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.is_available = true
    AND (search_query IS NULL OR search_query = '' OR 
         to_tsvector('english', i.title || ' ' || i.description) @@ plainto_tsquery('english', search_query))
    AND (category_ids IS NULL OR i.category_id = ANY(category_ids))
    AND (condition_filter IS NULL OR i.condition = condition_filter)
    AND (is_free_filter IS NULL OR i.is_free = is_free_filter)
    AND (user_lat IS NULL OR user_lng IS NULL OR i.location_coordinates IS NULL OR
         ST_DWithin(
             ST_GeogFromText('POINT(' || user_lng || ' ' || user_lat || ')'),
             i.location_coordinates,
             max_distance_km * 1000
         ))
    ORDER BY 
        CASE WHEN search_query IS NOT NULL AND search_query != '' 
             THEN ts_rank(to_tsvector('english', i.title || ' ' || i.description), plainto_tsquery('english', search_query))
             ELSE 0 
        END DESC,
        i.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- Create a trigger function to automatically create user profiles when auth users are created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update table comment
COMMENT ON TABLE users IS 'User profiles table - reverted from profiles to users 2025-10-15';