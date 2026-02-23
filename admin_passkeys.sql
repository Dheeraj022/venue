-- Create the admin_passkeys table
CREATE TABLE IF NOT EXISTS public.admin_passkeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passkey TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.admin_passkeys ENABLE ROW LEVEL SECURITY;

-- 1. Allow authenticated users (Admins) to perform ALL operations
CREATE POLICY "Admins full access" ON admin_passkeys
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Allow anyone (anon) to generate (Insert) a new passkey
CREATE POLICY "Public insert passkeys" ON admin_passkeys
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 3. Allow anyone (anon) to deactivate/update keys (needed for verification and generation flow)
CREATE POLICY "Public update passkeys" ON admin_passkeys
    FOR UPDATE
    TO anon
    USING (true);

-- 4. Allow anyone (anon) to read active passkeys
CREATE POLICY "Public read active passkeys" ON admin_passkeys
    FOR SELECT
    TO anon
    USING (is_active = true AND expires_at > now());

-- 5. Allow service_role to manage everything (fallback)
CREATE POLICY "Service role full access" ON admin_passkeys
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to delete old passkeys
CREATE OR REPLACE FUNCTION delete_old_passkeys()
RETURNS trigger AS $$
BEGIN
    DELETE FROM admin_passkeys WHERE expires_at < now() - interval '24 hours';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to clean up on every insert
CREATE TRIGGER cleanup_old_passkeys
AFTER INSERT ON admin_passkeys
FOR EACH STATEMENT
EXECUTE FUNCTION delete_old_passkeys();
