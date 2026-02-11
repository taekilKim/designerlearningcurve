-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 영문 id (예: "ui-design")
  label TEXT NOT NULL, -- 국문 이름 (예: "UI 디자인")
  icon TEXT NOT NULL DEFAULT '📁', -- 이모지 아이콘
  for_articles BOOLEAN NOT NULL DEFAULT true,
  for_curriculums BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_for_articles ON categories(for_articles) WHERE for_articles = true;
CREATE INDEX IF NOT EXISTS idx_categories_for_curriculums ON categories(for_curriculums) WHERE for_curriculums = true;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can insert/update/delete categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert default categories
INSERT INTO categories (name, label, icon, for_articles, for_curriculums, display_order) VALUES
  ('research', '리서치 및 방법론', '🔍', true, true, 1),
  ('ui-design', 'UI 디자인', '🎨', true, true, 2),
  ('ux-design', 'UX 설계', '✏️', true, true, 3),
  ('prototyping', '프로토타이핑', '⚡', true, true, 4),
  ('design-system', '디자인 시스템', '🧩', true, true, 5),
  ('design-principle', '디자인 원칙 및 철학', '💡', true, true, 6),
  ('collaboration', '협업과 소프트스킬', '🤝', true, true, 7),
  ('career', '디자인 커리어', '🚀', true, true, 8)
ON CONFLICT (name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();
