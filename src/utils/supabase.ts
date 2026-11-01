import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
export const supabaseConfigured = Boolean(url && key)
export const supabase = url && key ? createClient(url, key, { auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null
export function requireSupabase() {
  if (!supabase) throw new Error('Supabase authentication has not been configured yet.')
  return supabase
}
