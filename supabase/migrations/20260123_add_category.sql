-- Add category column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category TEXT;

-- Add category to curriculums table
ALTER TABLE curriculums ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_curriculums_category ON curriculums(category);
