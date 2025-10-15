-- Row Level Security (RLS) Policies for SwapIt
-- This migration sets up comprehensive security policies for all tables

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, admin write)
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

-- Users policies
CREATE POLICY "Users can view public profiles" ON users
    FOR SELECT USING (is_active = true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Items policies
CREATE POLICY "Items are viewable by everyone" ON items
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own items" ON items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON items
    FOR DELETE USING (auth.uid() = user_id);

-- Saved items policies
CREATE POLICY "Users can view own saved items" ON saved_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save items" ON saved_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave items" ON saved_items
    FOR DELETE USING (auth.uid() = user_id);

-- Swap requests policies
CREATE POLICY "Users can view swap requests they're involved in" ON swap_requests
    FOR SELECT USING (
        auth.uid() = requester_id OR 
        auth.uid() = owner_id
    );

CREATE POLICY "Users can create swap requests" ON swap_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update swap requests they're involved in" ON swap_requests
    FOR UPDATE USING (
        auth.uid() = requester_id OR 
        auth.uid() = owner_id
    );

-- Messages policies
CREATE POLICY "Users can view messages in their swap requests" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM swap_requests sr 
            WHERE sr.id = swap_request_id 
            AND (sr.requester_id = auth.uid() OR sr.owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their swap requests" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM swap_requests sr 
            WHERE sr.id = swap_request_id 
            AND (sr.requester_id = auth.uid() OR sr.owner_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages" ON messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for completed swaps" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM swap_requests sr 
            WHERE sr.id = swap_request_id 
            AND sr.status = 'completed'
            AND (sr.requester_id = auth.uid() OR sr.owner_id = auth.uid())
        )
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Boosts policies
CREATE POLICY "Boosts are viewable by item owners" ON boosts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM items i 
            WHERE i.id = item_id 
            AND i.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create boosts for own items" ON boosts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM items i 
            WHERE i.id = item_id 
            AND i.user_id = auth.uid()
        )
    );

-- User blocks policies
CREATE POLICY "Users can view own blocks" ON user_blocks
    FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks" ON user_blocks
    FOR INSERT WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can remove own blocks" ON user_blocks
    FOR DELETE USING (auth.uid() = blocker_id);

-- User reports policies
CREATE POLICY "Users can view own reports" ON user_reports
    FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports" ON user_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Create helper functions for common queries
CREATE OR REPLACE FUNCTION get_user_rating(user_uuid UUID)
RETURNS TABLE(average_rating DECIMAL, total_reviews INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(AVG(rating), 0)::DECIMAL(3,2) as average_rating,
        COUNT(*)::INTEGER as total_reviews
    FROM reviews 
    WHERE reviewee_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_items_near_location(
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 50
)
RETURNS TABLE(
    id UUID,
    title VARCHAR,
    distance_km DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.title,
        ST_Distance(
            i.location_coordinates::geometry,
            ST_SetSRID(ST_MakePoint(lng, lat), 4326)
        ) / 1000 as distance_km
    FROM items i
    WHERE i.is_available = true
    AND ST_DWithin(
        i.location_coordinates::geometry,
        ST_SetSRID(ST_MakePoint(lng, lat), 4326),
        radius_km * 1000
    )
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;