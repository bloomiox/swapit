-- Function to handle accepting swap requests and deactivating items
CREATE OR REPLACE FUNCTION accept_swap_request(
  request_id UUID,
  requested_item_id UUID,
  offered_item_id UUID DEFAULT NULL,
  is_claim_request BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
  -- Update swap request status
  UPDATE swap_requests 
  SET 
    status = 'accepted',
    updated_at = NOW()
  WHERE id = request_id;

  -- Deactivate the requested item (owner's item)
  UPDATE items 
  SET 
    is_available = FALSE,
    updated_at = NOW()
  WHERE id = requested_item_id;

  -- Deactivate the offered item (if it exists - not for claim requests)
  IF offered_item_id IS NOT NULL AND is_claim_request = FALSE THEN
    UPDATE items 
    SET 
      is_available = FALSE,
      updated_at = NOW()
    WHERE id = offered_item_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION accept_swap_request TO authenticated;