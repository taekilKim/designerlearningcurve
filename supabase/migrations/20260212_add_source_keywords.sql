DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'article_sources'
  ) THEN
    ALTER TABLE article_sources
    ADD COLUMN IF NOT EXISTS keywords TEXT[] NOT NULL DEFAULT '{}';
  ELSE
    RAISE NOTICE 'article_sources 테이블이 아직 없습니다. 20260212_add_article_sources_and_publish_status.sql 먼저 실행하세요.';
  END IF;
END
$$;
