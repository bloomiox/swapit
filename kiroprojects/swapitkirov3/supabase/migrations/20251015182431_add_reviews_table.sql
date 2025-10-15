-- Reviews table already exists, just add missing policies and columns if needed

-- Enable RLS if not already enabled
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews for others" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- RLS Policies for reviews (using correct column name: reviewee_id)
CREATE POLICY "Users can view all reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for others" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = reviewer_id 
        AND auth.uid() != reviewee_id
    );

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = reviewer_id);

-- The users table already has rating_average column, no need to add it

-- Create function to update user rating average (using correct column names)
CREATE OR REPLACE FUNCTION update_user_rating_average()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the reviewed user's rating average
    UPDATE public.users 
    SET rating_average = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.reviews 
        WHERE reviewee_id = COALESCE(NEW.reviewee_id, OLD.reviewee_id)
    )
    WHERE id = COALESCE(NEW.reviewee_id, OLD.reviewee_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update rating averages
DROP TRIGGER IF EXISTS update_rating_on_review_insert ON public.reviews;
CREATE TRIGGER update_rating_on_review_insert
    AFTER INSERT ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rating_average();

DROP TRIGGER IF EXISTS update_rating_on_review_update ON public.reviews;
CREATE TRIGGER update_rating_on_review_update
    AFTER UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rating_average();

DROP TRIGGER IF EXISTS update_rating_on_review_delete ON public.reviews;
CREATE TRIGGER update_rating_on_review_delete
    AFTER DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rating_average();