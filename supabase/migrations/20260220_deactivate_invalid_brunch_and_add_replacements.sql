-- Deactivate invalid Brunch profile sources (404) and add verified replacements.

-- 1) Deactivate invalid profiles that currently return 404.
UPDATE article_sources
SET is_active = FALSE,
    updated_at = NOW()
WHERE url IN (
  'https://brunch.co.kr/@design-melon',
  'https://brunch.co.kr/@eunyoung42',
  'https://brunch.co.kr/@uxdesign',
  'https://brunch.co.kr/@kakaoux',
  'https://brunch.co.kr/@suyoung',
  'https://brunch.co.kr/@speedlyhv1tx'
);

-- 2) Add verified replacement profiles (profile URL + feed existence checked).
INSERT INTO article_sources (name, url, category, keywords, source_type, is_active)
VALUES
  ('브런치 @ghidesigner', 'https://brunch.co.kr/@ghidesigner', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @clay1987', 'https://brunch.co.kr/@clay1987', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @dalgudot', 'https://brunch.co.kr/@dalgudot', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @mokryunbaik', 'https://brunch.co.kr/@mokryunbaik', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @jiyuhan', 'https://brunch.co.kr/@jiyuhan', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @daeng-chap', 'https://brunch.co.kr/@daeng-chap', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @boldydesign', 'https://brunch.co.kr/@boldydesign', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @duotoneofficial', 'https://brunch.co.kr/@duotoneofficial', 'UX 디자인', '{}', 'seed', TRUE),
  ('브런치 @4e2b4f97d7214af', 'https://brunch.co.kr/@4e2b4f97d7214af', 'UX 디자인', '{}', 'seed', TRUE)
ON CONFLICT (url) DO UPDATE
SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  keywords = EXCLUDED.keywords,
  source_type = EXCLUDED.source_type,
  is_active = TRUE,
  updated_at = NOW();
