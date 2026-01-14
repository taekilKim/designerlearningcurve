# Designer Learning Curve

디자이너를 위한 아티클 큐레이션 및 커리큘럼 학습 플랫폼 MVP

## 📋 프로젝트 개요

Designer Learning Curve는 아티클을 순서 있는 커리큘럼으로 제공하여 학습 완주를 돕는 웹 서비스입니다.

**핵심 철학:**
- Context over Content (콘텐츠보다 맥락)
- Frictionless (마찰 없는 탐색)

## 🛠️ 기술 스택

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Font:** Pretendard
- **Backend & Auth:** Supabase
- **Deployment:** Vercel (예정)

## 🚀 시작하기

### 1. 프로젝트 클론 및 설치

```bash
npm install
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 URL과 Anon Key 복사

### 3. 환경 변수 설정

`.env.local` 파일에 Supabase 정보 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 데이터베이스 스키마 설정

Supabase 대시보드의 SQL Editor에서 다음 파일을 순서대로 실행:

1. `supabase/schema.sql` - 테이블 및 RLS 정책 생성
2. `supabase/seed.sql` - 샘플 데이터 삽입

### 5. Supabase Auth 설정

Supabase 대시보드 > Authentication > Providers에서:

1. **Google OAuth 활성화**
   - Google Cloud Console에서 OAuth 클라이언트 생성
   - Authorized redirect URIs에 추가:
     - `https://your-project-id.supabase.co/auth/v1/callback`
   - Client ID와 Client Secret을 Supabase에 입력

2. **Site URL 설정** (Authentication > URL Configuration)
   - Site URL: `http://localhost:3000` (개발) 또는 프로덕션 URL
   - Redirect URLs에 추가:
     - `http://localhost:3000/auth/callback`
     - `https://your-production-url.com/auth/callback`

### 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 📁 프로젝트 구조

```
app/
├── (public)/              # 누구나 접근 가능
│   ├── page.tsx          # 홈 - 아티클 큐레이션
│   └── curriculums/      # 커리큘럼 목록 및 상세
├── (private)/            # 로그인 필요
│   └── my-learning/      # 내 학습 대시보드
└── auth/callback/        # OAuth 콜백

components/
├── ui/                   # shadcn 컴포넌트
├── shared/              # 공통 컴포넌트 (GNB 등)
├── curriculum/          # 커리큘럼 관련
└── learning/            # 학습하기 관련

lib/
├── supabase/            # Supabase 클라이언트
└── utils.ts             # 유틸리티

supabase/
├── schema.sql           # 데이터베이스 스키마
└── seed.sql             # 샘플 데이터
```

## 🎯 주요 기능

### 1. 아티클 큐레이션 (Home)
- 엄선된 디자인 아티클을 그리드 형식으로 탐색
- 외부 링크로 바로 이동

### 2. 커리큘럼 탐색
- 난이도별 커리큘럼 목록 확인
- 커리큘럼 상세 정보 및 학습 내용 미리보기
- "커리큘럼 시작하기" 버튼으로 등록

### 3. 내 학습 (My Learning)
- Accordion UI로 등록한 커리큘럼 관리
- 체크박스로 학습 진행 상황 추적
- Progress Bar로 진척도 시각화
- 큐레이터 노트로 학습 가이드 제공

### 4. 인증 (Authentication)
- Google OAuth 로그인
- 보호된 라우트 접근 제어
- 자동 프로필 생성

## 🔐 보안 및 권한

- Row Level Security (RLS) 정책 적용
- 인증된 사용자만 학습 데이터 수정 가능
- 공개 데이터(아티클, 커리큘럼)는 누구나 조회 가능

## 📝 데이터베이스 스키마

주요 테이블:
- `profiles` - 사용자 프로필
- `articles` - 아티클 정보
- `curriculums` - 커리큘럼 정보
- `curriculum_items` - 커리큘럼별 아티클 목록
- `enrollments` - 사용자의 커리큘럼 등록 정보
- `completed_items` - 완료한 아티클 기록

## 🚢 배포

### 🌐 웹에서 보기

이 프로젝트를 Vercel에 배포하여 웹에서 바로 사용할 수 있습니다.

**상세 배포 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md) 참조

### 빠른 배포 (3분 완성)

1. **Supabase 설정**
   - Supabase에서 프로젝트 생성
   - SQL Editor에서 `supabase/schema.sql` 및 `supabase/seed.sql` 실행
   - API 키 복사

2. **Vercel 배포**
   - Vercel에서 GitHub 저장소 임포트
   - 환경 변수 설정:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - 배포 시작

3. **OAuth 설정**
   - Google Cloud Console에서 OAuth Client 생성
   - Supabase에 Google OAuth 연동
   - Redirect URLs 업데이트

자세한 단계별 가이드는 **[DEPLOYMENT.md](./DEPLOYMENT.md)**를 확인하세요.

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/taekilKim/designerlearningcurve&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

## 🤝 기여하기

이 프로젝트는 MVP 단계입니다. 개선 사항이나 버그 리포트는 이슈로 등록해주세요.

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Built with ❤️ by Designer Learning Curve Team
