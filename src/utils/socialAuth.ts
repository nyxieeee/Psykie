import type { User } from '../types'
import { requireSupabase, supabaseConfigured } from './supabase'
export type SocialProvider = 'google'
export const socialAuthConfigured = supabaseConfigured
export async function startSocialSignIn(provider: SocialProvider) {
  const { error } = await requireSupabase().auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + '/auth/callback' } })
  if (error) throw error
}
export type SocialSession = { user: User }
export async function getSocialSession(): Promise<SocialSession> {
  const client = requireSupabase()
  const { error: sessionError } = await client.auth.getSession()
  if (sessionError) throw sessionError
  const { data, error } = await client.auth.getUser()
  if (error || !data.user) throw new Error('Your sign-in session expired. Please sign in again.')
  const { data: profile, error: profileError } = await client.from('profiles').select('id, role, display_name, avatar_url').eq('id', data.user.id).single()
  if (profileError || !profile) throw new Error('Your account profile is not ready. Apply the Supabase profile migration before signing in.')
  return { user: { id: data.user.id, email: data.user.email || '', name: profile.display_name || data.user.email?.split('@')[0] || 'Your account', role: profile.role === 'student' || profile.role === 'professional' ? profile.role : 'guest', avatar: profile.avatar_url || undefined, createdAt: new Date(data.user.created_at) } }
}
export async function saveSocialAccountType(role: 'student' | 'professional'): Promise<SocialSession> {
  const client = requireSupabase()
  const { user } = await getSocialSession()
  if (user.role !== 'guest') throw new Error('Your account type has already been selected.')
  const { error } = await client.from('profiles').update({ role }).eq('id', user.id).is('role', null).select('id').single()
  if (error) throw new Error('Your account type could not be saved. Please try again.')
  const updated = await getSocialSession()
  if (updated.user.id !== user.id || updated.user.role !== role) throw new Error('Your account type was not saved. Please try again.')
  return updated
}
export async function endSocialSession() {
  const { error } = await requireSupabase().auth.signOut()
  if (error) throw error
}
