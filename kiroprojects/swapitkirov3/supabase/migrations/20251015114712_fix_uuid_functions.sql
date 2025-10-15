-- Fix UUID function calls to use gen_random_uuid() instead of uuid_generate_v4()
-- This migration corrects the UUID generation for PostgreSQL compatibility

-- First, let's create a simple function to replace uuid_generate_v4 if needed
-- (This is just a safety measure in case the function is referenced elsewhere)
DO $$
BEGIN
    -- Check if uuid_generate_v4 exists, if not create an alias
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'uuid_generate_v4') THEN
        CREATE OR REPLACE FUNCTION uuid_generate_v4() RETURNS UUID AS 'SELECT gen_random_uuid();' LANGUAGE SQL;
    END IF;
END $$;