import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/my-learning'

  console.log('[Auth Callback] Request URL:', request.url)
  console.log('[Auth Callback] Code:', code)
  console.log('[Auth Callback] Origin:', origin)
  console.log('[Auth Callback] Next:', next)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('[Auth Callback] Exchange result:', { data: !!data, error })

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      console.log('[Auth Callback] Forwarded host:', forwardedHost)
      console.log('[Auth Callback] Is local:', isLocalEnv)

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      console.error('[Auth Callback] Exchange error:', error)
    }
  } else {
    console.error('[Auth Callback] No code provided')
  }

  // return the user to an error page with instructions
  console.log('[Auth Callback] Redirecting to error page')
  return NextResponse.redirect(`${origin}/`)
}
