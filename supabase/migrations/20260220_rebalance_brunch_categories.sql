-- Rebalance Brunch source categories and backfill existing Brunch articles
-- to reduce over-concentration in "UX 디자인".

-- 1) Source-level category rebalance (affects future collection fallback).
UPDATE article_sources
SET category = 'UI 디자인',
    updated_at = NOW()
WHERE url IN (
  'https://brunch.co.kr/@inaroundthenest',
  'https://brunch.co.kr/@daisyuxui',
  'https://brunch.co.kr/@lovelylucia',
  'https://brunch.co.kr/@greening',
  'https://brunch.co.kr/@product-design',
  'https://brunch.co.kr/@786c6f7068204f0',
  'https://brunch.co.kr/@uxui-neo',
  'https://brunch.co.kr/@needesign',
  'https://brunch.co.kr/@scottim',
  'https://brunch.co.kr/@creative',
  'https://brunch.co.kr/@sapu0000',
  'https://brunch.co.kr/@clay1987',
  'https://brunch.co.kr/@dalgudot',
  'https://brunch.co.kr/@daeng-chap',
  'https://brunch.co.kr/@boldydesign'
);

UPDATE article_sources
SET category = '프로덕트 디자인',
    updated_at = NOW()
WHERE url IN (
  'https://brunch.co.kr/@11design',
  'https://brunch.co.kr/@geunbae',
  'https://brunch.co.kr/@masaru3595',
  'https://brunch.co.kr/@theopenproduct',
  'https://brunch.co.kr/@yewooonon',
  'https://brunch.co.kr/@minjay-kim',
  'https://brunch.co.kr/@vivishin',
  'https://brunch.co.kr/@ashashash',
  'https://brunch.co.kr/@kennyhong',
  'https://brunch.co.kr/@userhabit',
  'https://brunch.co.kr/@windydog',
  'https://brunch.co.kr/@ghidesigner',
  'https://brunch.co.kr/@jiyuhan',
  'https://brunch.co.kr/@duotoneofficial'
);

UPDATE article_sources
SET category = '피그마 실무',
    updated_at = NOW()
WHERE url IN (
  'https://brunch.co.kr/@figmaster',
  'https://brunch.co.kr/@00mm',
  'https://brunch.co.kr/@ebprux',
  'https://brunch.co.kr/@uxn00b',
  'https://brunch.co.kr/@sangster',
  'https://brunch.co.kr/@yunjungseo'
);

UPDATE article_sources
SET category = '사용자 리서치',
    updated_at = NOW()
WHERE url IN (
  'https://brunch.co.kr/@grit-han',
  'https://brunch.co.kr/@andrewyhc'
);

UPDATE article_sources
SET category = '디자인 커리어',
    updated_at = NOW()
WHERE url IN (
  'https://brunch.co.kr/@uxminxu',
  'https://brunch.co.kr/@cliche-cliche',
  'https://brunch.co.kr/@da18ef10e6c849f',
  'https://brunch.co.kr/@justtryux',
  'https://brunch.co.kr/@designerjung',
  'https://brunch.co.kr/@jbkim8905',
  'https://brunch.co.kr/@mokryunbaik'
);

UPDATE article_sources
SET category = '디자인 시스템',
    updated_at = NOW()
WHERE url = 'https://brunch.co.kr/@4e2b4f97d7214af';

-- 2) Backfill existing Brunch articles currently tagged as UX-heavy labels.
--    Apply more specific categories first.
WITH base AS (
  SELECT
    id,
    lower(coalesce(title, '') || ' ' || coalesce(description, '')) AS text
  FROM articles
  WHERE url ILIKE '%brunch.co.kr/%'
    AND category IN ('UX 디자인', 'UX 설계')
)
UPDATE articles a
SET category = '디자인 시스템',
    updated_at = NOW()
FROM base b
WHERE a.id = b.id
  AND (
    b.text LIKE '%디자인 시스템%' OR
    b.text LIKE '%design system%' OR
    b.text LIKE '%토큰%'
  );

WITH base AS (
  SELECT
    id,
    lower(coalesce(title, '') || ' ' || coalesce(description, '')) AS text
  FROM articles
  WHERE url ILIKE '%brunch.co.kr/%'
    AND category IN ('UX 디자인', 'UX 설계')
)
UPDATE articles a
SET category = '피그마 실무',
    updated_at = NOW()
FROM base b
WHERE a.id = b.id
  AND (
    b.text LIKE '%figma%' OR
    b.text LIKE '%피그마%' OR
    b.text LIKE '%오토레이아웃%' OR
    b.text LIKE '%auto layout%' OR
    b.text LIKE '%플러그인%'
  );

WITH base AS (
  SELECT
    id,
    lower(coalesce(title, '') || ' ' || coalesce(description, '')) AS text
  FROM articles
  WHERE url ILIKE '%brunch.co.kr/%'
    AND category IN ('UX 디자인', 'UX 설계')
)
UPDATE articles a
SET category = 'UI 디자인',
    updated_at = NOW()
FROM base b
WHERE a.id = b.id
  AND (
    b.text LIKE '% ui %' OR
    b.text LIKE '%ui/%' OR
    b.text LIKE '%/ui%' OR
    b.text LIKE '%인터페이스%' OR
    b.text LIKE '%타이포%' OR
    b.text LIKE '%컬러%' OR
    b.text LIKE '%레이아웃%' OR
    b.text LIKE '%컴포넌트%'
  );

WITH base AS (
  SELECT
    id,
    lower(coalesce(title, '') || ' ' || coalesce(description, '')) AS text
  FROM articles
  WHERE url ILIKE '%brunch.co.kr/%'
    AND category IN ('UX 디자인', 'UX 설계')
)
UPDATE articles a
SET category = '사용자 리서치',
    updated_at = NOW()
FROM base b
WHERE a.id = b.id
  AND (
    b.text LIKE '%리서치%' OR
    b.text LIKE '%사용자 조사%' OR
    b.text LIKE '%인터뷰%' OR
    b.text LIKE '%페르소나%' OR
    b.text LIKE '%저니맵%' OR
    b.text LIKE '%휴리스틱%'
  );

WITH base AS (
  SELECT
    id,
    lower(coalesce(title, '') || ' ' || coalesce(description, '')) AS text
  FROM articles
  WHERE url ILIKE '%brunch.co.kr/%'
    AND category IN ('UX 디자인', 'UX 설계')
)
UPDATE articles a
SET category = '디자인 커리어',
    updated_at = NOW()
FROM base b
WHERE a.id = b.id
  AND (
    b.text LIKE '%커리어%' OR
    b.text LIKE '%취업%' OR
    b.text LIKE '%이직%' OR
    b.text LIKE '%포트폴리오%' OR
    b.text LIKE '%회고%' OR
    b.text LIKE '%주니어%' OR
    b.text LIKE '%신입%'
  );

WITH base AS (
  SELECT
    id,
    lower(coalesce(title, '') || ' ' || coalesce(description, '')) AS text
  FROM articles
  WHERE url ILIKE '%brunch.co.kr/%'
    AND category IN ('UX 디자인', 'UX 설계')
)
UPDATE articles a
SET category = '프로덕트 디자인',
    updated_at = NOW()
FROM base b
WHERE a.id = b.id
  AND (
    b.text LIKE '%프로덕트%' OR
    b.text LIKE '%product%' OR
    b.text LIKE '%서비스%' OR
    b.text LIKE '%전략%' OR
    b.text LIKE '%로드맵%' OR
    b.text LIKE '%지표%'
  );
