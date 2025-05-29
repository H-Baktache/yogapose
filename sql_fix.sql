-- SQL script to create and configure the pose_history table in Supabase

-- Check if pose_history table exists, if not create it
CREATE TABLE IF NOT EXISTS public.pose_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pose_name TEXT NOT NULL,
    confidence NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
    instructions TEXT[] DEFAULT ARRAY[]::TEXT[],
    level TEXT DEFAULT 'beginner',
    sanskrit_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_pose_history_user_id ON public.pose_history(user_id);

-- Create RLS policies for pose_history table
-- First, enable row level security
ALTER TABLE public.pose_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own pose history" ON public.pose_history;
DROP POLICY IF EXISTS "Users can insert their own pose history" ON public.pose_history;
DROP POLICY IF EXISTS "Users can update their own pose history" ON public.pose_history;
DROP POLICY IF EXISTS "Users can delete their own pose history" ON public.pose_history;

-- Create policies
-- 1. Users can view only their own pose history
CREATE POLICY "Users can view their own pose history"
ON public.pose_history
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Users can insert only their own pose history
CREATE POLICY "Users can insert their own pose history"
ON public.pose_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update only their own pose history
CREATE POLICY "Users can update their own pose history"
ON public.pose_history
FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Users can delete only their own pose history
CREATE POLICY "Users can delete their own pose history"
ON public.pose_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for yoga poses if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('yoga_poses', 'yoga_poses', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for yoga_poses bucket
DROP POLICY IF EXISTS "Users can upload their own yoga poses" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view yoga poses" ON storage.objects;

-- Create policies for storage
-- 1. Users can upload their own yoga poses
CREATE POLICY "Users can upload their own yoga poses"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'yoga_poses' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Anyone can view yoga poses
CREATE POLICY "Anyone can view yoga poses"
ON storage.objects
FOR SELECT
USING (bucket_id = 'yoga_poses');

-- Create function to handle pose history deletion (including storage cleanup)
CREATE OR REPLACE FUNCTION delete_pose_with_storage() RETURNS TRIGGER AS $$
BEGIN
  -- Extract the image path from the URL if it's a storage URL
  IF OLD.image_url LIKE '%/storage/v1/object/public/yoga_poses/%' THEN
    -- Delete the corresponding storage object
    DELETE FROM storage.objects
    WHERE bucket_id = 'yoga_poses'
    AND name LIKE OLD.user_id || '/%';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run before deletion
DROP TRIGGER IF EXISTS tr_delete_pose_storage ON public.pose_history;

CREATE TRIGGER tr_delete_pose_storage
BEFORE DELETE ON public.pose_history
FOR EACH ROW
EXECUTE FUNCTION delete_pose_with_storage();

-- Grant permissions
GRANT ALL ON public.pose_history TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.pose_history TO service_role;

-- For troubleshooting: Output message to confirm script execution
DO $$
BEGIN
  RAISE NOTICE 'Successfully created and configured the pose_history table with RLS policies';
END $$; 