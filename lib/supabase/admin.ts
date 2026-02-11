import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Admin client that bypasses RLS - for server-side operations only
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createSupabaseClient(url, serviceKey)
}
