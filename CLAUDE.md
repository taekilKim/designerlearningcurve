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
- 상태: Clean (de4438f 푸시 완료)
- 마지막 작업 (2/9): 카드 리디자인, 아티클 자동수집 시스템, Resend 이메일 연동

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

#### Next Steps
- 테스트 엔드포인트 호출하여 5개 아티클 DB 삽입 + 이메일 발송 확인
- 로그아웃 버튼 수정 (서버 액션 signOutAction으로 전환)
- 관리자 메뉴 미표시 문제 디버깅
- 빌드 에러 수정 (Next.js 16 /_global-error 이슈)
