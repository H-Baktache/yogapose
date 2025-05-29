-- Create pose_history table if it doesn't exist already
CREATE TABLE IF NOT EXISTS pose_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  pose_name TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  image_url TEXT,
  description TEXT,
  benefits TEXT[], -- Text array type for benefits
  instructions TEXT[], -- Text array type for instructions
  level TEXT,
  sanskrit_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE pose_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own history
CREATE POLICY "Users can view their own pose history"
  ON pose_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own history
CREATE POLICY "Users can insert their own pose history"
  ON pose_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own history
CREATE POLICY "Users can delete their own pose history"
  ON pose_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- If you need to drop and recreate the table (run this with caution - it deletes all data!)
-- Uncomment the lines below to completely reset the table if needed
/*
DROP TABLE IF EXISTS pose_history;
*/ 