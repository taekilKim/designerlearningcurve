-- Sample UX/UI articles and curriculums for Designer Learning Curve
-- Run this in Supabase SQL Editor

-- Add thumbnail_url column to curriculums and articles if it doesn't exist
ALTER TABLE curriculums ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Insert Articles
INSERT INTO articles (id, title, url, description, author, thumbnail_url, created_at) VALUES
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

-- === Additional Articles for New Curriculums ===

-- 디자인 철학과 마인드셋 Articles
INSERT INTO articles (id, title, url, description, author, thumbnail_url, created_at) VALUES
('a4444444-4444-4444-4444-444444444441',
 '2025년 UX/UI 디자이너가 갖춰야할 4가지 역량',
 'https://www.mobiinside.co.kr/2025/01/10/uxui-designer-competence/',
 'AI 시대에 UX/UI 디자이너가 반드시 갖춰야 할 4가지 핵심 역량: LLM 프롬프트 엔지니어링, 자동화 시스템 구축, 이미지 모델 활용, UI 상세 디자인 도구 활용',
 '모비인사이드',
 NOW()),
('a4444444-4444-4444-4444-444444444442',
 '2024년을 향하는 UX/UI 디자인 트렌드',
 'https://lab.dongri.me/p/2024-uxui',
 '동그리 연구소에서 제시하는 2024년 UX/UI 디자인 트렌드와 디자이너의 사고방식 변화',
 '동그리 연구소',
 NOW()),
('a4444444-4444-4444-4444-444444444443',
 '분석적 사고만 중요한 게 아니다. 디자인 씽킹 문제 해결 사례 3가지',
 'https://www.longblack.co/f/design_thinking',
 '실제 디자인 씽킹을 활용한 문제 해결 사례를 통해 디자이너의 사고 방식을 배웁니다',
 'Longblack',
 NOW()),
('a4444444-4444-4444-4444-444444444444',
 '2025 UX 디자인 트렌드 총정리',
 'https://planez.kr/entry/2025-UX-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8A%B8%EB%A0%8C%EB%93%9C-%EC%B4%9D%EC%A0%95%EB%A6%AC-%E2%80%93-%EA%B8%B0%ED%9A%8D%EC%9E%90%EB%9D%BC%EB%A9%B4-%EB%B0%98%EB%93%9C%EC%8B%9C-%EC%95%8C%EC%95%84%EC%95%BC-%ED%95%A0-7%EA%B0%80%EC%A7%80-%EB%B3%80%ED%99%94',
 '기획자와 디자이너가 반드시 알아야 할 2025년 UX 디자인의 7가지 주요 변화와 트렌드',
 '플래니지',
 NOW());

-- 레퍼런스 수집과 활용 Articles
INSERT INTO articles (id, title, url, description, author, thumbnail_url, created_at) VALUES
('a5555555-5555-5555-5555-555555555551',
 '디자인 레퍼런스 사이트들의 장단점',
 'https://brunch.co.kr/@b173b5d6754b4b4/7',
 '핀터레스트, 비핸스, 드리블 등 주요 레퍼런스 사이트의 특징과 장단점을 상세히 비교합니다',
 'Brunch',
 NOW()),
('a5555555-5555-5555-5555-555555555552',
 '디자이너가 추천하는 레퍼런스 사이트',
 'https://brunch.co.kr/@sarayun/24',
 '현직 디자이너가 실무에서 자주 사용하는 다양한 레퍼런스 사이트를 소개합니다',
 'Brunch - sarayun',
 NOW()),
('a5555555-5555-5555-5555-555555555553',
 '웹에서 찾은 레퍼런스, 어떻게 관리하세요?',
 'https://slowalk.com/2392',
 '레퍼런스를 효율적으로 수집하고 체계적으로 관리하는 방법과 도구를 소개합니다',
 'slowalk',
 NOW()),
('a5555555-5555-5555-5555-555555555554',
 '현직 디자이너가 추천하는 UXUI 레퍼런스 사이트',
 'https://brunch.co.kr/@renajang/10',
 'UXUI 디자이너가 실무에서 활용하는 필수 레퍼런스 사이트와 활용 팁',
 'Brunch - renajang',
 NOW());

