-- Rename users table to profiles and update column names to match application expectations

-- First, drop all foreign key constraints that reference the users table
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_user_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewee_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;
ALTER TABLE saved_items DROP CONSTRAINT IF EXISTS saved_items_user_id_fkey;
ALTER TABLE swap_requests DROP CONSTRAINT IF EXISTS swap_requests_owner_id_fkey;
ALTER TABLE swap_requests DROP CONSTRAINT IF EXISTS swap_requests_requester_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE user_blocks DROP CONSTRAINT IF EXISTS user_blocks_blocked_id_fkey;
ALTER TABLE user_blocks DROP CONSTRAINT IF EXISTS user_blocks_blocker_id_fkey;
ALTER TABLE user_reports DROP CONSTRAINT IF EXISTS user_reports_reported_id_fkey;
ALTER TABLE user_reports DROP CONSTRAINT IF EXISTS user_reports_reporter_id_fkey;

-- Rename the users table to profiles
ALTER TABLE users RENAME TO profiles;

-- Rename columns to match application expectations
ALTER TABLE profiles RENAME COLUMN full_name TO display_name;
ALTER TABLE profiles RENAME COLUMN location_name TO location;

-- Drop existing policies that depend on columns we're about to drop
DROP POLICY IF EXISTS "Users can view public profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Drop columns that don't exist in the application's profile interface
ALTER TABLE profiles DROP COLUMN IF EXISTS location_coordinates;
ALTER TABLE profiles DROP COLUMN IF EXISTS phone;
ALTER TABLE profiles DROP COLUMN IF EXISTS is_verified;
ALTER TABLE profiles DROP COLUMN IF EXISTS is_active;
ALTER TABLE profiles DROP COLUMN IF EXISTS rating_average;
ALTER TABLE profiles DROP COLUMN IF EXISTS rating_count;
ALTER TABLE profiles DROP COLUMN IF EXISTS successful_swaps;

-- Add columns that the application expects
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'de', 'it', 'fr'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Update the primary key constraint name
ALTER TABLE profiles RENAME CONSTRAINT users_pkey TO profiles_pkey;
ALTER TABLE profiles RENAME CONSTRAINT users_email_key TO profiles_email_key;
ALTER TABLE profiles RENAME CONSTRAINT users_id_fkey TO profiles_id_fkey;

-- Recreate foreign key constraints with the new table name
ALTER TABLE items ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_reviewee_id_fkey FOREIGN KEY (reviewee_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE saved_items ADD CONSTRAINT saved_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE swap_requests ADD CONSTRAINT swap_requests_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE swap_requests ADD CONSTRAINT swap_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_blocks ADD CONSTRAINT user_blocks_blocked_id_fkey FOREIGN KEY (blocked_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_blocks ADD CONSTRAINT user_blocks_blocker_id_fkey FOREIGN KEY (blocker_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_reports ADD CONSTRAINT user_reports_reported_id_fkey FOREIGN KEY (reported_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE user_reports ADD CONSTRAINT user_reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update indexes
DROP INDEX IF EXISTS idx_users_location;
DROP INDEX IF EXISTS idx_users_rating;
DROP INDEX IF EXISTS idx_users_search;

-- Create new indexes for profiles table
CREATE INDEX idx_profiles_search ON profiles USING gin (to_tsvector('english', coalesce(display_name, '') || ' ' || coalesce(bio, '')));

-- Create RLS policies for the profiles table
CREATE POLICY "Users can view public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Update functions that reference the old table name
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

-- Update the search function to use display_name instead of full_name
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
        p.display_name::varchar as user_name,
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
    JOIN profiles p ON i.user_id = p.id
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