-- Remove deprecated source type column from article_sources.
ALTER TABLE article_sources
DROP COLUMN IF EXISTS source_type;
