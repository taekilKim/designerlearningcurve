# Designer Learning Curve - Project Context

## Project Overview
디자이너를 위한 학습 플랫폼 MVP. 아티클을 커리큘럼으로 큐레이션하여 체계적 학습 지원.
- **철학**: Context over Content, Frictionless Exploration

## Tech Stack
- **Frontend**: Next.js 16.1.1, React 19, TypeScript 5, Tailwind CSS 4
- **UI**: shadcn/ui, Radix UI, Lucide/Phosphor Icons, TipTap (Rich Text)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Auth**: Google OAuth via Supabase
- **Font**: Pretendard (Korean-optimized)

## Project Structure
```
app/
  (public)/          # 홈(아티클 그리드), 커리큘럼 목록/상세
  (private)/         # 내 학습 대시보드, 커리큘럼 상세(진도+노트)
  admin/             # 관리자 대시보드, 아티클/커리큘럼 CRUD
components/
  ui/                # shadcn/ui 컴포넌트
  shared/            # GNB, Bottom Nav
  home/              # ArticleCard, CategorySidebar
  curriculum/        # EnrollButton
  learning/          # EnrollmentCard, ArticleList, NoteEditor, actions
  admin/             # AdminNav, ArticleForm, CurriculumForm, CategoryManager, actions
lib/supabase/        # client.ts, server.ts
supabase/            # schema.sql, seed.sql, migrations/
```

## Database (7+ tables)
profiles, articles, curriculums, curriculum_items, enrollments, completed_items, learning_notes, categories
- RLS 정책: 공개 읽기(articles/curriculums), 유저별 제한(enrollments/notes), Admin 전용 쓰기

## Completed Features

### v1.0.0 (1/10) — MVP
- [x] 홈페이지 아티클 큐레이션 그리드
- [x] 커리큘럼 목록/상세 (공개)
- [x] Google OAuth 로그인
- [x] 커리큘럼 수강신청 & 내 학습 대시보드
- [x] 미들웨어 라우트 보호

### v1.1.0 (1/21) — 관리자 & 학습노트
- [x] 관리자 패널 (아티클/커리큘럼 CRUD)
- [x] TipTap 리치 텍스트 학습 노트 (수동 저장)
- [x] 아티클 완료 체크 & 진도율 추적
- [x] 모바일 Bottom Navigation
- [x] 커리큘럼별 노트 (아티클별에서 변경)

### v1.2.0 (1/22~23) — UI 리디자인 & 카테고리
- [x] 내 학습 페이지 카드 그리드 + 상세페이지 리팩토링
- [x] 샘플 데이터 (12 아티클, 2 커리큘럼)
- [x] 모바일 줌 방지 (viewport + CSS + JS)
- [x] 홈페이지 카테고리 사이드바 & 아티클 카드 리디자인
- [x] 커리큘럼 페이지 풀스크린 레이아웃 & 카드 리디자인
- [x] 아티클 메타데이터 자동 추출 (URL → 제목/썸네일)
- [x] 아티클 메타데이터 일괄 업데이트
- [x] 인피니트 스크롤 (아티클 & 커리큘럼)
- [x] 관리자 패널 오버홀 — DB 기반 카테고리 관리 시스템
- [x] 하드코딩 카테고리 → DB 연동 전환
- [x] 모든 HTTPS 도메인 이미지 허용 & 레이지 로딩

## Current Status
- 브랜치: claude/designer-learning-platform-LwTXG
- 상태: Clean (16c9d9c 푸시 완료)
- 마지막 작업 (2/10): 100개 대량 수집, 소스별 라운드로빈, 해외 소스 제거

