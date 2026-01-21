# Changelog

모든 주요 변경 사항은 이 파일에 기록됩니다.

이 프로젝트는 [Semantic Versioning](https://semver.org/lang/ko/)을 따릅니다.

---

## [1.0.1] - 2026-01-14

### 📚 Documentation (문서화)

#### 배포 가이드 추가
- **DEPLOYMENT.md**: 상세한 웹 배포 가이드 작성
  - Supabase 프로젝트 설정 단계
  - Google OAuth 설정 방법
  - Vercel 배포 프로세스
  - 커스텀 도메인 설정 가이드
  - 문제 해결 섹션
  - 배포 체크리스트

- **README.md** 개선
  - 배포 섹션 확장
  - "Deploy with Vercel" 버튼 추가
  - DEPLOYMENT.md 링크 추가

#### 설정 파일
- **vercel.json**: Vercel 배포 설정
  - 빌드 명령 지정
  - Seoul 리전 설정
- **.env.example**: 환경 변수 템플릿
  - Supabase URL 및 Anon Key 예제
- **.gitignore** 수정: .env.example 허용

#### PR 템플릿
- **.github/PULL_REQUEST_TEMPLATE.md**: 표준화된 PR 템플릿

### 🎯 Impact

이 패치를 통해 사용자는:
- 3분 만에 Vercel에 프로젝트를 배포할 수 있습니다
- 단계별 가이드를 따라 쉽게 설정할 수 있습니다
- 환경 변수 템플릿으로 빠르게 시작할 수 있습니다

---

## [1.0.0] - 2026-01-10

### 🎉 Initial Release - MVP

디자이너 학습 플랫폼의 첫 번째 MVP 버전이 출시되었습니다.

### ✨ Added (추가된 기능)

#### 프로젝트 초기 설정
- Next.js 14+ (App Router) 프로젝트 구조
- TypeScript 설정
- Tailwind CSS 통합
- shadcn/ui 컴포넌트 라이브러리
- Pretendard 폰트 적용 (CDN)
- Lucide React 아이콘 라이브러리
- ESLint 설정

#### 인증 시스템
- Supabase Auth 통합
- Google OAuth 로그인 지원
- 보호된 라우트 미들웨어 (`middleware.ts`)
- 자동 프로필 생성 (Database Trigger)
- Auth callback 핸들러 (`/auth/callback`)
- 세션 관리 (Server & Client)

#### Public 페이지
- **홈 페이지 (`/`)**
  - 아티클 큐레이션 그리드 레이아웃
  - 외부 링크로 아티클 열기
  - 썸네일 이미지 지원 (Unsplash)
  - Broken image 처리
  - 반응형 디자인 (모바일/태블릿/데스크톱)

- **커리큘럼 목록 (`/curriculums`)**
  - 커리큘럼 카드 그리드
  - 난이도 Badge (초급/중급/고급)
  - 예상 학습 시간 표시
  - 아티클 개수 표시

- **커리큘럼 상세 (`/curriculums/[id]`)**
  - 커리큘럼 정보 및 설명
  - 학습 내용 미리보기
  - 큐레이터 노트 표시
  - "커리큘럼 시작하기" 버튼
  - 등록 여부에 따른 버튼 상태 변경

#### Private 페이지
- **내 학습 (`/my-learning`)**
  - Accordion UI로 커리큘럼 관리
  - 체크박스로 학습 진행 상황 추적
  - Progress Bar로 진척도 시각화
  - 큐레이터 노트 표시
  - 외부 링크로 아티클 열기
  - Optimistic UI 업데이트
  - 실시간 진척도 재계산

#### 컴포넌트
- **GNB (Global Navigation Bar)**
  - 로고 및 네비게이션 메뉴
  - 로그인/로그아웃 버튼
  - 사용자 이메일 표시
  - 반응형 레이아웃

- **EnrollButton**
  - 커리큘럼 등록 기능
  - 로그인 상태에 따른 동작 분기
  - 등록 완료 후 리다이렉트
  - Toast 알림

- **LearningAccordion**
  - 등록한 커리큘럼 관리
  - 학습 완료 체크박스
  - Progress Bar
  - Optimistic UI

#### 데이터베이스 (Supabase)
- **테이블 스키마 (`supabase/schema.sql`)**
  - `profiles`: 사용자 프로필
  - `articles`: 아티클 정보
  - `curriculums`: 커리큘럼 정보
  - `curriculum_items`: 커리큘럼-아티클 매핑
  - `enrollments`: 사용자-커리큘럼 등록 정보
  - `completed_items`: 완료한 아티클 기록

- **RLS (Row Level Security) 정책**
  - Public 읽기: articles, curriculums, curriculum_items
  - Private 읽기/쓰기: enrollments, completed_items
  - 사용자별 데이터 격리

- **Database Triggers**
  - 신규 사용자 가입 시 프로필 자동 생성
  - updated_at 컬럼 자동 업데이트

- **Indexes**
  - curriculum_items 조회 최적화
  - enrollments 조회 최적화
  - completed_items 조회 최적화

#### 샘플 데이터 (`supabase/seed.sql`)
- 12개 아티클
  - 타이포그래피 관련 5개
  - UX 리서치 관련 5개
  - 기타 디자인 관련 2개
- 2개 커리큘럼
  - "주니어 디자이너를 위한 타이포그래피 기초" (초급, 5개 아티클)
  - "UX 리서치 시작하기" (중급, 5개 아티클)

#### UI/UX Features
- shadcn/ui 컴포넌트 사용
  - Button, Card, Badge, Progress
  - Accordion, Checkbox, Separator
  - Sheet, Navigation Menu, Sonner (Toast)
- 반응형 디자인 (Mobile First)
- 다크모드 준비 (tailwind.config)
- Pretendard 폰트 적용
- 일관된 스페이싱 및 타이포그래피

#### Developer Experience
- TypeScript strict mode
- Server Components 기본 사용
- Server Actions (`components/learning/actions.ts`)
- Route Groups (`(public)`, `(private)`)
- Dynamic Routes (`[id]`)
- Middleware for Auth
- Optimistic UI pattern

#### Documentation
- **README.md**
  - 프로젝트 개요 및 철학
  - 기술 스택 설명
  - 설치 및 설정 가이드
  - Supabase 설정 방법
  - Google OAuth 설정 방법
  - 프로젝트 구조
  - 주요 기능 설명
  - 배포 가이드

- **CHANGELOG.md**
  - 버전 히스토리 기록

### 🔧 Technical Details

#### Image Optimization
- Next.js Image component 사용
- Remote patterns 설정
  - images.unsplash.com
  - **.cdninstagram.com
  - brunch.co.kr
  - medium.com
- Broken image fallback 처리

#### Performance
- Server Components로 초기 로딩 속도 최적화
- Optimistic UI로 사용자 경험 개선
- Database indexes로 쿼리 성능 최적화
- Dynamic routes로 SEO 최적화

#### Security
- Row Level Security (RLS) 정책 적용
- Middleware로 보호된 라우트 접근 제어
- CSRF 보호 (Supabase Auth)
- SQL Injection 방지 (Parameterized Queries)

#### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid & Flexbox

### 📦 Dependencies

#### Production
- next: ^16.1.1
- react: ^19.0.0
- react-dom: ^19.0.0
- @supabase/supabase-js: ^2.48.1
- @supabase/ssr: ^0.6.0
- lucide-react: ^0.468.0
- sonner: ^1.7.3
- tailwindcss: ^4.0.14
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1
- tailwind-merge: ^2.6.0

#### Development
- typescript: ^5.7.2
- @types/node: ^22.10.2
- @types/react: ^19.0.6
- @types/react-dom: ^19.0.2
- eslint: ^9.18.0
- eslint-config-next: ^16.1.1

### 🎯 MVP Scope

이 버전은 MVP(Minimum Viable Product)로, 다음 기능들은 포함되지 않았습니다:
- 댓글 기능
- 좋아요/북마크 기능
- 검색 기능
- 프로필 수정 기능
- 관리자 페이지
- 커리큘럼 추천 알고리즘
- 학습 통계 및 분석
- 소셜 공유 기능
- 알림 기능

### 🐛 Known Issues

- 빌드 시 환경 변수 없이 실행하면 에러 발생 (Supabase URL 필요)
  - 해결: `.env.local` 파일에 환경 변수 설정 필요

### 🔜 Planned for v1.1.0

- [ ] 검색 기능 (아티클, 커리큘럼)
- [ ] 필터링 (난이도, 카테고리)
- [ ] 학습 통계 대시보드
- [ ] 이메일 알림 (커리큘럼 완료 시)
- [ ] 소셜 공유 기능

---

## Version Format

```
[Major].[Minor].[Patch]

Major: 주요 기능 추가 또는 호환성이 깨지는 변경
Minor: 하위 호환성을 유지하는 기능 추가
Patch: 버그 수정 및 사소한 개선
```

## Links

- [GitHub Repository](https://github.com/taekilKim/designerlearningcurve)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
