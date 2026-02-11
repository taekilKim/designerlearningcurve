-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curriculums table
CREATE TABLE IF NOT EXISTS curriculums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curriculum Items table (articles in a curriculum)
CREATE TABLE IF NOT EXISTS curriculum_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curriculum_id UUID NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  curator_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(curriculum_id, sequence)
);

-- Enrollments table (user's enrolled curriculums)
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curriculum_id UUID NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, curriculum_id)
);

-- Completed Items table (user's completed curriculum items)
CREATE TABLE IF NOT EXISTS completed_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  curriculum_item_id UUID NOT NULL REFERENCES curriculum_items(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, curriculum_item_id)
);

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

-- Function to normalize article URLs for deduplication
CREATE OR REPLACE FUNCTION public.normalize_article_url(raw_url TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
RETURNS NULL ON NULL INPUT
AS $$
  SELECT
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(
              regexp_replace(trim(raw_url), '#.*$', ''),
              '([?&])(utm_[^=&]+|fbclid|gclid|igshid|mc_cid|mc_eid|ref|ref_src|si)=[^&]*',
              '\1',
              'gi'
            ),
            '/+$',
            '',
            'g'
          ),
          '\?&',
          '?',
          'g'
        ),
        '&{2,}',
        '&',
        'g'
      ),
      '([?&])$',
      '',
      'g'
    )
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_curriculum_items_curriculum_id ON curriculum_items(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_sequence ON curriculum_items(curriculum_id, sequence);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_curriculum_id ON enrollments(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_completed_items_enrollment_id ON completed_items(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_learning_notes_enrollment_id ON learning_notes(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_learning_notes_curriculum_item_id ON learning_notes(curriculum_item_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_normalized_url_unique
  ON articles (normalize_article_url(url));

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_notes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Articles policies (public read)
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

-- Curriculums policies (public read)
CREATE POLICY "Curriculums are viewable by everyone"
  ON curriculums FOR SELECT
  USING (true);

-- Curriculum Items policies (public read)
CREATE POLICY "Curriculum items are viewable by everyone"
  ON curriculum_items FOR SELECT
  USING (true);

-- Enrollments policies
CREATE POLICY "Enrollments are viewable by owner"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own enrollments"
  ON enrollments FOR DELETE
  USING (auth.uid() = user_id);

-- Completed Items policies
CREATE POLICY "Completed items viewable by enrollment owner"
  ON completed_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = completed_items.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create completed items for own enrollments"
  ON completed_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = completed_items.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete completed items from own enrollments"
  ON completed_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = completed_items.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- Learning Notes policies
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

-- Function to handle user creation (create profile automatically)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curriculums_updated_at BEFORE UPDATE ON curriculums
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_notes_updated_at BEFORE UPDATE ON learning_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
