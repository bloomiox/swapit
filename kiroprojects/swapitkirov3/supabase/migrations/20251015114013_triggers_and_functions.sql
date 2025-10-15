-- Database Triggers and Functions for SwapIt
-- This migration creates automated triggers for business logic

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to create notification for new swap request
CREATE OR REPLACE FUNCTION create_swap_request_notification()
RETURNS TRIGGER AS $$
DECLARE
    item_title VARCHAR(255);
    requester_name VARCHAR(255);
BEGIN
    -- Get item title and requester name
    SELECT i.title, u.full_name 
    INTO item_title, requester_name
    FROM items i, users u
    WHERE i.id = NEW.requested_item_id 
    AND u.id = NEW.requester_id;

    -- Create notification for item owner
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data
    ) VALUES (
        NEW.owner_id,
        CASE 
            WHEN NEW.is_claim_request THEN 'claim_request'::notification_type
            ELSE 'swap_request'::notification_type
        END,
        CASE 
            WHEN NEW.is_claim_request THEN 'New Claim Request'
            ELSE 'New Swap Request'
        END,
        CASE 
            WHEN NEW.is_claim_request THEN 
                requester_name || ' wants to claim your item "' || item_title || '"'
            ELSE 
                requester_name || ' wants to swap for your item "' || item_title || '"'
        END,
        jsonb_build_object(
            'swap_request_id', NEW.id,
            'item_id', NEW.requested_item_id,
            'requester_id', NEW.requester_id
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for swap request notifications
CREATE TRIGGER on_swap_request_created
    AFTER INSERT ON swap_requests
    FOR EACH ROW EXECUTE FUNCTION create_swap_request_notification();

-- Function to create notification for new message
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
DECLARE
    recipient_id UUID;
    sender_name VARCHAR(255);
BEGIN
    -- Skip system messages
    IF NEW.message_type = 'system' THEN
        RETURN NEW;
    END IF;

    -- Get recipient (the other person in the swap request)
    SELECT 
        CASE 
            WHEN sr.requester_id = NEW.sender_id THEN sr.owner_id
            ELSE sr.requester_id
        END,
        u.full_name
    INTO recipient_id, sender_name
    FROM swap_requests sr, users u
    WHERE sr.id = NEW.swap_request_id 
    AND u.id = NEW.sender_id;

    -- Create notification for recipient
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        data
    ) VALUES (
        recipient_id,
        'message'::notification_type,
        'New Message',
        sender_name || ' sent you a message',
        jsonb_build_object(
            'message_id', NEW.id,
            'swap_request_id', NEW.swap_request_id,
            'sender_id', NEW.sender_id
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for message notifications
CREATE TRIGGER on_message_created
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION create_message_notification();

-- Function to update user rating when review is created
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
DECLARE
    new_average DECIMAL(3,2);
    review_count INTEGER;
BEGIN
    -- Calculate new average rating and count
    SELECT 
        AVG(rating)::DECIMAL(3,2),
        COUNT(*)::INTEGER
    INTO new_average, review_count
    FROM reviews 
    WHERE reviewee_id = NEW.reviewee_id;

    -- Update user's rating
    UPDATE users 
    SET 
        rating_average = new_average,
        rating_count = review_count,
        updated_at = NOW()
    WHERE id = NEW.reviewee_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user rating updates
CREATE TRIGGER on_review_created
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Function to increment item view count
CREATE OR REPLACE FUNCTION increment_item_view()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE items 
    SET view_count = view_count + 1
    WHERE id = NEW.item_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update save count when item is saved/unsaved
CREATE OR REPLACE FUNCTION update_item_save_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE items 
        SET save_count = save_count + 1
        WHERE id = NEW.item_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE items 
        SET save_count = save_count - 1
        WHERE id = OLD.item_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for save count updates
CREATE TRIGGER on_item_saved
    AFTER INSERT ON saved_items
    FOR EACH ROW EXECUTE FUNCTION update_item_save_count();

CREATE TRIGGER on_item_unsaved
    AFTER DELETE ON saved_items
    FOR EACH ROW EXECUTE FUNCTION update_item_save_count();

-- Function to update successful swaps count
CREATE OR REPLACE FUNCTION update_successful_swaps()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger when status changes to completed
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
        -- Update both users' successful swap counts
        UPDATE users 
        SET 
            successful_swaps = successful_swaps + 1,
            updated_at = NOW()
        WHERE id IN (NEW.requester_id, NEW.owner_id);
        
        -- Set completion timestamp
        NEW.completed_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for successful swaps count
CREATE TRIGGER on_swap_completed
    BEFORE UPDATE ON swap_requests
    FOR EACH ROW EXECUTE FUNCTION update_successful_swaps();

-- Function to handle boost expiration
CREATE OR REPLACE FUNCTION handle_boost_expiration()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if boost has expired
    IF NEW.expires_at <= NOW() AND OLD.is_active = true THEN
        -- Deactivate boost
        NEW.is_active = false;
        
        -- Update item boost status
        UPDATE items 
        SET 
            is_boosted = false,
            boost_expires_at = NULL
        WHERE id = NEW.item_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to activate boost when created
CREATE OR REPLACE FUNCTION activate_boost()
RETURNS TRIGGER AS $$
BEGIN
    -- Update item to show it's boosted
    UPDATE items 
    SET 
        is_boosted = true,
        boost_expires_at = NEW.expires_at
    WHERE id = NEW.item_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for boost management
CREATE TRIGGER on_boost_created
    AFTER INSERT ON boosts
    FOR EACH ROW EXECUTE FUNCTION activate_boost();

CREATE TRIGGER on_boost_updated
    BEFORE UPDATE ON boosts
    FOR EACH ROW EXECUTE FUNCTION handle_boost_expiration();

-- Function to clean up expired notifications (run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete notifications older than 30 days
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search items with full-text search
CREATE OR REPLACE FUNCTION search_items(
    search_query TEXT,
    category_ids UUID[] DEFAULT NULL,
    condition_filter item_condition DEFAULT NULL,
    is_free_filter BOOLEAN DEFAULT NULL,
    user_lat DOUBLE PRECISION DEFAULT NULL,
    user_lng DOUBLE PRECISION DEFAULT NULL,
    max_distance_km INTEGER DEFAULT 50,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title VARCHAR,
    description TEXT,
    condition item_condition,
    is_free BOOLEAN,
    images TEXT[],
    location_name VARCHAR,
    user_id UUID,
    user_name VARCHAR,
    distance_km DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
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
        u.full_name as user_name,
        CASE 
            WHEN user_lat IS NOT NULL AND user_lng IS NOT NULL AND i.location_coordinates IS NOT NULL THEN
                ST_Distance(
                    i.location_coordinates::geometry,
                    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)
                ) / 1000
            ELSE NULL
        END as distance_km,
        i.created_at
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.is_available = true
    AND u.is_active = true
    AND (
        search_query IS NULL OR 
        to_tsvector('english', i.title || ' ' || i.description) @@ plainto_tsquery('english', search_query)
    )
    AND (category_ids IS NULL OR i.category_id = ANY(category_ids))
    AND (condition_filter IS NULL OR i.condition = condition_filter)
    AND (is_free_filter IS NULL OR i.is_free = is_free_filter)
    AND (
        user_lat IS NULL OR user_lng IS NULL OR i.location_coordinates IS NULL OR
        ST_DWithin(
            i.location_coordinates::geometry,
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326),
            max_distance_km * 1000
        )
    )
    ORDER BY 
        CASE WHEN i.is_boosted THEN 0 ELSE 1 END,
        distance_km NULLS LAST,
        i.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;