# 도메인 변경 가이드 (designpath.vercel.app)

## 필수 업데이트 사항

### 1. Supabase 설정 업데이트

#### 1.1 Site URL 변경
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Settings** > **Authentication** > **URL Configuration**으로 이동
4. **Site URL**을 다음으로 변경:
   ```
   https://designpath.vercel.app
   ```

#### 1.2 Redirect URLs 업데이트
같은 페이지의 **Redirect URLs** 섹션에서:

**기존 URL 제거:**
- `https://designerlearningcurve.vercel.app/auth/callback`
- `https://designerlearningcurve-*.vercel.app/auth/callback` (있다면)

**새 URL 추가:**
```
http://localhost:3000/auth/callback
https://designpath.vercel.app/auth/callback
```

### 2. OAuth Provider 설정 (Google)

#### Google Cloud Console
1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 프로젝트 선택
3. **APIs & Services** > **Credentials**
4. OAuth 2.0 Client ID 선택
5. **Authorized redirect URIs** 섹션에서:

**기존 URI 제거:**
- `https://designerlearningcurve.vercel.app/auth/callback`
- `https://[PROJECT-ID].supabase.co/auth/v1/callback` (이전 콜백)

**새 URI 추가:**
```
https://designpath.vercel.app/auth/callback
https://[YOUR-PROJECT-ID].supabase.co/auth/v1/callback
```

> **중요**: Supabase Project ID는 Supabase 대시보드의 Settings > General에서 확인할 수 있습니다.

### 3. Vercel 환경 변수 확인 (선택사항)

Vercel에서 환경 변수가 올바르게 설정되어 있는지 확인:

1. [Vercel Dashboard](https://vercel.com) 접속
2. 프로젝트 선택
3. **Settings** > **Environment Variables**
4. 다음 변수들이 올바르게 설정되어 있는지 확인:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 확인 방법

설정 변경 후 다음을 테스트:

1. **로그아웃 상태에서 로그인 시도**
   - 로그인 버튼 클릭
   - Google 계정 선택
   - `designpath.vercel.app`으로 리다이렉트되는지 확인

2. **URL 확인**
   - 로그인 완료 후 주소창의 URL이 `https://designpath.vercel.app/my-learning`인지 확인
   - 이전 도메인으로 리다이렉트되지 않는지 확인

## 트러블슈팅

### 문제: 여전히 이전 도메인으로 리다이렉트됨

**해결방법:**
1. 브라우저 캐시 및 쿠키 삭제
2. 시크릿 모드에서 테스트
3. Supabase 설정 저장 후 5-10분 대기 (전파 시간)
4. Vercel 프로젝트 재배포

### 문제: "redirect_uri_mismatch" 에러

**원인:** Google OAuth의 Redirect URI가 업데이트되지 않음

**해결방법:**
1. Google Cloud Console에서 Authorized redirect URIs 재확인
2. 정확히 다음 형식으로 입력되었는지 확인:
   ```
   https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/auth/v1/callback
   ```

### 문제: "Invalid Redirect URL" 에러

**원인:** Supabase Redirect URLs에 새 도메인이 추가되지 않음

**해결방법:**
1. Supabase > Settings > Authentication > URL Configuration
2. Redirect URLs에 `https://designpath.vercel.app/auth/callback` 추가
3. 저장 후 테스트

## 참고사항

- 코드 변경은 필요하지 않습니다 (`app/auth/callback/route.ts`가 동적 origin 감지 사용)
- 모든 설정은 외부 서비스(Supabase, Google)에서 이루어집니다
- 설정 변경 후 즉시 반영되지 않을 수 있으니 5-10분 대기 권장
- 개발 환경(localhost:3000)도 Redirect URLs에 포함되어야 합니다
