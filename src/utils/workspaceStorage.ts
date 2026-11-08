// Workspace content is isolated by account. Legacy demo storage is never imported.
let activeAccount: string | null = null
try { activeAccount = JSON.parse(localStorage.getItem('auth-storage') || 'null')?.state?.user?.id || null } catch { /* Signed out. */ }
export const setActiveAccount = (id: string | null) => { activeAccount = id }
export const getActiveAccount = () => activeAccount
export function workspaceEntries(): Record<string,string> {
  const prefix = `psykie-beta:${activeAccount || 'signed-out'}:`
  const entries:Record<string,string> = {}
  for(let index=0;index<localStorage.length;index++) {
    const key=localStorage.key(index)
    if(key?.startsWith(prefix)) entries[key.slice(prefix.length)]=localStorage.getItem(key) || ''
  }
  return entries
}
const keyFor = (key: string) => `psykie-beta:${activeAccount || 'signed-out'}:${key}`
export const workspaceStorage: Storage = {
  get length() { return localStorage.length },
  clear() { throw new Error('Clear individual workspace records explicitly.') },
  key(index) { return localStorage.key(index) },
  getItem(key) { return localStorage.getItem(keyFor(key)) },
  setItem(key, value) { localStorage.setItem(keyFor(key), value); window.dispatchEvent(new CustomEvent('psykie-workspace-change',{detail:{key,account:activeAccount}})) },
  removeItem(key) { localStorage.removeItem(keyFor(key)); window.dispatchEvent(new CustomEvent('psykie-workspace-change',{detail:{key,account:activeAccount}})) },
}
export function readWorkspaceList<T>(key: string): T[] {
  try { const value = JSON.parse(workspaceStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : [] } catch { return [] }
}
