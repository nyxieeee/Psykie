import { getActiveAccount, workspaceStorage } from './workspaceStorage'

export const DEFAULT_ACCENT = '#be5b6c'
type Appearance = {theme?:string;accent?:string}
export function normalizeAccent(accent?:string) {
  return !accent || ['#7054c4','#d74be7'].includes(accent.toLowerCase()) ? DEFAULT_ACCENT : accent
}
export function applyAppearance(preferences?:Appearance) {
  let saved:Appearance={}
  try {saved=JSON.parse(workspaceStorage.getItem('psykie-preferences')||localStorage.getItem('psykie-device-appearance')||'{}')}catch{/* defaults */}
  const prefs=preferences||saved
  const dark=prefs.theme==='dark'||prefs.theme==='system'&&matchMedia('(prefers-color-scheme:dark)').matches
  document.documentElement.dataset.psykieTheme=dark?'dark':'light'
  document.documentElement.classList.toggle('dark',dark)
  const accent=normalizeAccent(prefs.accent)
  if(accent.toLowerCase()===DEFAULT_ACCENT)document.documentElement.style.removeProperty('--ref-accent')
  else document.documentElement.style.setProperty('--ref-accent',accent)
  // Keep only non-sensitive appearance choices for sign-in screens too.
  try {localStorage.setItem('psykie-device-appearance',JSON.stringify({theme:prefs.theme||'light',accent}))}catch{/* optional device preference */}
}
export function watchAppearance() {
  applyAppearance()
  const media=matchMedia('(prefers-color-scheme:dark)')
  const update=()=>applyAppearance()
  const workspaceUpdate=(event:Event)=>{if((event as CustomEvent).detail?.key==='psykie-preferences')update()}
  const storageUpdate=(event:StorageEvent)=>{
    if(event.key===`psykie-beta:${getActiveAccount()||'signed-out'}:psykie-preferences` || event.key==='psykie-device-appearance'&&!getActiveAccount())update()
  }
  media.addEventListener('change',update)
  window.addEventListener('psykie-workspace-change',workspaceUpdate)
  window.addEventListener('storage',storageUpdate)
  return ()=>{media.removeEventListener('change',update);window.removeEventListener('psykie-workspace-change',workspaceUpdate);window.removeEventListener('storage',storageUpdate)}
}
