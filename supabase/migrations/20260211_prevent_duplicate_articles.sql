-- Normalize article URLs and prevent duplicate collection.

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

UPDATE articles
SET url = normalize_article_url(url)
WHERE url IS DISTINCT FROM normalize_article_url(url);

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY normalize_article_url(url)
      ORDER BY created_at DESC, id DESC
    ) AS rank_order
  FROM articles
)
DELETE FROM articles a
USING ranked r
WHERE a.id = r.id
  AND r.rank_order > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_normalized_url_unique
  ON articles (normalize_article_url(url));
