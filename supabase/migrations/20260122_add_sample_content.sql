-- Sample UX/UI articles and curriculums for Designer Learning Curve
-- Run this in Supabase SQL Editor

-- Insert Articles
INSERT INTO articles (id, title, url, description, author, created_at) VALUES
-- UX/UI 기초
('a1111111-1111-1111-1111-111111111111',
 '2025 UX/UI 웹디자인 트렌드 가이드 총정리',
 'https://brunch.co.kr/@7217b71f43c34f7/114',
 '2025년 UX/UI 웹디자인 트렌드를 한눈에 파악할 수 있는 종합 가이드. 노코드 툴 활용, 다크모드, 마이크로 인터랙션 등 최신 트렌드를 다룹니다.',
 'Brunch',
 NOW()),

('a1111111-1111-1111-1111-111111111112',
 'UX/UI 디자인이란? 정의, 차이점, 사례',
 'https://www.codestates.com/blog/content/uxui-%EB%94%94%EC%9E%90%EC%9D%B8%EC%9D%B4%EB%9E%80',
 'UX와 UI의 차이점을 이해하고, 실제 사례를 통해 UX/UI 디자인의 기초 개념을 학습합니다.',
 '코드스테이츠',
 NOW()),

('a1111111-1111-1111-1111-111111111113',
 '2025년 UI디자인을 도와주는 AI서비스 삼대장',
 'https://brunch.co.kr/@mobiinside/6364',
 'AI 기술을 활용한 UI 디자인 도구들을 소개하고, 실무에 어떻게 적용할 수 있는지 설명합니다.',
 'Brunch - 모비인사이드',
 NOW()),

('a1111111-1111-1111-1111-111111111114',
 '모든 UX 디자이너가 알아야 할 15가지 원칙',
 'https://www.adobe.com/kr/creativecloud/design/hub/guides/15-rules-every-ux-designer-should-know.html',
 'Adobe에서 제공하는 UX 디자인의 핵심 원칙들을 이해하고 실무에 적용하는 방법을 배웁니다.',
 'Adobe Creative Cloud',
 NOW()),

-- UX 디자인 프로세스
('a2222222-2222-2222-2222-222222222221',
 'UX 디자인 프로세스란',
 'https://brunch.co.kr/@everiwon/14',
 'UX 디자인 프로세스의 각 단계를 상세히 설명하고, 실제 프로젝트에 어떻게 적용하는지 안내합니다.',
 'Brunch - everiwon',
 NOW()),

('a2222222-2222-2222-2222-222222222222',
 '세상은 넓고 디자인 프로세스도 많다',
 'https://medium.com/plusx-ux-lab/%EC%84%B8%EC%83%81%EC%9D%80-%EB%84%93%EA%B3%A0-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%94%84%EB%A1%9C%EC%84%B8%EC%8A%A4%EB%8F%84-%EB%A7%8E%EB%8B%A4-28d5c73b2215',
 '더블 다이아몬드, Lean UX, Agile 등 다양한 디자인 방법론과 프로세스를 비교 분석합니다.',
 'Medium - PlusX UX Lab',
 NOW()),

('a2222222-2222-2222-2222-222222222223',
 '15년 경력 UX 리서처가 경험한 UX 디자인 프로세스',
 'https://www.elancer.co.kr/blog/detail/793',
 '실무 경험을 바탕으로 한 UX 디자인 프로세스의 실제 적용 사례와 노하우를 공유합니다.',
 '이랜서 블로그',
 NOW()),

('a2222222-2222-2222-2222-222222222224',
 '체계적인 UX 리서치를 위한 5가지 팁',
 'https://medium.com/@josephkim/-f333f01d909e',
 'UX 리서치를 효과적으로 수행하기 위한 실용적인 팁과 방법론을 제시합니다.',
 'Medium - Josh Kim',
 NOW()),

-- 디자인 시스템
('a3333333-3333-3333-3333-333333333331',
 'UX 디자인의 일관성을 높이는 디자인 시스템 가이드',
 'https://www.elancer.co.kr/blog/detail/268',
 '디자인 시스템의 기본 구성 요소와 작성 방법을 상세히 안내합니다.',
 '이랜서 블로그',
 NOW()),

('a3333333-3333-3333-3333-333333333332',
 '디자인 시스템은 왜 필요한가',
 'https://story.pxd.co.kr/1434',
 '디자인 시스템의 필요성과 주요 UI 패턴, 컴포넌트를 8부작으로 상세히 설명합니다.',
 'pxd story',
 NOW()),

('a3333333-3333-3333-3333-333333333333',
 '사용 가능한 진짜 디자인 시스템을 만드는 여정',
 'https://blog.hwahae.co.kr/all/tech/13236',
 '화해 팀이 실제로 디자인 시스템을 구축한 과정과 경험을 상세히 공유합니다.',
 '화해 기술 블로그',
 NOW()),

