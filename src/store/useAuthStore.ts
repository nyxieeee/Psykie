import { endSocialSession, getSocialSession, saveSocialAccountType } from '../utils/socialAuth'
import { requireSupabase, supabaseConfigured } from '../utils/supabase'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User, LoginCredentials, RegisterData } from '../types'
import { setActiveAccount, workspaceStorage } from '../utils/workspaceStorage'
import { useMindyStore } from './useMindyStore'
import { useStudyStore } from './useStudyStore'

type LocalAccount = { user: User; salt: string; passwordHash: string }
type AccountRole = 'student' | 'professional'
type SessionSource = 'local' | 'supabase' | 'dev'
const ACCOUNTS_KEY = 'psykie-beta-accounts-v1'
let sessionCheck: Promise<void> | null = null
let signInCheck: Promise<boolean> | null = null
const initialState: AuthState = { user: null, isAuthenticated: false, isLoading: false, error: null }
const hex = (bytes: Uint8Array) => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
async function hashPassword(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  return hex(new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 210000, hash: 'SHA-256' }, key, 256)))
}
function accounts(): Record<string, LocalAccount> {
  try { const value = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {} } catch { return {} }
}
function loadAccountWorkspace(id: string | null) {
  setActiveAccount(id)
  let chats = {}
  try { chats = JSON.parse(workspaceStorage.getItem('psykie-mindy') || 'null')?.state || {} } catch { /* Empty chat history. */ }
  useMindyStore.setState({ ...useMindyStore.getInitialState(), ...chats }, true)
  let content = {}
  try { content = JSON.parse(workspaceStorage.getItem('psykie-study-store') || 'null')?.state || {} } catch { /* Empty workspace. */ }
  useStudyStore.setState({ ...useStudyStore.getInitialState(), ...content }, true)
}
interface AuthActions {
  sessionSource: SessionSource
  isSessionReady: boolean
  notice: string | null
  loginDemo: (role: AccountRole) => Promise<boolean>
  finishSocialSignIn: () => Promise<boolean>
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  setUser: (user: User | null) => Promise<boolean>
  completeAccountRole: (role: AccountRole) => Promise<boolean>
}
export const useAuthStore = create<AuthState & AuthActions>()(persist((set, get) => ({
  ...initialState,
  sessionSource: 'local', isSessionReady: false, notice: null,
  loginDemo: async role => {
    if (!import.meta.env.DEV || !['student', 'professional'].includes(role)) return false
    const user: User = { id: 'dev-demo-' + role, email: role + '@psykie.test', name: role === 'student' ? 'Dev Student' : 'Dev Registered Psych', role, createdAt: new Date() }
    loadAccountWorkspace(user.id)
    set({ user, isAuthenticated: true, isLoading: false, error: null, notice: null, sessionSource: 'dev', isSessionReady: true })
    return true
  },
  finishSocialSignIn: () => {
    if (signInCheck) return signInCheck
    const finish = async () => {
      set({ isLoading: true, error: null, notice: null })
      try {
        const { user } = await getSocialSession()
        loadAccountWorkspace(user.id)
        set({ user, isAuthenticated: true, isLoading: false, error: null, sessionSource: 'supabase', isSessionReady: true })
        return true
      } catch(error) {
        loadAccountWorkspace(null)
        set({ ...initialState, isSessionReady: true, error: error instanceof Error ? error.message : 'Sign-in failed. Please try again.' })
        return false
      }
    }
    signInCheck = finish().finally(() => { signInCheck = null })
    return signInCheck
  },
  login: async ({ email, password }) => {
    if (!supabaseConfigured && !import.meta.env.DEV) { set({ error: 'Authentication is unavailable until Supabase is configured.' }); return false }
    set({ isLoading: true, error: null, notice: null })
    try {
      if (supabaseConfigured) {
        const { error } = await requireSupabase().auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
        return get().finishSocialSignIn()
      }
      const account = accounts()[email.trim().toLowerCase()]
      if (!account || await hashPassword(password, account.salt) !== account.passwordHash) throw new Error('Invalid email or password.')
      loadAccountWorkspace(account.user.id)
      set({ user: account.user, isAuthenticated: true, isLoading: false, error: null, sessionSource: 'local', isSessionReady: true })
      return true
    } catch(error) { set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to sign in.' }); return false }
  },
  register: async data => {
    if (!supabaseConfigured && !import.meta.env.DEV) { set({ error: 'Authentication is unavailable until Supabase is configured.' }); return false }
    set({ isLoading: true, error: null, notice: null })
    try {
      if (!['student', 'professional'].includes(data.role) || !data.name.trim() || !data.email.trim() || data.password.length < 8) throw new Error('Enter your details and choose Student or Registered Psych.')
      if (supabaseConfigured) {
        const { data: result, error } = await requireSupabase().auth.signUp({ email: data.email.trim(), password: data.password, options: { emailRedirectTo: window.location.origin + '/auth/callback', data: { full_name: data.name.trim(), signup_role: data.role } } })
        if (error) throw error
        if (!result.session) { set({ isLoading: false, notice: 'Check your email to confirm your account, then sign in.' }); return false }
        return get().finishSocialSignIn()
      }
      const email = data.email.trim().toLowerCase(), existing = accounts()
      if (existing[email]) throw new Error('This email already has an account. Please log in.')
      const salt = hex(crypto.getRandomValues(new Uint8Array(16))), passwordHash = await hashPassword(data.password, salt)
      const user: User = { id: crypto.randomUUID(), email, name: data.name.trim(), role: data.role, avatar: '/mindy-mascot.png', createdAt: new Date() }
      existing[email] = { user, salt, passwordHash }
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(existing))
      loadAccountWorkspace(user.id)
      set({ user, isAuthenticated: true, isLoading: false, error: null, sessionSource: 'local', isSessionReady: true })
      return true
    } catch(error) { set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to create your account.' }); return false }
  },
  logout: async () => {
    if (get().sessionSource === 'supabase') {
      set({ isLoading: true, error: null })
      try { await endSocialSession() } catch(error) { set({ isLoading: false, error: error instanceof Error ? error.message : 'Sign out failed.' }); return }
    }
    loadAccountWorkspace(null)
    set({ ...initialState, sessionSource: 'local', isSessionReady: true, notice: null })
  },
  checkAuth: () => {
    if (sessionCheck) return sessionCheck
    const check = async () => {
      const { user, sessionSource } = get()
      if (sessionSource === 'dev' && import.meta.env.DEV && user && ['student', 'professional'].includes(user.role) && user.id === 'dev-demo-' + user.role) { set({ isSessionReady: true }); return }
      if (supabaseConfigured) {
        const { data } = await requireSupabase().auth.getSession()
        if (data.session) { await get().finishSocialSignIn(); return }
        loadAccountWorkspace(null); set({ ...initialState, sessionSource: 'local', isSessionReady: true }); return
      }
      if (!import.meta.env.DEV || sessionSource !== 'local' || !user || !Object.values(accounts()).some(account => account.user.id === user.id)) {
        loadAccountWorkspace(null); set({ ...initialState, sessionSource: 'local', isSessionReady: true }); return
      }
      set({ isSessionReady: true })
    }
    sessionCheck = check().catch(error => {
      loadAccountWorkspace(null)
      set({ ...initialState, sessionSource: 'local', isSessionReady: true, error: error instanceof Error ? error.message : 'Your session could not be checked. Please sign in again.' })
    }).finally(() => { sessionCheck = null })
    return sessionCheck
  },
  completeAccountRole: async role => {
    const user = get().user
    if (!user || user.role !== 'guest' || get().sessionSource !== 'supabase' || !['student', 'professional'].includes(role)) return false
    set({ isLoading: true, error: null })
    try {
      const updated = await saveSocialAccountType(role)
      if (updated.user.id !== user.id) throw new Error('Your account changed. Please sign in again.')
      set({ user: updated.user, isLoading: false, error: null }); return true
    } catch(error) { set({ isLoading: false, error: error instanceof Error ? error.message : 'Unable to save account type.' }); return false }
  },
  setUser: async user => {
    if (!user) { await get().logout(); return true }
    const current = get().user
    if (!current) return false
    try {
      if (get().sessionSource === 'supabase') {
        const { error } = await requireSupabase().from('profiles').update({ display_name: user.name, avatar_url: user.avatar || null }).eq('id', current.id)
        if (error) throw error
        const updated = await getSocialSession()
        set({ user: updated.user, error: null }); return true
      }
      const updated = { ...user, id: current.id, role: current.role }, existing = accounts()
      const previousKey = Object.keys(existing).find(key => existing[key].user.id === current.id), email = updated.email.trim().toLowerCase()
      if (previousKey) {
        if (existing[email] && existing[email].user.id !== current.id) throw new Error('This email already belongs to another account.')
        const account = existing[previousKey]; delete existing[previousKey]
        existing[email] = { ...account, user: { ...updated, email } }; localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(existing))
      }
      set({ user: { ...updated, email }, error: null }); return true
    } catch(error) { set({ error: error instanceof Error ? error.message : 'Profile could not be saved.' }); return false }
  },
}), { name: 'auth-storage', partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated, sessionSource: state.sessionSource }) }))
export const useUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useIsAuthLoading = () => useAuthStore(state => state.isLoading)
