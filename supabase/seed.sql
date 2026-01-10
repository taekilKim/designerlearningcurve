-- Seed data for Designer Learning Curve MVP

-- Insert sample articles
INSERT INTO articles (title, description, url, thumbnail_url, author, published_at) VALUES
  (
    '타이포그래피의 기초: 폰트와 서체의 차이',
    '디자이너라면 반드시 알아야 할 타이포그래피의 기본 개념을 소개합니다.',
    'https://brunch.co.kr/@example/typography-basics-1',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800',
    '김디자이너',
    NOW() - INTERVAL '30 days'
  ),
  (
    '본문 텍스트를 위한 최적의 행간 설정',
    '가독성을 높이는 행간과 자간 설정 방법을 실제 사례와 함께 설명합니다.',
    'https://medium.com/@designer/line-height-guide',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
    '이타입',
    NOW() - INTERVAL '25 days'
  ),
  (
    '웹에서 사용하는 타이포그래피 단위 (px, em, rem)',
    'px, em, rem의 차이점과 각각을 언제 사용해야 하는지 알아봅니다.',
    'https://brunch.co.kr/@webdesign/typography-units',
    'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800',
    '박웹',
    NOW() - INTERVAL '20 days'
  ),
  (
    '모바일 환경에서의 타이포그래피 고려사항',
    '작은 화면에서도 읽기 편한 타이포그래피를 구현하는 방법을 소개합니다.',
    'https://medium.com/@uxdesigner/mobile-typography',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    '최모바일',
    NOW() - INTERVAL '15 days'
  ),
  (
    '한글 타이포그래피: 특수성과 디자인 팁',
    '영문과 다른 한글의 특성을 이해하고 아름다운 한글 타이포그래피를 만드는 법',
    'https://brunch.co.kr/@hangeul/korean-typography',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
    '정한글',
    NOW() - INTERVAL '10 days'
  ),
  (
    'UX 리서치 시작하기: 사용자 인터뷰 준비',
    '효과적인 사용자 인터뷰를 위한 준비 과정과 질문 설계 방법',
    'https://medium.com/@uxresearch/user-interview-guide',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    '강리서치',
    NOW() - INTERVAL '28 days'
  ),
  (
    '정성적 리서치 vs 정량적 리서치',
    '두 가지 리서치 방법론의 차이와 적절한 활용 시점',
    'https://brunch.co.kr/@uxer/qualitative-quantitative',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
    '윤분석',
    NOW() - INTERVAL '22 days'
  ),
  (
    '사용자 페르소나 만들기',
    '실제 데이터를 기반으로 한 페르소나 작성 가이드',
    'https://medium.com/@productdesign/creating-personas',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    '임페르소나',
    NOW() - INTERVAL '18 days'
  ),
  (
    '사용성 테스트 진행 방법',
    '준비부터 실행, 결과 분석까지의 전 과정을 단계별로 설명',
    'https://brunch.co.kr/@usability/testing-guide',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    '서테스트',
    NOW() - INTERVAL '12 days'
  ),
  (
    'UX 리서치 결과를 디자인에 반영하기',
    '리서치 인사이트를 실제 디자인 결정으로 연결하는 방법',
    'https://medium.com/@uxdesign/research-to-design',
    'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800',
    '한인사이트',
    NOW() - INTERVAL '5 days'
  ),
  (
    '컬러 이론의 기초: RGB와 CMYK',
    '디지털과 인쇄 매체를 위한 컬러 모드의 이해',
    'https://brunch.co.kr/@colortheory/rgb-cmyk',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
    '조컬러',
    NOW() - INTERVAL '35 days'
  ),
  (
    '디자인 시스템 구축하기',
    '일관성 있는 디자인을 위한 시스템 설계 방법',
    'https://medium.com/@systemdesign/design-system',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
    '최시스템',
    NOW() - INTERVAL '8 days'
  );

-- Insert sample curriculums
INSERT INTO curriculums (id, title, description, difficulty, estimated_hours) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '주니어 디자이너를 위한 타이포그래피 기초',
    '타이포그래피의 기본 개념부터 실무에서 바로 활용할 수 있는 테크닉까지, 디자인의 가장 중요한 요소인 타이포그래피를 체계적으로 학습합니다.',
    'beginner',
    6
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'UX 리서치 시작하기',
    '사용자 중심 디자인의 핵심인 UX 리서치 방법론을 배우고, 실제 프로젝트에 적용할 수 있는 역량을 키웁니다.',
    'intermediate',
    8
  );