('a3333333-3333-3333-3333-333333333334',
 '실무에 무조건 써먹는 핵심 UI 컴포넌트 16개',
 'https://blog.openpath.kr/%EC%8B%A4%EB%AC%B4%EC%97%90-%EB%AC%B4%EC%A1%B0%EA%B1%B4-%EC%8D%A8%EB%A8%B9%EB%8A%94-%ED%95%B5%EC%8B%AC-ui-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-16%EA%B0%9C-25032',
 'Google Material Design 기반 실무에서 자주 사용되는 UI 컴포넌트 16가지를 소개합니다.',
 '오픈패스 블로그',
 NOW());

-- Update existing curriculum or create new ones
-- Curriculum 1: UX/UI 디자인 기초
UPDATE curriculums
SET
  title = 'UX/UI 디자인 기초',
  description = '2025년 최신 트렌드와 함께 UX/UI 디자인의 기본 개념을 배웁니다. 초보자도 쉽게 따라할 수 있는 입문 과정입니다.',
  thumbnail_url = NULL
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Curriculum 2: Create new if needed
INSERT INTO curriculums (id, title, description, thumbnail_url, created_at)
VALUES
('22222222-2222-2222-2222-222222222222',
 'UX 디자인 프로세스 마스터',
 '사용자 리서치부터 프로토타이핑까지, 실무에서 사용하는 UX 디자인 프로세스를 단계별로 학습합니다.',
 NULL,
 NOW()),
('33333333-3333-3333-3333-333333333333',
 '디자인 시스템 구축 가이드',
 '일관성 있는 디자인을 위한 디자인 시스템 구축 방법을 배우고, 실제 사례를 통해 실무 적용 능력을 키웁니다.',
 NULL,
 NOW())
ON CONFLICT (id) DO NOTHING;

-- Clear existing curriculum items for curriculum 1
DELETE FROM curriculum_items WHERE curriculum_id = '11111111-1111-1111-1111-111111111111';

-- Insert Curriculum Items for Curriculum 1: UX/UI 디자인 기초
INSERT INTO curriculum_items (id, curriculum_id, article_id, sequence, curator_note, created_at) VALUES
('c1-1', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111112', 1,
 'UX와 UI의 차이를 명확히 이해하는 것이 첫 단계입니다. 실제 사례를 통해 개념을 익혀보세요.',
 NOW()),
('c1-2', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111114', 2,
 'Adobe에서 제시하는 15가지 원칙은 UX 디자인의 기본기를 다지는 데 필수적입니다.',
 NOW()),
('c1-3', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 3,
 '2025년 최신 트렌드를 파악하면 현업에서 요구되는 디자인 방향을 이해할 수 있습니다.',
 NOW()),
('c1-4', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111113', 4,
 'AI 도구를 활용하면 디자인 작업의 효율성을 크게 높일 수 있습니다. 실무에 바로 적용해보세요.',
 NOW());

-- Insert Curriculum Items for Curriculum 2: UX 디자인 프로세스
INSERT INTO curriculum_items (id, curriculum_id, article_id, sequence, curator_note, created_at) VALUES
('c2-1', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222221', 1,
 'UX 디자인 프로세스의 전체 흐름을 먼저 파악하면 각 단계의 목적을 이해하기 쉽습니다.',
 NOW()),
('c2-2', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 2,
 '다양한 디자인 방법론을 알아두면 프로젝트 특성에 맞는 프로세스를 선택할 수 있습니다.',
 NOW()),
('c2-3', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222224', 3,
 'UX 리서치는 사용자 중심 디자인의 핵심입니다. 체계적인 리서치 방법을 익혀보세요.',
 NOW()),
('c2-4', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222223', 4,
 '15년 경력자의 실무 경험담에서 프로세스 적용의 실제 노하우를 배울 수 있습니다.',
 NOW());

-- Insert Curriculum Items for Curriculum 3: 디자인 시스템
INSERT INTO curriculum_items (id, curriculum_id, article_id, sequence, curator_note, created_at) VALUES
('c3-1', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333332', 1,
 '디자인 시스템의 필요성과 기본 개념을 먼저 이해하고 시작하세요.',
 NOW()),
('c3-2', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333331', 2,
 '디자인 시스템 가이드 작성 방법을 익히면 일관성 있는 디자인을 유지할 수 있습니다.',
 NOW()),
('c3-3', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333334', 3,
 '실무에서 자주 사용하는 UI 컴포넌트를 학습하면 디자인 시스템 구축이 쉬워집니다.',
 NOW()),
('c3-4', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 4,
 '실제 기업의 디자인 시스템 구축 사례를 통해 실무 적용 방법을 배워보세요.',
 NOW());

-- Verify the data
SELECT 'Articles created:' as status, COUNT(*) as count FROM articles WHERE id LIKE 'a%-%-%-%-%';
SELECT 'Curriculums created:' as status, COUNT(*) as count FROM curriculums WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
SELECT 'Curriculum items created:' as status, COUNT(*) as count FROM curriculum_items WHERE id LIKE 'c%';
