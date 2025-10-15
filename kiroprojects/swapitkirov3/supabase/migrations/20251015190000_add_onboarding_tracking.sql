-- Add onboarding completion tracking to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to have onboarding completed if they have categories selected
UPDATE user_preferences 
SET onboarding_completed = TRUE, 
    onboarding_completed_at = created_at
WHERE array_length(categories_of_interest, 1) > 0;

-- Create function to check if user needs onboarding
CREATE OR REPLACE FUNCTION user_needs_onboarding(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user has completed onboarding
    RETURN NOT EXISTS (
        SELECT 1 FROM user_preferences 
        WHERE user_id = user_uuid 
        AND onboarding_completed = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;