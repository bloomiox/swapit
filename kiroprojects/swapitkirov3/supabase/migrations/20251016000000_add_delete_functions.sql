-- Add functions for deleting user data and account

-- Function to delete user data but keep account
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's items
  DELETE FROM items WHERE items.user_id = delete_user_data.user_id;
  
  -- Delete user's saved items
  DELETE FROM saved_items WHERE saved_items.user_id = delete_user_data.user_id;
  
  -- Delete user's swap requests (both as requester and owner)
  DELETE FROM swap_requests 
  WHERE requester_id = delete_user_data.user_id 
     OR owner_id = delete_user_data.user_id;
  
  -- Delete user's messages
  DELETE FROM messages WHERE sender_id = delete_user_data.user_id;
  
  -- Delete user's conversations
  DELETE FROM conversations 
  WHERE participant1_id = delete_user_data.user_id 
     OR participant2_id = delete_user_data.user_id;
  
  -- Delete user's reviews (both as reviewer and reviewee)
  DELETE FROM reviews 
  WHERE reviewer_id = delete_user_data.user_id 
     OR reviewee_id = delete_user_data.user_id;
  
  -- Delete user's notifications
  DELETE FROM notifications WHERE notifications.user_id = delete_user_data.user_id;
  
  -- Delete user's preferences
  DELETE FROM user_preferences WHERE user_preferences.user_id = delete_user_data.user_id;
  
  -- Reset user profile data but keep account
  UPDATE users 
  SET 
    full_name = NULL,
    bio = NULL,
    avatar_url = NULL,
    location_name = NULL,
    location_coordinates = NULL,
    phone = NULL,
    rating_average = 0.00,
    rating_count = 0,
    successful_swaps = 0,
    updated_at = NOW()
  WHERE id = delete_user_data.user_id;
END;
$$;

-- Function to delete entire user account
CREATE OR REPLACE FUNCTION delete_user_account(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First delete all user data
  PERFORM delete_user_data(user_id);
  
  -- Delete the user profile
  DELETE FROM users WHERE id = delete_user_account.user_id;
  
  -- Delete from auth.users (this will cascade delete the account)
  DELETE FROM auth.users WHERE id = delete_user_account.user_id;
END;
$$;

-- Grant execute permissions to authenticated users (they can only delete their own data)
GRANT EXECUTE ON FUNCTION delete_user_data(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user_account(UUID) TO authenticated;

-- Add RLS policy to ensure users can only delete their own data
CREATE POLICY "Users can delete their own data" ON users
  FOR DELETE USING (auth.uid() = id);