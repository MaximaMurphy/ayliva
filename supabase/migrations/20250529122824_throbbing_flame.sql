-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;

-- Enable RLS if not already enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create comprehensive admin policy for all operations
CREATE POLICY "Admins can manage blog posts"
ON blog_posts
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text)
WITH CHECK ((auth.jwt() ->> 'email'::text) = 'aylivaadmin@gmail.com'::text);

-- Create SELECT policy for public users (to see only published posts)
CREATE POLICY "Public can view published posts"
ON blog_posts
FOR SELECT
TO public
USING (published = true);