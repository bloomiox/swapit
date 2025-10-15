-- Fix reviews RLS policy to allow reviews for accepted swaps
-- The current policy only allows reviews for 'completed' swaps, but we want to allow reviews for 'accepted' swaps

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create reviews for completed swaps" ON reviews;

-- Create new policy that allows reviews for accepted swaps
CREATE POLICY "Users can create reviews for accepted swaps" ON reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id AND
        EXISTS (
            SELECT 1 FROM swap_requests sr 
            WHERE sr.id = swap_request_id 
            AND sr.status = 'accepted'
            AND (sr.requester_id = auth.uid() OR sr.owner_id = auth.uid())
        )
    );

-- Also allow users to update their own reviews (in case they want to edit)
DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

-- Allow users to delete their own reviews (optional, for moderation purposes)
DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- Add missing INSERT policy for notifications
-- The original RLS policies were missing an INSERT policy for notifications
CREATE POLICY "Users can create notifications" ON notifications
    FOR INSERT WITH CHECK (true); -- Allow any authenticated user to create notifications

-- Alternative more restrictive policy (commented out for now):
-- CREATE POLICY "Users can create notifications for others" ON notifications
--     FOR INSERT WITH CHECK (
--         auth.uid() IS NOT NULL AND 
--         (type IN ('review', 'swap_request', 'message') OR auth.uid() = user_id)
--     );