-- Add boost fields to items table
-- This migration adds boost_type and boost_expires_at fields to the items table

-- Add boost_type and boost_expires_at columns to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS boost_type TEXT,
ADD COLUMN IF NOT EXISTS boost_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for boost queries
CREATE INDEX IF NOT EXISTS idx_items_boost_type ON items(boost_type) WHERE boost_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_boost_expires_at ON items(boost_expires_at) WHERE boost_expires_at IS NOT NULL;

-- Create function to update item boost status
CREATE OR REPLACE FUNCTION update_item_boost_status()
RETURNS TRIGGER AS $
BEGIN
    -- When a boost is activated, update the item
    IF NEW.is_active = true AND (OLD.is_active IS NULL OR OLD.is_active = false) THEN
        UPDATE items 
        SET 
            is_boosted = true,
            boost_type = NEW.boost_type,
            boost_expires_at = NEW.expires_at
        WHERE id = NEW.item_id;
    END IF;
    
    -- When a boost is deactivated, update the item
    IF NEW.is_active = false AND OLD.is_active = true THEN
        UPDATE items 
        SET 
            is_boosted = false,
            boost_type = NULL,
            boost_expires_at = NULL
        WHERE id = NEW.item_id;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger to update item boost status when boost changes
DROP TRIGGER IF EXISTS trigger_update_item_boost_status ON boosts;
CREATE TRIGGER trigger_update_item_boost_status
    AFTER INSERT OR UPDATE ON boosts
    FOR EACH ROW
    EXECUTE FUNCTION update_item_boost_status();

-- Create function to expire item boosts
CREATE OR REPLACE FUNCTION expire_item_boosts()
RETURNS void AS $
BEGIN
    -- Update items where boost has expired
    UPDATE items 
    SET 
        is_boosted = false,
        boost_type = NULL,
        boost_expires_at = NULL
    WHERE is_boosted = true 
    AND boost_expires_at <= NOW();
    
    -- Also update the boosts table
    UPDATE boosts 
    SET is_active = false 
    WHERE is_active = true 
    AND expires_at <= NOW();
END;
$ LANGUAGE plpgsql;

-- Update existing boosted items to have the correct boost_type
UPDATE items 
SET boost_type = 'featured'
WHERE is_boosted = true AND boost_type IS NULL;