-- Insert curriculum items for Typography curriculum
INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '11111111-1111-1111-1111-111111111111',
  id,
  1,
  '타이포그래피를 처음 시작하는 분들을 위해 폰트와 서체의 개념부터 차근차근 설명합니다. 이 글을 읽으면 디자이너들이 왜 "폰트"와 "서체"를 구분하는지 이해할 수 있습니다.'
FROM articles WHERE title = '타이포그래피의 기초: 폰트와 서체의 차이';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '11111111-1111-1111-1111-111111111111',
  id,
  2,
  '가독성은 타이포그래피의 가장 중요한 목표입니다. 행간과 자간을 어떻게 설정하느냐에 따라 같은 글이라도 읽기 편한 정도가 크게 달라집니다. 실무 예제를 통해 최적의 설정값을 찾는 방법을 배워보세요.'
FROM articles WHERE title = '본문 텍스트를 위한 최적의 행간 설정';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '11111111-1111-1111-1111-111111111111',
  id,
  3,
  '웹 디자인을 하다 보면 px, em, rem 중 어떤 단위를 써야 할지 고민되는 순간이 많습니다. 각 단위의 특성을 이해하고 상황에 맞게 선택하는 방법을 익혀보세요.'
FROM articles WHERE title = '웹에서 사용하는 타이포그래피 단위 (px, em, rem)';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '11111111-1111-1111-1111-111111111111',
  id,
  4,
  '모바일 화면은 데스크톱과 완전히 다른 환경입니다. 작은 화면에서도 읽기 편한 타이포그래피를 위해 고려해야 할 사항들을 알아봅니다.'
FROM articles WHERE title = '모바일 환경에서의 타이포그래피 고려사항';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '11111111-1111-1111-1111-111111111111',
  id,
  5,
  '한글은 영문과 다른 고유한 특성이 있습니다. 한글 타이포그래피의 아름다움을 이해하고, 한글 폰트를 효과적으로 사용하는 방법을 배워보세요.'
FROM articles WHERE title = '한글 타이포그래피: 특수성과 디자인 팁';

-- Insert curriculum items for UX Research curriculum
INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '22222222-2222-2222-2222-222222222222',
  id,
  1,
  'UX 리서치의 시작은 사용자의 목소리를 직접 듣는 것입니다. 효과적인 사용자 인터뷰를 위한 준비 과정과 질문 설계 방법을 배워보세요.'
FROM articles WHERE title = 'UX 리서치 시작하기: 사용자 인터뷰 준비';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '22222222-2222-2222-2222-222222222222',
  id,
  2,
  '정성적 리서치와 정량적 리서치는 각각 다른 목적과 강점을 가지고 있습니다. 프로젝트 상황에 맞는 적절한 방법론을 선택하는 안목을 키워보세요.'
FROM articles WHERE title = '정성적 리서치 vs 정량적 리서치';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '22222222-2222-2222-2222-222222222222',
  id,
  3,
  '페르소나는 사용자를 대표하는 가상의 인물입니다. 실제 리서치 데이터를 기반으로 설득력 있는 페르소나를 만드는 방법을 알아봅니다.'
FROM articles WHERE title = '사용자 페르소나 만들기';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '22222222-2222-2222-2222-222222222222',
  id,
  4,
  '사용성 테스트는 디자인의 문제점을 발견하는 가장 확실한 방법입니다. 테스트 준비부터 실행, 결과 분석까지의 전 과정을 단계별로 익혀보세요.'
FROM articles WHERE title = '사용성 테스트 진행 방법';

INSERT INTO curriculum_items (curriculum_id, article_id, sequence, curator_note)
SELECT
  '22222222-2222-2222-2222-222222222222',
  id,
  5,
  '리서치를 위한 리서치는 의미가 없습니다. 리서치 인사이트를 실제 디자인 결정으로 연결하는 방법을 배우고, 사용자 중심의 디자인을 완성해보세요.'
FROM articles WHERE title = 'UX 리서치 결과를 디자인에 반영하기';
