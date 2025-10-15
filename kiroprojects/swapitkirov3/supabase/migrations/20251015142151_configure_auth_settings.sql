-- Configure auth settings for development
-- This migration ensures proper auth configuration

-- Enable email signup and disable email confirmation for development
-- Note: These settings should be configured in the Supabase dashboard for production

-- For now, let's just ensure our user creation works properly
-- We'll add some helpful functions for debugging

-- Function to check if user profile exists
CREATE OR REPLACE FUNCTION public.check_user_profile(user_email text)
RETURNS TABLE(
    auth_user_exists boolean,
    profile_exists boolean,
    auth_user_id uuid,
    profile_data jsonb
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM auth.users WHERE email = user_email) as auth_user_exists,
        EXISTS(SELECT 1 FROM public.users WHERE email = user_email) as profile_exists,
        (SELECT id FROM auth.users WHERE email = user_email LIMIT 1) as auth_user_id,
        (SELECT to_jsonb(u.*) FROM public.users u WHERE email = user_email LIMIT 1) as profile_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to manually create user profile (for debugging)
CREATE OR REPLACE FUNCTION public.create_user_profile_manual(
    user_id uuid,
    user_email text,
    user_name text DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (user_id, user_email, COALESCE(user_name, user_email))
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, users.full_name),
        updated_at = NOW();
    
    RETURN true;
EXCEPTION
    WHEN others THEN
        RAISE LOG 'Error creating user profile manually: %', SQLERRM;
        RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;