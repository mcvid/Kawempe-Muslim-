-- Fix Infinite Recursion in RLS Policies
-- The previous policies caused infinite recursion because checking if a user is an admin
-- required reading the school_profiles table, which triggered the policy again.

-- 1. Create a secure function to check admin status (Bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This makes the function run with the privileges of the creator (bypassing RLS)
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM school_profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
END;
$$;

-- 2. Fix school_profiles Policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON school_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON school_profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON school_profiles;

CREATE POLICY "Admins can read all profiles" ON school_profiles
    FOR SELECT
    USING (is_admin() OR id = auth.uid()); -- Combine 'read own' and 'admin read all' logic if needed, or keep separate

-- We'll keep the separate "Users can read own profile" policy as is. 
-- The "Admins can read all profiles" allows admins to read EVERYONE.

CREATE POLICY "Admins can insert profiles" ON school_profiles
    FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "Admins can update profiles" ON school_profiles
    FOR UPDATE
    USING (is_admin());

-- 3. Fix students Policies
DROP POLICY IF EXISTS "Allow all for admins" ON students;

CREATE POLICY "Allow all for admins" ON students
    FOR ALL
    USING (is_admin());
