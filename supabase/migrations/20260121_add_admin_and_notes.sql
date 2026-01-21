-- Add admin flag to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Learning Notes table (user's notes for each curriculum item)
CREATE TABLE IF NOT EXISTS learning_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  curriculum_item_id UUID NOT NULL REFERENCES curriculum_items(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, curriculum_item_id)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_learning_notes_enrollment_id ON learning_notes(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_learning_notes_curriculum_item_id ON learning_notes(curriculum_item_id);

-- Enable RLS for learning_notes
ALTER TABLE learning_notes ENABLE ROW LEVEL SECURITY;

-- Learning Notes policies (same pattern as completed_items)
CREATE POLICY "Learning notes viewable by enrollment owner"
  ON learning_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create notes for own enrollments"
  ON learning_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own notes"
  ON learning_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own notes"
  ON learning_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- Admin policies for articles
CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin policies for curriculums
CREATE POLICY "Admins can insert curriculums"
  ON curriculums FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update curriculums"
  ON curriculums FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete curriculums"
  ON curriculums FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admin policies for curriculum_items
CREATE POLICY "Admins can insert curriculum items"
  ON curriculum_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update curriculum items"
  ON curriculum_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete curriculum items"
  ON curriculum_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Trigger for updated_at on learning_notes
CREATE TRIGGER update_learning_notes_updated_at BEFORE UPDATE ON learning_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set admin flag for the specified email (taekil.design@gmail.com)
-- This will be executed after the user first logs in
-- Run this manually in Supabase SQL Editor after taekil.design@gmail.com signs up:
-- UPDATE profiles SET is_admin = true WHERE email = 'taekil.design@gmail.com';
