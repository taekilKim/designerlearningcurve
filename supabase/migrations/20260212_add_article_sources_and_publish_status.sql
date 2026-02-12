-- Add publish flag for articles and managed RSS source table.

ALTER TABLE articles
ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE articles
SET is_published = TRUE
WHERE is_published IS NULL;

CREATE TABLE IF NOT EXISTS article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT,
  source_type TEXT NOT NULL DEFAULT 'manual',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_article_sources_is_active ON article_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_article_sources_created_at ON article_sources(created_at DESC);

ALTER TABLE article_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read article_sources"
  ON article_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert article_sources"
  ON article_sources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update article_sources"
  ON article_sources FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete article_sources"
  ON article_sources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

DROP TRIGGER IF EXISTS update_article_sources_updated_at ON article_sources;
CREATE TRIGGER update_article_sources_updated_at
  BEFORE UPDATE ON article_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

INSERT INTO article_sources (name, url, category, source_type, is_active)
VALUES
  ('서핏 매거진', 'https://mag.surfit.io/feed', '프로덕트 디자인', 'seed', TRUE),
  ('요즘IT', 'https://yozm.wishket.com/magazine/feed/', '프로덕트 디자인', 'seed', TRUE),
  ('DISQUIET', 'https://disquiet.io/rss', '프로덕트 디자인', 'seed', TRUE),
  ('토스 테크', 'https://toss.tech/rss.xml', '프로덕트 디자인', 'seed', TRUE),
  ('당근 테크', 'https://medium.com/feed/daangn', '프로덕트 디자인', 'seed', TRUE),
  ('우아한형제들', 'https://techblog.woowahan.com/feed', '프로덕트 디자인', 'seed', TRUE),
  ('카카오 테크', 'https://tech.kakao.com/feed', '프로덕트 디자인', 'seed', TRUE),
  ('네이버 D2', 'https://d2.naver.com/d2.atom', '프로덕트 디자인', 'seed', TRUE),
  ('뱅크샐러드', 'https://medium.com/feed/banksalad', '프로덕트 디자인', 'seed', TRUE),
  ('딜라이트룸', 'https://medium.com/feed/delightroom', '프로덕트 디자인', 'seed', TRUE),
  ('강남언니', 'https://blog.gangnamunni.com/feed.xml', '프로덕트 디자인', 'seed', TRUE),
  ('쿠팡 엔지니어링', 'https://medium.com/feed/coupang-engineering', '프로덕트 디자인', 'seed', TRUE),
  ('여기어때 테크', 'https://techblog.gccompany.co.kr/feed', '프로덕트 디자인', 'seed', TRUE),
  ('velog UXUI', 'https://v2.velog.io/rss/tag/UXUI', 'UX 디자인', 'seed', TRUE),
  ('velog 디자인', 'https://v2.velog.io/rss/tag/%EB%94%94%EC%9E%90%EC%9D%B8', 'UI 디자인', 'seed', TRUE),
  ('velog Figma', 'https://v2.velog.io/rss/tag/figma', '피그마 실무', 'seed', TRUE)
ON CONFLICT (url) DO NOTHING;
