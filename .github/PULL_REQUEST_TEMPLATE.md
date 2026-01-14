# Pull Request: 디자이너 학습 플랫폼 MVP v1.0.0

## 📋 Summary

디자이너를 위한 아티클 큐레이션 및 커리큘럼 학습 플랫폼의 첫 번째 MVP 버전입니다.

**핵심 철학:**
- 🎯 Context over Content (콘텐츠보다 맥락)
- ✨ Frictionless (마찰 없는 탐색)

## 🎉 주요 기능

### 1. 아티클 큐레이션 (홈)
- 엄선된 디자인 아티클을 그리드 형식으로 탐색
- 외부 링크로 바로 이동
- 썸네일 이미지 지원
- 반응형 디자인

### 2. 커리큘럼 시스템
- **목록 페이지**: 난이도별 커리큘럼 탐색
- **상세 페이지**: 학습 내용 미리보기 및 큐레이터 노트
- **등록 기능**: "커리큘럼 시작하기" 버튼으로 간편 등록

### 3. 내 학습 대시보드
- Accordion UI로 등록한 커리큘럼 관리
- 체크박스로 학습 진행 상황 추적
- Progress Bar로 진척도 시각화
- Optimistic UI로 즉각적인 피드백

### 4. 인증 시스템
- Google OAuth 로그인
- 보호된 라우트 접근 제어
- 자동 프로필 생성

## 🛠️ 기술 스택

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui
- **Icons**: Lucide React
- **Font**: Pretendard
- **Backend**: Supabase (Auth + Database)

## 📦 주요 변경사항

### 커밋 1: feat: 디자이너 학습 플랫폼 MVP 구현 (9048174)
- Next.js 프로젝트 초기화
- Supabase 인증 및 데이터베이스 연동
- Public 페이지 구현 (홈, 커리큘럼 목록/상세)
- Private 페이지 구현 (내 학습)
- 데이터베이스 스키마 및 샘플 데이터
- GNB, 등록 버튼, Accordion 컴포넌트

### 커밋 2: docs: CHANGELOG.md 추가 및 이미지 최적화 설정 (3d5a3bc)
- v1.0.0 버전 히스토리 작성
- 모든 주요 기능 및 변경사항 문서화
- Next.js Image 원격 패턴 설정
- 향후 버전 계획 추가

## 📁 파일 구조

```
app/
├── (public)/          # 누구나 접근 가능
│   ├── page.tsx      # 홈 - 아티클 큐레이션
│   └── curriculums/  # 커리큘럼 목록 및 상세
├── (private)/        # 로그인 필요
│   └── my-learning/  # 내 학습 대시보드
└── auth/callback/    # OAuth 콜백

components/
├── ui/               # shadcn 컴포넌트
├── shared/           # GNB
├── curriculum/       # 등록 버튼
└── learning/         # Accordion, Actions

supabase/
├── schema.sql        # DB 스키마 (RLS 포함)
└── seed.sql          # 샘플 데이터 (12 아티클, 2 커리큘럼)
```

## 📊 데이터베이스

### 테이블 (6개)
- `profiles`: 사용자 프로필
- `articles`: 아티클 정보
- `curriculums`: 커리큘럼 정보
- `curriculum_items`: 커리큘럼-아티클 매핑
- `enrollments`: 사용자-커리큘럼 등록
- `completed_items`: 완료한 아티클 기록

### 보안
- Row Level Security (RLS) 정책 적용
- Public 읽기: articles, curriculums, curriculum_items
- Private 읽기/쓰기: enrollments, completed_items

### 샘플 데이터
- 12개 아티클 (타이포그래피 5개, UX 리서치 5개, 기타 2개)
- 2개 커리큘럼 (타이포그래피 기초, UX 리서치)

## 🚀 설정 방법

### 1. Supabase 프로젝트 생성
```bash
# 1. Supabase에서 새 프로젝트 생성
# 2. SQL Editor에서 supabase/schema.sql 실행
# 3. SQL Editor에서 supabase/seed.sql 실행
```

### 2. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Google OAuth 설정
- Supabase Dashboard > Authentication > Providers
- Google OAuth 활성화 및 Client ID/Secret 입력
- Redirect URLs 설정

### 4. 개발 서버 실행
```bash
npm install
npm run dev
```

## ✅ 체크리스트

- [x] Next.js 14 프로젝트 초기화
- [x] TypeScript 설정
- [x] Tailwind CSS + shadcn/ui 통합
- [x] Pretendard 폰트 적용
- [x] Supabase Auth 구현
- [x] 데이터베이스 스키마 설계
- [x] RLS 정책 적용
- [x] 샘플 데이터 시딩
- [x] 홈 페이지 (아티클 큐레이션)
- [x] 커리큘럼 목록/상세 페이지
- [x] 내 학습 페이지 (Accordion UI)
- [x] Google OAuth 로그인
- [x] 학습 진행 상황 추적
- [x] Progress Bar 시각화
- [x] Optimistic UI
- [x] README.md 작성
- [x] CHANGELOG.md 작성
- [x] 반응형 디자인

## 🔜 향후 계획 (v1.1.0)

- [ ] 검색 기능 (아티클, 커리큘럼)
- [ ] 필터링 (난이도, 카테고리)
- [ ] 학습 통계 대시보드
- [ ] 이메일 알림
- [ ] 소셜 공유 기능
- [ ] 다크모드 토글

## 📝 참고 문서

- [README.md](./README.md): 프로젝트 개요 및 설정 가이드
- [CHANGELOG.md](./CHANGELOG.md): 상세 버전 히스토리

## 🎯 MVP Scope

이 버전은 MVP로, 다음 기능들은 의도적으로 제외되었습니다:
- 댓글, 좋아요, 북마크
- 프로필 수정
- 관리자 페이지
- 커리큘럼 추천 알고리즘
- 학습 통계 및 분석

---

**브랜치**: `claude/designer-learning-platform-LwTXG`
**버전**: v1.0.0
**릴리스 날짜**: 2026-01-10
**Semantic Versioning**: [Major].[Minor].[Patch]

## 📸 스크린샷 (추가 예정)

- [ ] 홈 페이지
- [ ] 커리큘럼 목록
- [ ] 커리큘럼 상세
- [ ] 내 학습 대시보드
