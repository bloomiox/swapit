-- Add DELETE policy for notifications table
-- This allows users to delete their own notifications

-- First, check if the policy exists and drop it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'notifications' 
        AND policyname = 'Users can delete own notifications'
    ) THEN
        DROP POLICY "Users can delete own notifications" ON "public"."notifications";
    END IF;
END $$;

-- Create the policy
CREATE POLICY "Users can delete own notifications" 
ON "public"."notifications" 
FOR DELETE 
USING (("auth"."uid"() = "user_id"));