## Development Commands
```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## Session Log
### 2026-02-09 Session 1
- 프로젝트 전체 히스토리 파악 (68개 커밋, 1/10~1/23)
- 로컬 브랜치 34커밋 뒤처짐 발견 → pull로 최신화
- CLAUDE.md 생성, /session-summary 커맨드 설정, MEMORY.md 업데이트
- **카드 레이아웃 리디자인**: 스크린샷 기반으로 미니멀 디자인 적용
  - 파비콘 아이콘, 저자|날짜, 카테고리 텍스트 링크
  - 4열 그리드 (xl:grid-cols-4)
- **아티클 자동수집 시스템 구축**:
  - `/api/cron/fetch-articles` — RSS 피드 기반 수집 + 중복 체크 + DB 삽입
  - Vercel Cron 매 시간 실행 (`0 * * * *`)
  - Resend 이메일 알림 → taekil.design@gmail.com
  - `/api/test-insert-articles` — 테스트용 5개 아티클 즉시 삽입
- Resend API 키 설정 완료 (Vercel + .env.local)
- 로그아웃/관리자 메뉴 이슈 조사 (url 직접 접근은 작동 확인, 수정 보류)

- **빌드 에러 수정**: Supabase 클라이언트 env 변수 없을 때 placeholder로 대체 (508886f)
- **로그아웃 서버 액션 전환**: GNB + BottomNav 모두 form action → signOutAction (508886f)
- **관리자 메뉴**: checkAdminStatus 에러 핸들링 강화 (508886f)

### 2026-02-09 Session 2 (continued 2/10)
- **Vercel Cron 유료 플랜 이슈**: crons 설정 제거 → 외부 cron-job.org 사용 (3dc945b)
- **RLS 차단 이슈**: API 라우트에서 articles INSERT 실패 → `lib/supabase/admin.ts` service role 클라이언트 생성 (02c873b)
- **아티클 수집 범위 대폭 확장** (d03fea6):
  - RSS 소스 6개 → 19개 (브런치 12개 키워드, 요즘IT, Medium 3개, velog 3개)
  - `classifyCategory()`: 키워드 기반 12개 카테고리 자동 분류
  - `scoreRelevance()`: 디자인 테크닉 우선 스코어링 (원리/테크닉 +3, 도구/트렌드 -1)
- **최신 등록순 정렬** (015e79b):
  - 아티클 공개 페이지: `published_at` → `created_at` DESC 정렬
  - 어드민 아티클/커리큘럼 목록 테이블에 "등록일" 컬럼 추가
- **미디엄 비중 낮춤** (459d2db): 해외 아티클 스코어 -3 패널티 (번역 필요 → 학습 난이도 상승)
- **RSS 소스 대폭 확장** (dd6cd95): 19→40개 소스
  - 국내 IT 기업 블로그 10개 (토스, 당근, 배민, 카카오, 네이버D2, 뱅크샐러드, 딜라이트룸, 강남언니, 쿠팡, 여기어때)
  - 디자인 커뮤니티 3개 (서핏, 요즘IT, DISQUIET)
  - 도메인별 스코어링 (국내 디자인 +3, 국내 테크 +2, 해외 Medium -3)
  - Atom 피드 파싱 추가 (네이버 D2)
- **구글 뉴스 제거** (6b1d632): 리다이렉트 URL 문제 (실제 랜딩 페이지 대신 news.google.com URL 반환)
- **카테고리 라운드로빈** (f411429): 한 분야 10개 집중 → 카테고리별 균등 수집
- **소스 정리 + 개발글 필터링** (dfb520c):
  - pxd, 디지털인사이트, lycorp 소스 제거
  - 개발 전용 키워드 -10 패널티 (backend, k8s, docker, SQL 등)
- **키워드 확장** (423943b): classifyCategory/scoreRelevance에 UX리서치, 디자인 방법론, HMW, 페르소나, 저니맵 등 추가

- **100개 대량 수집** (b482b6d): 일회성 bulk-collect 엔드포인트로 초기 아티클 확보
- **소스별 라운드로빈** (9010779): 카테고리별 → 소스 도메인별 라운드로빈 (같은 소스 독식 방지)
- **해외 Medium 소스 제거** (16c9d9c): 해외 아티클은 별도 로드맵으로 분리 예정

#### Pending
- SUPABASE_SERVICE_ROLE_KEY Vercel 환경변수 확인 필요 (500 에러 원인)
- cron-job.org 스케줄: 하루 2회 (9am, 3pm KST)로 변경 완료
- 로그아웃 & 관리자 메뉴 프로덕션 동작 확인

## Roadmap

### Phase 0: SEO & 검색엔진 최적화 ← 현재
- [ ] 페이지별 메타 태그 (title, description, og:image, twitter:card)
- [ ] 동적 OG 이미지 생성 (아티클/커리큘럼별)
- [ ] sitemap.xml 자동 생성
- [ ] robots.txt 설정
- [ ] 구조화 데이터 (JSON-LD: Article, Course)
- [ ] 네이버 서치어드바이저 / 구글 서치 콘솔 등록
- [ ] 노출 채널: 네이버 블로그, 디자이너 커뮤니티, SNS 공유 최적화

### Phase 1: 콘텐츠 탐색 강화
- [ ] 아티클 검색 (제목/설명 키워드)
- [ ] 북마크 (로그인 유저 아티클 저장)
- [ ] 아티클 상세 미리보기

### Phase 2: 학습 경험 고도화
- [ ] 학습 진도 대시보드 개선 (주간/월간 시각화)
- [ ] 커리큘럼 기반 관련 아티클 추천
- [ ] 커리큘럼 난이도별 필터

### Phase 3: 해외 아티클 & 번역
- [ ] 해외 아티클 전용 탭 (Medium, Smashing Magazine 등)
- [ ] LLM API 자동 번역 (제목/설명 한국어)
- [ ] 원문 링크 병행 제공

### Phase 4: 커뮤니티 & 성장
- [ ] 아티클 코멘트/메모 공유
- [ ] 인기 아티클 랭킹
- [ ] 주간 큐레이션 뉴스레터

### Phase 5: 수익화 & 확장
- [ ] 프리미엄 커리큘럼
- [ ] 디자이너 멘토링 매칭
- [ ] 기업용 팀 학습 관리
