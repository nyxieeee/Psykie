// Workspace content is isolated by account. Legacy demo storage is never imported.
let activeAccount: string | null = null
try { activeAccount = JSON.parse(localStorage.getItem('auth-storage') || 'null')?.state?.user?.id || null } catch { /* Signed out. */ }
export const setActiveAccount = (id: string | null) => { activeAccount = id }
const keyFor = (key: string) => `psykie-beta:${activeAccount || 'signed-out'}:${key}`
export const workspaceStorage: Storage = {
  get length() { return localStorage.length },
  clear() { throw new Error('Clear individual workspace records explicitly.') },
  key(index) { return localStorage.key(index) },
  getItem(key) { return localStorage.getItem(keyFor(key)) },
  setItem(key, value) { localStorage.setItem(keyFor(key), value) },
  removeItem(key) { localStorage.removeItem(keyFor(key)) },
}
export function readWorkspaceList<T>(key: string): T[] {
  try { const value = JSON.parse(workspaceStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}