-- 사용자 리서치 실무 Articles
INSERT INTO articles (id, title, url, description, author, thumbnail_url, created_at) VALUES
('a6666666-6666-6666-6666-666666666661',
 '토스가 사용자 경험에 집착하는 방법',
 'https://blog.toss.im/article/user-research-team-interview',
 '토스 UX 리서처 인터뷰: User Test, 심층 인터뷰, FGI, 설문조사를 통한 사용자 경험 연구',
 '토스',
 NOW()),
('a6666666-6666-6666-6666-666666666662',
 '사용자 인터뷰를 진행하는 방법',
 'https://medium.com/plusx-ux-lab/%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B8%ED%84%B0%EB%B7%B0%EB%A5%BC-%EC%A7%84%ED%96%89%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-6d26dc59c0e6',
 '사용자의 생각을 캐내는 인터뷰 진행 방법과 실전 팁 (PlusX UX Lab)',
 'Medium - PlusX UX Lab',
 NOW()),
('a6666666-6666-6666-6666-666666666663',
 '사용자 인터뷰는 어떻게 준비해야 하나요?',
 'https://medium.com/plusx-ux-lab/%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B8%ED%84%B0%EB%B7%B0%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%A4%80%EB%B9%84%ED%95%B4%EC%95%BC-%ED%95%98%EB%82%98%EC%9A%94-669ea3499085',
 '사용자 인터뷰 준비부터 실행까지, 행동 패턴과 동기를 파악하는 방법 (생각을 캐내는 방법 1부)',
 'Medium - PlusX UX Lab',
 NOW()),
('a6666666-6666-6666-6666-666666666664',
 'UX 디자이너가 반드시 알아야 할 UX 리서치 기법 A-Z',
 'https://brunch.co.kr/@ebprux/621',
 '관찰법, 인터뷰, 설문조사 등 UX 리서치의 모든 기법을 총정리한 완전 가이드',
 'Brunch - ebprux',
 NOW());

-- 문제 정의와 가설 설정 Articles
INSERT INTO articles (id, title, url, description, author, thumbnail_url, created_at) VALUES
('a7777777-7777-7777-7777-777777777771',
 '디자인 씽킹으로 문제 해결하기',
 'https://brunch.co.kr/@donkim/63',
 '정답 없는 복잡한 문제를 디자인 씽킹으로 해결하는 H3-R5 프로세스',
 'Brunch - donkim',
 NOW()),
('a7777777-7777-7777-7777-777777777772',
 'HMW(How Might We) 기법 완전 정복',
 'https://designkit.skcc.com/HMW',
 'SK C&C의 디자인킷: HMW 질문으로 문제를 기회로 전환하는 방법',
 'SK C&C Design Kit',
 NOW()),
('a7777777-7777-7777-7777-777777777773',
 '디자인 씽킹 ④ - 아이디어는 혼자가 아닌 함께 만드는 것',
 'https://www.samsungsds.com/global/ko/support/insights/Design-Thinking-4.html',
 '삼성SDS의 디자인 씽킹 시리즈: 협업을 통한 아이디어 발상과 문제 정의',
 '삼성SDS',
 NOW()),
('a7777777-7777-7777-7777-777777777774',
 '디자인 씽킹 기법으로 아이디어 시각화하기',
 'https://epart.com/%EB%94%94%EC%9E%90%EC%9D%B8-%EC%94%BD%ED%82%B9-%EA%B8%B0%EB%B2%95%EC%9C%BC%EB%A1%9C-%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%EB%A5%BC-%EC%8B%9C%EA%B0%81%ED%99%94%ED%95%98%EA%B3%A0-%ED%98%91%EC%97%85/',
 '실무 중심의 디자인 씽킹 워크숍: 문제 해결과 협업 확장 방법',
 'epart',
 NOW());

-- === Create New Curriculums ===
INSERT INTO curriculums (id, title, description, thumbnail_url, created_at) VALUES
('44444444-4444-4444-4444-444444444444',
 '디자인 철학과 마인드셋',
 'AI 시대에 필요한 디자이너의 역량과 사고방식을 배웁니다. 단순히 도구를 다루는 것을 넘어, 디자인 철학과 문제 해결 사고를 키웁니다.',
 NULL,
 NOW()),
('55555555-5555-5555-5555-555555555555',
 '레퍼런스 수집과 활용',
 '핀터레스트, 비핸스, 드리블 등 주요 레퍼런스 사이트를 활용하는 방법과 수집한 레퍼런스를 체계적으로 관리하는 노하우를 배웁니다.',
 NULL,
 NOW()),
