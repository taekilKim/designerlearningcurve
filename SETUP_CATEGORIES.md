# 카테고리 데이터베이스 설정 가이드

## 문제

사이드바가 표시되지 않는 경우, `categories` 테이블이 생성되지 않았거나 데이터가 없을 수 있습니다.

## 해결 방법

### 옵션 1: Supabase 대시보드에서 SQL 실행 (권장)

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **New Query** 버튼 클릭
5. 아래 SQL을 복사하여 붙여넣기
6. **Run** 버튼 클릭

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📁',
  for_articles BOOLEAN NOT NULL DEFAULT true,
  for_curriculums BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
CREATE INDEX IF NOT EXISTS idx_categories_for_articles ON categories(for_articles) WHERE for_articles = true;
CREATE INDEX IF NOT EXISTS idx_categories_for_curriculums ON categories(for_curriculums) WHERE for_curriculums = true;

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only admins can insert/update/delete categories
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
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

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
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

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
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
DROP TRIGGER IF EXISTS trigger_update_categories_updated_at ON categories;
CREATE TRIGGER trigger_update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_categories_updated_at();
```

### 옵션 2: 테이블이 이미 존재하는지 확인

SQL Editor에서 다음 쿼리를 실행하여 카테고리가 있는지 확인:

```sql
SELECT * FROM categories ORDER BY display_order;
```

**결과:**
- 테이블이 없다는 에러 → 위의 전체 SQL 실행 필요
- 빈 결과 → INSERT 문만 실행
- 카테고리가 보임 → 데이터는 정상, 다른 문제일 수 있음

### 옵션 3: 기존 articles/curriculums 데이터 업데이트

만약 기존 아티클이나 커리큘럼에 하드코딩된 카테고리 값이 있다면, 데이터베이스에서 확인:

```sql
-- 아티클의 카테고리 값 확인
SELECT DISTINCT category FROM articles WHERE category IS NOT NULL;

-- 커리큘럼의 카테고리 값 확인
SELECT DISTINCT category FROM curriculums WHERE category IS NOT NULL;
```

## 검증

설정 완료 후:

1. 홈페이지(`https://designpath.vercel.app`) 접속
2. 왼쪽 사이드바에 카테고리 목록이 표시되는지 확인
3. 커리큘럼 페이지(`/curriculums`)에서도 사이드바 확인

## 트러블슈팅

### 여전히 사이드바가 안 보이는 경우

1. **브라우저 개발자 도구 확인**
   - F12 → Console 탭
   - 에러 메시지 확인

2. **데이터 확인**
   ```sql
   -- categories 테이블 확인
   SELECT COUNT(*) FROM categories;

   -- RLS 정책 확인
   SELECT * FROM categories; -- 로그인 없이 실행
   ```

3. **캐시 클리어**
   - 브라우저 하드 리프레시 (Ctrl+Shift+R 또는 Cmd+Shift+R)
   - 또는 시크릿 모드에서 테스트

4. **모바일 반응형 확인**
   - 사이드바는 데스크톱(1024px 이상)에서만 표시될 수 있습니다
   - 브라우저 창을 충분히 넓게 열어보세요

### 사이드바는 보이지만 비어있는 경우

데이터베이스에 카테고리가 없을 수 있습니다. INSERT 문만 다시 실행:

```sql
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
```
