import { workspaceStorage } from '../utils/workspaceStorage'
import { ArrowRight, Bell, BookOpen, CalendarBlank, Cards, CaretRight, ChartBar, FileText, Folder, GearSix, House, List, MagnifyingGlass, Question, SignOut, Sparkle, Users, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useAuthStore, useStudyStore, useUser } from '../store'

const studyNav = [{ path: '/dashboard', label: 'Overview', icon: House }, { path: '/mindy', label: 'Mindy AI', icon: Sparkle }, { path: '/notes', label: 'Notes', icon: FileText }, { path: '/flashcards', label: 'Flashcards', icon: Cards }, { path: '/quizzes', label: 'Quizzes', icon: ChartBar }, { path: '/research', label: 'Research', icon: BookOpen }, { path: '/calendar', label: 'Calendar', icon: CalendarBlank }, { path: '/documents', label: 'Documents', icon: Folder }]
const clinicalNav = [{ path: '/clients', label: 'Clients', icon: Users }, { path: '/documents', label: 'Documents', icon: FileText }, { path: '/sessions', label: 'Sessions', icon: CalendarBlank }, { path: '/mindy', label: 'Mindy AI', icon: Sparkle }, { path: '/research', label: 'Research', icon: BookOpen }, { path: '/calendar', label: 'Calendar', icon: CalendarBlank }]
export function AppLayout() {
  const user = useUser(), { logout } = useAuthStore(), { notes, cards } = useStudyStore()
  const location = useLocation(), navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false), [searchOpen, setSearchOpen] = useState(false), [search, setSearch] = useState(''), [notifications, setNotifications] = useState(false), [profileOpen, setProfileOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const clinical = user?.role === 'professional' || user?.role === 'admin'
  const nav = clinical ? clinicalNav : studyNav
  const current = location.pathname === '/dashboard' ? 'Overview' : location.pathname === '/mindy' ? 'Mindy AI' : location.pathname.slice(1).replace(/^./, letter => letter.toUpperCase())
  const go = (path: string) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    navigate(path)
    setMobileOpen(false)
    setSearchOpen(false)
    setSearch('')
  }
  useEffect(() => { setMobileOpen(false); setNotifications(false); setProfileOpen(false) }, [location.pathname])
  useEffect(() => { const handle = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value) } if (event.key === 'Escape') { setNotifications(false); setProfileOpen(false); setMobileOpen(false) } }; window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle) }, [])
  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme:dark)')
    const apply = () => {
      let prefs: {theme?: string; accent?: string} = {}
      try { prefs = JSON.parse(workspaceStorage.getItem('psykie-preferences') || '{}') } catch { /* Defaults. */ }
      document.documentElement.dataset.psykieTheme = prefs.theme === 'system' ? (media.matches ? 'dark' : 'light') : prefs.theme || 'light'
      document.documentElement.style.setProperty('--ref-accent', prefs.accent || '#d74be7')
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])
  const initials = (user?.name || 'Your account').split(' ').map(word => word[0]).join('').slice(0, 2)
  const results = [...notes.map(note => ({ title: note.title, type: 'Note', path: '/notes' })), ...cards.map(card => ({ title: card.question, type: 'Flashcard', path: '/flashcards' })), ...nav.map(item => ({ title: item.label, type: 'Workspace', path: item.path }))].filter(item => (item.title + ' ' + item.type).toLowerCase().includes(search.toLowerCase())).slice(0, 10)
  const sidebar = <><a href="/dashboard" className="ref-brand" onClick={e => { e.preventDefault(); go('/dashboard') }}><img src="/mindy-mascot.png" alt="" /><span>Psykie</span></a><nav className="ref-main-nav">{nav.map(item => <button key={item.label} className={location.pathname === item.path && !(item.label === 'Sessions') ? 'active' : ''} aria-current={location.pathname === item.path ? 'page' : undefined} onClick={() => go(item.path)}><item.icon size={22} weight={location.pathname === item.path ? 'duotone' : 'regular'} />{item.label}</button>)}</nav><div className="ref-sidebar-bottom"><nav>{[{ path: '/settings', label: 'Settings', icon: GearSix }, { path: '/help', label: 'Help', icon: Question }].map(item => <button key={item.path} className={location.pathname === item.path ? 'active' : ''} onClick={() => go(item.path)}><item.icon size={22} />{item.label}</button>)}</nav><button className="ref-sidebar-profile" onClick={() => setProfileOpen(!profileOpen)}><span className="ref-avatar tint-0">{initials}</span><span><strong>{user?.name || 'Alex Morgan'}</strong><small>{clinical ? 'Clinical workspace' : 'Psychology student'}</small></span><CaretRight size={16} /></button>{profileOpen && <div className="ref-profile-popover"><button onClick={() => go('/settings')}><GearSix size={17} />Account settings</button><button onClick={logout}><SignOut size={17} />Sign out</button></div>}</div></>
  return <div className="psykie-frame"><aside className="ref-sidebar">{sidebar}</aside><div className="ref-workspace"><header className="ref-topbar"><button className="ref-mobile-menu" aria-label="Open navigation menu" onClick={() => setMobileOpen(true)}><List size={23} /></button><div className="ref-breadcrumb">Workspace<span>/</span><strong>{current}</strong></div><button className="ref-global-search" onClick={() => setSearchOpen(true)}><MagnifyingGlass size={19} /><span>Search your workspace</span><kbd>⌘ K</kbd></button><div className="ref-notification-wrapper"><button className="ref-notification-button" aria-label="Notifications" onClick={() => setNotifications(!notifications)}><Bell size={24} /><i /></button>{notifications && <div className="ref-notification-popover"><h3>Your workspace is ready</h3><p>No new notifications. A little progress is always a good place to start.</p><button className="ref-text-action" onClick={() => setNotifications(false)}>Got it</button></div>}</div></header><main className="ref-main-content"><Outlet /></main></div>
    <nav className="ref-mobile-dock">{[{ path: '/dashboard', label: 'Overview', icon: House }, { path: clinical ? '/clients' : '/flashcards', label: clinical ? 'Clients' : 'Study', icon: clinical ? Users : Cards }, { path: '/mindy', label: 'Mindy', icon: Sparkle }, { path: '/notes', label: 'Notes', icon: FileText }, { path: '/documents', label: 'Library', icon: BookOpen }].map(item => <button key={item.path} className={location.pathname === item.path ? 'active' : ''} onClick={() => go(item.path)}><item.icon size={23} /><span>{item.label}</span></button>)}</nav>
    {mobileOpen && <ViewportOverlay className="ref-drawer-overlay" onDismiss={() => setMobileOpen(false)}><div className="ref-mobile-sidebar"><button className="ref-drawer-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={22} /></button>{sidebar}</div></ViewportOverlay>}
    {searchOpen && <ViewportOverlay onDismiss={() => { setSearchOpen(false); setSearch('') }}><section className="glass-modal ref-search-dialog"><div className="ref-panel-title"><h2>Search your workspace</h2><button aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={21} /></button></div><label className="ref-search"><MagnifyingGlass size={19} /><input ref={searchRef} autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a note, flashcard, or study tool…" /></label><div className="ref-search-results">{results.map((item, index) => <button key={index} onClick={() => go(item.path)}><span><strong>{item.title}</strong><small>{item.type}</small></span><ArrowRight size={18} /></button>)}{!results.length && <p>No results. Try another word.</p>}</div></section></ViewportOverlay>}
  </div>
}