('66666666-6666-6666-6666-666666666666',
 '사용자 리서치 실무',
 '사용자 인터뷰, 관찰, 설문조사 등 실무에서 바로 활용할 수 있는 사용자 리서치 방법론을 실전 예시와 함께 학습합니다.',
 NULL,
 NOW()),
('77777777-7777-7777-7777-777777777777',
 '문제 정의와 가설 설정',
 '디자인 씽킹과 HMW 기법을 활용하여 복잡한 문제를 명확히 정의하고, 해결 가능한 가설을 수립하는 방법을 배웁니다.',
 NULL,
 NOW())
ON CONFLICT (id) DO NOTHING;

-- === Insert Curriculum Items for New Curriculums ===

-- Curriculum 4: 디자인 철학과 마인드셋
INSERT INTO curriculum_items (id, curriculum_id, article_id, sequence, curator_note, created_at) VALUES
('c4-1', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444442', 1,
 'UX/UI 디자인 트렌드를 파악하면서 디자이너의 사고방식이 어떻게 변화하고 있는지 이해하세요.',
 NOW()),
('c4-2', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444441', 2,
 'AI 시대에 디자이너가 갖춰야 할 4가지 핵심 역량을 학습하고 경쟁력을 키우세요.',
 NOW()),
('c4-3', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444443', 3,
 '디자인 씽킹을 통한 실제 문제 해결 사례로 분석적 사고를 넘어선 통찰력을 배웁니다.',
 NOW()),
('c4-4', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 4,
 '2025년 UX 디자인의 주요 변화를 파악하고 미래를 준비하세요.',
 NOW());

-- Curriculum 5: 레퍼런스 수집과 활용
INSERT INTO curriculum_items (id, curriculum_id, article_id, sequence, curator_note, created_at) VALUES
('c5-1', '55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555551', 1,
 '핀터레스트, 비핸스, 드리블의 장단점을 파악하고 상황에 맞게 활용하세요.',
 NOW()),
('c5-2', '55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555552', 2,
 '현직 디자이너가 추천하는 다양한 레퍼런스 사이트를 탐색해보세요.',
 NOW()),
('c5-3', '55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555553', 3,
 '수집한 레퍼런스를 체계적으로 관리하는 방법과 도구를 익히세요.',
 NOW()),
('c5-4', '55555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555554', 4,
 'UXUI 실무에 특화된 레퍼런스 사이트 활용 팁을 배워보세요.',
 NOW());

-- Curriculum 6: 사용자 리서치 실무
INSERT INTO curriculum_items (id, curriculum_id, article_id, sequence, curator_note, created_at) VALUES
('c6-1', '66666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666664', 1,
 '관찰, 인터뷰, 설문 등 UX 리서치의 모든 기법을 먼저 전체적으로 파악하세요.',
 NOW()),
('c6-2', '66666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666663', 2,
 '사용자 인터뷰 준비 단계부터 차근차근 배워나가세요.',
 NOW()),
('c6-3', '66666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666662', 3,
 '실제 인터뷰 진행 방법과 사용자의 생각을 캐내는 팁을 익히세요.',
 NOW()),
('c6-4', '66666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666661', 4,
 '토스의 실제 사례를 통해 사용자 경험 리서치를 어떻게 실무에 적용하는지 배웁니다.',
 NOW());

-- Curriculum 7: 문제 정의와 가설 설정
INSERT INTO curriculum_items (id, curriculum_id, article_id, sequence, curator_note, created_at) VALUES
('c7-1', '77777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777771', 1,
 '복잡한 문제를 해결하기 위한 디자인 씽킹 프로세스의 기초를 다집니다.',
 NOW()),
('c7-2', '77777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777772', 2,
 'HMW 질문으로 문제를 기회로 전환하는 핵심 기법을 익히세요.',
 NOW()),
('c7-3', '77777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777773', 3,
 '협업을 통해 더 나은 아이디어를 만들어내는 방법을 배웁니다.',
 NOW()),
('c7-4', '77777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777774', 4,
 '실무 워크숍 사례를 통해 디자인 씽킹을 실제로 적용하는 방법을 익힙니다.',
 NOW());

-- Verify the data
SELECT 'Articles created:' as status, COUNT(*) as count FROM articles WHERE id LIKE 'a%-%-%-%-%';
SELECT 'Curriculums created:' as status, COUNT(*) as count FROM curriculums WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
SELECT 'Curriculum items created:' as status, COUNT(*) as count FROM curriculum_items WHERE id LIKE 'c%';
