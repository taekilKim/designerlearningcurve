# 🚀 배포 가이드

Designer Learning Curve를 웹에 배포하는 방법을 단계별로 안내합니다.

## 📋 사전 준비

배포하기 전에 다음 계정이 필요합니다:

- ✅ [GitHub](https://github.com) 계정
- ✅ [Vercel](https://vercel.com) 계정 (GitHub으로 로그인)
- ✅ [Supabase](https://supabase.com) 계정

---

## 1️⃣ Supabase 프로젝트 설정

### 1.1 프로젝트 생성

1. [Supabase 대시보드](https://app.supabase.com)에 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: `designer-learning-curve`
   - **Database Password**: 안전한 비밀번호 생성
   - **Region**: `Northeast Asia (Seoul)` 선택
4. "Create new project" 클릭 (약 2분 소요)

### 1.2 데이터베이스 스키마 생성

1. 좌측 메뉴에서 **SQL Editor** 클릭
2. `supabase/schema.sql` 파일의 전체 내용을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭 (⌘/Ctrl + Enter)
5. "Success. No rows returned" 메시지 확인

### 1.3 샘플 데이터 삽입

1. SQL Editor에서 새 쿼리 생성
2. `supabase/seed.sql` 파일의 전체 내용을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭
5. 삽입 성공 메시지 확인

### 1.4 API 키 복사

1. 좌측 메뉴에서 **Settings** > **API** 클릭
2. 다음 값들을 복사해두기:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키

---

## 2️⃣ Google OAuth 설정

### 2.1 Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services** > **Credentials** 이동
4. **Create Credentials** > **OAuth client ID** 클릭
5. Application type: **Web application** 선택
6. 이름: `Designer Learning Curve` 입력
7. **Authorized redirect URIs** 추가:
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```
   (YOUR-PROJECT-ID는 Supabase 프로젝트 ID로 교체)
8. **Create** 클릭
9. **Client ID**와 **Client Secret** 복사

### 2.2 Supabase에 Google OAuth 연동

1. Supabase 대시보드로 돌아가기
2. **Authentication** > **Providers** 클릭
3. **Google** 찾아서 활성화
4. Google Cloud Console에서 복사한 값 입력:
   - **Client ID**
   - **Client Secret**
5. **Save** 클릭

### 2.3 Redirect URLs 설정

1. **Authentication** > **URL Configuration** 클릭
2. **Site URL** 설정 (나중에 Vercel URL로 변경):
   ```
   http://localhost:3000
   ```
3. **Redirect URLs** 추가:
   ```
   http://localhost:3000/auth/callback
   ```
4. **Save** 클릭

---

## 3️⃣ Vercel 배포

### 3.1 GitHub 저장소 푸시

프로젝트가 GitHub에 푸시되어 있는지 확인:

```bash
git remote -v
git push origin main
```

### 3.2 Vercel 프로젝트 생성

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. **Add New...** > **Project** 클릭
3. GitHub 저장소 연결:
   - **Import Git Repository** 섹션에서 저장소 검색
   - `designerlearningcurve` 저장소 선택
   - **Import** 클릭

### 3.3 환경 변수 설정

1. **Configure Project** 화면에서 **Environment Variables** 섹션 찾기
2. 다음 환경 변수 추가:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

3. **Add** 버튼 클릭하여 각 변수 추가

### 3.4 배포 시작

1. **Deploy** 버튼 클릭
2. 배포 진행 상황 모니터링 (약 2-3분 소요)
3. 배포 완료 후 **Visit** 버튼 클릭하여 사이트 확인

---

## 4️⃣ OAuth Redirect URL 업데이트

Vercel 배포 후 받은 URL을 OAuth 설정에 추가해야 합니다.

### 4.1 Vercel URL 확인

배포 완료 후 받은 URL을 복사합니다 (예: `https://your-app.vercel.app`)

### 4.2 Google Cloud Console 업데이트

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. **APIs & Services** > **Credentials** 이동
3. 생성한 OAuth 2.0 Client ID 클릭
4. **Authorized redirect URIs**에 추가:
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```
5. **Save** 클릭

### 4.3 Supabase URL Configuration 업데이트

1. Supabase 대시보드 > **Authentication** > **URL Configuration**
2. **Site URL** 변경:
   ```
   https://your-app.vercel.app
   ```
3. **Redirect URLs**에 추가:
   ```
   https://your-app.vercel.app/auth/callback
   ```
4. **Save** 클릭

---

## 5️⃣ 배포 확인

### 5.1 기능 테스트

1. 배포된 사이트 접속
2. 다음 기능들이 정상 작동하는지 확인:
   - ✅ 홈 페이지 로딩 및 아티클 표시
   - ✅ 커리큘럼 목록 페이지
   - ✅ 커리큘럼 상세 페이지
   - ✅ Google 로그인
   - ✅ 커리큘럼 등록
   - ✅ 내 학습 페이지
   - ✅ 학습 진행 상황 체크

### 5.2 문제 해결

배포 후 문제가 발생하면:

1. **Vercel 대시보드** > **Deployments** > 최신 배포 클릭
2. **Logs** 탭에서 에러 확인
3. 환경 변수가 올바르게 설정되었는지 확인
4. Supabase 연결 상태 확인

---

## 6️⃣ 커스텀 도메인 설정 (선택사항)

### 6.1 도메인 구매

- [Namecheap](https://www.namecheap.com)
- [Google Domains](https://domains.google)
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)

### 6.2 Vercel에 도메인 추가

1. Vercel 대시보드 > 프로젝트 선택
2. **Settings** > **Domains** 클릭
3. 도메인 입력 (예: `your-domain.com`)
4. **Add** 클릭
5. DNS 레코드 설정 안내 따라하기

### 6.3 OAuth Redirect URLs 다시 업데이트

커스텀 도메인을 사용하는 경우:

1. **Google Cloud Console**에서 Redirect URI 추가:
   ```
   https://your-domain.com/auth/callback
   ```

2. **Supabase**에서 Site URL 및 Redirect URL 업데이트:
   ```
   https://your-domain.com
   https://your-domain.com/auth/callback
   ```

---

## 🔄 업데이트 배포

코드 변경 후 새 버전 배포:

```bash
# 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# GitHub에 푸시
git push origin main
```

Vercel은 자동으로 새 배포를 시작합니다.

---

## 📊 모니터링

### Vercel Analytics

1. Vercel 대시보드 > 프로젝트 선택
2. **Analytics** 탭 클릭
3. 페이지 뷰, 성능 지표 확인

### Supabase Dashboard

1. Supabase 대시보드
2. **Database** > **Tables** 에서 데이터 확인
3. **Authentication** > **Users** 에서 사용자 확인

---

## 🐛 일반적인 문제

### 1. "Invalid supabaseUrl" 에러

**원인**: 환경 변수가 설정되지 않았거나 잘못됨

**해결**:
- Vercel 대시보드 > **Settings** > **Environment Variables** 확인
- 환경 변수 재입력 후 **Redeploy** 클릭

### 2. Google 로그인 실패

**원인**: OAuth Redirect URL 불일치

**해결**:
- Google Cloud Console에서 Redirect URI 확인
- Supabase URL Configuration 확인
- 정확한 URL 형식 사용 (trailing slash 없이)

### 3. 데이터베이스 연결 실패

**원인**: RLS 정책 미적용 또는 잘못된 설정

**해결**:
- Supabase SQL Editor에서 `supabase/schema.sql` 재실행
- RLS 정책 확인: **Authentication** > **Policies**

### 4. 이미지 로딩 실패

**원인**: Next.js Image 원격 패턴 설정 누락

**해결**:
- `next.config.ts`에 이미지 도메인 추가되어 있는지 확인
- Vercel에서 재배포

---

## 📞 추가 도움

- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs
- **GitHub Issues**: 프로젝트 저장소에 이슈 등록

---

## ✅ 배포 체크리스트

완료된 항목에 체크:

- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 실행
- [ ] 샘플 데이터 삽입
- [ ] Supabase API 키 복사
- [ ] Google OAuth Client 생성
- [ ] Supabase에 Google OAuth 연동
- [ ] GitHub에 코드 푸시
- [ ] Vercel 프로젝트 생성
- [ ] Vercel 환경 변수 설정
- [ ] 배포 완료
- [ ] OAuth Redirect URLs 업데이트
- [ ] 기능 테스트 완료
- [ ] (선택) 커스텀 도메인 설정

배포 완료! 🎉
