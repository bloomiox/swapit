-- Add looking_for field to items table to store what the user wants in return for their item
ALTER TABLE items ADD COLUMN looking_for TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN items.looking_for IS 'What the item owner is looking for in return (swap preferences)';