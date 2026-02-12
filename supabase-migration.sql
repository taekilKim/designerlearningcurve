-- ============================================
-- Designer Learning Curve - Database Migration
-- ============================================
-- 이 파일을 Supabase SQL Editor에서 실행하세요
-- ============================================

-- 1. Profiles 테이블 수정 (관리자 권한 추가)
-- ============================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 관리자 권한 부여 예시 (본인의 이메일로 변경)
-- UPDATE profiles SET is_admin = TRUE WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');


-- 2. Articles 테이블 (아티클)
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  author TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles RLS 정책
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view articles"
  ON articles FOR SELECT
  USING (true);

-- 관리자만 생성 가능
CREATE POLICY "Admins can insert articles"
  ON articles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 2-1. Article Sources 테이블 (수집 소스)
-- ============================================
CREATE TABLE IF NOT EXISTS article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  category TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  source_type TEXT NOT NULL DEFAULT 'manual',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 관리자만 수정 가능
CREATE POLICY "Admins can update articles"
  ON articles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 관리자만 삭제 가능
CREATE POLICY "Admins can delete articles"
  ON articles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );


-- 3. Curriculums 테이블 (커리큘럼)
-- ============================================
CREATE TABLE IF NOT EXISTS curriculums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_hours INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Curriculums RLS 정책
ALTER TABLE curriculums ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view curriculums"
  ON curriculums FOR SELECT
  USING (true);

-- 관리자만 생성 가능
CREATE POLICY "Admins can insert curriculums"
  ON curriculums FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 관리자만 수정 가능
CREATE POLICY "Admins can update curriculums"
  ON curriculums FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 관리자만 삭제 가능
CREATE POLICY "Admins can delete curriculums"
  ON curriculums FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );


-- 4. Curriculum Items 테이블 (커리큘럼-아티클 연결)
-- ============================================
CREATE TABLE IF NOT EXISTS curriculum_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id UUID NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  curator_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(curriculum_id, article_id),
  UNIQUE(curriculum_id, sequence)
);

-- Curriculum Items RLS 정책
ALTER TABLE curriculum_items ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 조회 가능
CREATE POLICY "Anyone can view curriculum_items"
  ON curriculum_items FOR SELECT
  USING (true);

-- 관리자만 생성 가능
CREATE POLICY "Admins can insert curriculum_items"
  ON curriculum_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 관리자만 수정 가능
CREATE POLICY "Admins can update curriculum_items"
  ON curriculum_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 관리자만 삭제 가능
CREATE POLICY "Admins can delete curriculum_items"
  ON curriculum_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );


-- 5. Enrollments 테이블 (사용자의 커리큘럼 등록)
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curriculum_id UUID NOT NULL REFERENCES curriculums(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, curriculum_id)
);

-- Enrollments RLS 정책
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 등록만 조회 가능
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 등록만 생성 가능
CREATE POLICY "Users can insert own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 등록만 삭제 가능
CREATE POLICY "Users can delete own enrollments"
  ON enrollments FOR DELETE
  USING (auth.uid() = user_id);


-- 6. Completed Items 테이블 (완료한 아티클)
-- ============================================
CREATE TABLE IF NOT EXISTS completed_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  curriculum_item_id UUID NOT NULL REFERENCES curriculum_items(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, curriculum_item_id)
);

-- Completed Items RLS 정책
ALTER TABLE completed_items ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 완료 항목만 조회 가능
CREATE POLICY "Users can view own completed_items"
  ON completed_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = completed_items.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- 사용자는 자신의 완료 항목만 생성 가능
CREATE POLICY "Users can insert own completed_items"
  ON completed_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = completed_items.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- 사용자는 자신의 완료 항목만 삭제 가능
CREATE POLICY "Users can delete own completed_items"
  ON completed_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = completed_items.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );


-- 7. Learning Notes 테이블 (커리큘럼별 학습 노트)
-- ============================================
CREATE TABLE IF NOT EXISTS learning_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id)
);

-- Learning Notes RLS 정책
ALTER TABLE learning_notes ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 노트만 조회 가능
CREATE POLICY "Users can view own learning_notes"
  ON learning_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- 사용자는 자신의 노트만 생성/수정 가능
CREATE POLICY "Users can insert own learning_notes"
  ON learning_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own learning_notes"
  ON learning_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- 사용자는 자신의 노트만 삭제 가능
CREATE POLICY "Users can delete own learning_notes"
  ON learning_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = learning_notes.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );


-- 8. 인덱스 생성 (성능 최적화)
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_curriculum_items_curriculum_id ON curriculum_items(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_article_id ON curriculum_items(article_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_items_sequence ON curriculum_items(curriculum_id, sequence);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_curriculum_id ON enrollments(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_completed_items_enrollment_id ON completed_items(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_learning_notes_enrollment_id ON learning_notes(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_article_sources_is_active ON article_sources(is_active);
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_normalized_url_unique
  ON articles (normalize_article_url(url));


-- 9. 트리거 함수 (updated_at 자동 업데이트)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Articles 트리거
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_sources_updated_at
  BEFORE UPDATE ON article_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Curriculums 트리거
CREATE TRIGGER update_curriculums_updated_at
  BEFORE UPDATE ON curriculums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Curriculum Items 트리거
CREATE TRIGGER update_curriculum_items_updated_at
  BEFORE UPDATE ON curriculum_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Learning Notes 트리거
CREATE TRIGGER update_learning_notes_updated_at
  BEFORE UPDATE ON learning_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- 마이그레이션 완료!
-- ============================================
-- 다음 단계:
-- 1. 본인을 관리자로 설정:
--    UPDATE profiles SET is_admin = TRUE
--    WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
--
-- 2. 관리자 페이지에서 아티클과 커리큘럼 생성
-- 3. 사용자로 커리큘럼 등록 및 학습 노트 작성 테스트
-- ============================================
