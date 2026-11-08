import { plainText } from '../../supabase/functions/_shared/plainText'
import { preloadPage } from '../utils/pageModules'
import { applyAppearance } from '../utils/appearance'
import { useWorkspaceNotices } from '../hooks/useWorkspaceNotices'
import { ArrowRight, Bell, BookOpen, CalendarBlank, Cards, ChartBar, FileText, Folder, GearSix, House, List, MagnifyingGlass, Question, SignOut, Sparkle, Users, X, Stethoscope } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useAuthStore, useStudyStore, useUser } from '../store'
import { DSM5_TR_CHAPTERS } from '../data/dsm5Data'
import { readLibrary } from '../utils/studyLibrary'
import { readWorkspaceList } from '../utils/workspaceStorage'
import type { StudyQuiz } from '../utils/quizPractice'

const studyNav = [{ path: '/dashboard', label: 'Overview', icon: House }, { path: '/mindy', label: 'Mindy AI', icon: Sparkle }, { path: '/notes', label: 'Notes', icon: FileText }, { path: '/library', label: 'Library', icon: Folder }, { path: '/flashcards', label: 'Flashcards', icon: Cards }, { path: '/quizzes', label: 'Quizzes', icon: ChartBar }, { path: '/research', label: 'Research', icon: BookOpen }, { path: '/dsm', label: 'DSM-5-TR', icon: Stethoscope }, { path: '/calendar', label: 'Calendar', icon: CalendarBlank }]
const clinicalNav = [{ path: '/clients', label: 'Clients', icon: Users }, { path: '/documents', label: 'Documents', icon: FileText }, { path: '/sessions', label: 'Sessions', icon: CalendarBlank }, { path: '/mindy', label: 'Mindy AI', icon: Sparkle }, { path: '/research', label: 'Research', icon: BookOpen }, { path: '/dsm', label: 'DSM-5-TR', icon: Stethoscope }, { path: '/calendar', label: 'Calendar', icon: CalendarBlank }, { path: '/library', label: 'Library', icon: Folder }]
export function AppLayout() {
  const notices = useWorkspaceNotices()
  const user = useUser(), { logout } = useAuthStore(), { notes, cards } = useStudyStore()
  const location = useLocation(), navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false), [searchOpen, setSearchOpen] = useState(false), [search, setSearch] = useState(''), [notifications, setNotifications] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const clinical = user?.role === 'professional' || user?.role === 'admin'
  const nav = clinical ? clinicalNav : studyNav
  const current = location.pathname === '/dashboard' ? 'Overview' : location.pathname === '/mindy' ? 'Mindy AI' : location.pathname === '/library' ? 'Library' : location.pathname === '/dsm' ? 'DSM-5-TR' : location.pathname.slice(1).replace(/^./, letter => letter.toUpperCase())
  const go = (path: string, state?: Record<string,string>) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    navigate(path, { state })
    setMobileOpen(false)
    setSearchOpen(false)
    setSearch('')
  }
  useEffect(() => { setMobileOpen(false); setNotifications(false) }, [location.pathname])
  useEffect(() => { const handle = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value) } if (event.key === 'Escape') { setNotifications(false); setMobileOpen(false) } }; window.addEventListener('keydown', handle); return () => window.removeEventListener('keydown', handle) }, [])
  useEffect(() => { applyAppearance() }, [user?.id])
  useEffect(()=>{
    let stopped=false,index=0,handle:number
    const warm=()=>{if(stopped||index>=nav.length)return;preloadPage(nav[index++].path);handle=window.setTimeout(warm,150)}
    const idle=window.requestIdleCallback?.(()=>warm(),{timeout:1500})
    if(idle===undefined)handle=window.setTimeout(warm,500)
    return()=>{stopped=true;clearTimeout(handle);if(idle!==undefined)window.cancelIdleCallback(idle)}
  },[nav])
  const initials = (user?.name || 'Your account').split(' ').map(word => word[0]).join('').slice(0, 2)
  const dsmResults = DSM5_TR_CHAPTERS.flatMap(ch => ch.disorders.map(d => ({ title: `${d.name}${d.icdCode ? ` (${d.icdCode})` : ''}`, type: 'DSM-5-TR', path: '/dsm', state: { query: d.name } })))
  const results = [
    ...notes.map(note => ({ title: note.title, type: 'Note', path: '/notes', state: { noteId: note.id } })),
    ...cards.map(card => ({ title: card.question, type: 'Flashcard', path: '/flashcards', state:{cardId:card.id} })),
    ...readLibrary().map(item => ({title:item.title,type:'Study material',path:'/library',state:{materialId:item.id}})),
    ...readWorkspaceList<StudyQuiz>('psykie-quizzes').map(quiz=>({title:quiz.title,type:'Quiz',path:'/quizzes',state:{quizId:quiz.id}})),
    ...dsmResults,
    ...nav.map(item => ({ title: item.label, type: 'Workspace', path: item.path }))
  ].filter(item => (item.title + ' ' + item.type).toLowerCase().includes(search.toLowerCase())).slice(0, 10)
  const sidebar = <><a href="/dashboard" className="ref-brand" onClick={e => { e.preventDefault(); go('/dashboard') }}><img src="/mindy-mascot.png" alt="" /><span>Psykie</span></a><p className="nav-section-label">{clinical ? 'Practice' : 'Learning workspace'}</p><nav className="ref-main-nav" aria-label="Main navigation">{nav.map(item => <button key={item.label} className={location.pathname === item.path ? 'active' : ''} aria-current={location.pathname === item.path ? 'page' : undefined} onPointerEnter={()=>preloadPage(item.path)} onFocus={()=>preloadPage(item.path)} onPointerDown={()=>preloadPage(item.path)} onClick={() => go(item.path)}><item.icon size={22} weight={location.pathname === item.path ? 'duotone' : 'regular'} />{item.label}</button>)}</nav><div className="ref-sidebar-bottom"><nav>{[{ path: '/settings', label: 'Settings', icon: GearSix }, { path: '/help', label: 'Help', icon: Question }].map(item => <button key={item.path} className={location.pathname === item.path ? 'active' : ''} onClick={() => go(item.path)}><item.icon size={22} />{item.label}</button>)}<button onClick={logout}><SignOut size={22} />Sign out</button></nav><div className="ref-sidebar-profile"><span className="ref-avatar tint-0">{initials}</span><span><strong>{user?.name || 'Your account'}</strong><small>{clinical ? 'Clinical workspace' : 'Psychology student'}</small></span></div></div></>
  return <div className="psykie-frame"><a className="skip-link" href="#main-content">Skip to content</a><aside className="ref-sidebar">{sidebar}</aside><div className="ref-workspace"><header className="ref-topbar"><button className="ref-mobile-menu" aria-label="Open navigation menu" onClick={() => setMobileOpen(true)}><List size={23} /></button><div className="ref-breadcrumb">Workspace<span>/</span><strong>{current}</strong></div><button className="ref-global-search" onClick={() => setSearchOpen(true)}><MagnifyingGlass size={19} /><span>Search your workspace</span><kbd>⌘ K</kbd></button><div className="ref-notification-wrapper"><button className="ref-notification-button" aria-label="Notifications" onClick={() => setNotifications(!notifications)}><Bell size={24} />{notices.length>0&&<i className="has-notices"/>}</button>{notifications && <div className="ref-notification-popover"><h3>Your notifications</h3>{notices.length?notices.map(notice=><button className="workspace-notice" key={notice.id} onClick={()=>{go(notice.path);setNotifications(false)}}><strong>{notice.title}</strong><small>{notice.description}</small></button>):<p>No reminders right now. Turn on study reminders or your weekly summary in Settings.</p>}<button className="ref-text-action" onClick={()=>{go('/settings');setNotifications(false)}}>Notification settings</button></div>}</div></header><main id="main-content" className="ref-main-content" tabIndex={-1}><Outlet /></main></div>
    <nav className="ref-mobile-dock">{[{ path: '/dashboard', label: 'Overview', icon: House }, { path: clinical ? '/clients' : '/flashcards', label: clinical ? 'Clients' : 'Study', icon: clinical ? Users : Cards }, { path: '/mindy', label: 'Mindy', icon: Sparkle }, { path: '/notes', label: 'Notes', icon: FileText }, { path: '/library', label: 'Library', icon: BookOpen }].map(item => <button key={item.path} className={location.pathname === item.path ? 'active' : ''} onClick={() => go(item.path)}><item.icon size={23} /><span>{item.label}</span></button>)}</nav>
    {mobileOpen && <ViewportOverlay className="ref-drawer-overlay" onDismiss={() => setMobileOpen(false)}><div className="ref-mobile-sidebar"><button className="ref-drawer-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={22} /></button>{sidebar}</div></ViewportOverlay>}
    {searchOpen && <ViewportOverlay onDismiss={() => { setSearchOpen(false); setSearch('') }}><section className="glass-modal ref-search-dialog"><div className="ref-panel-title"><h2>Search your workspace</h2><button aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={21} /></button></div><label className="ref-search"><MagnifyingGlass size={19} /><input ref={searchRef} autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a note, flashcard, or study tool…" /></label><div className="ref-search-results">{results.map((item, index) => <button key={index} onClick={() => go(item.path, 'state' in item ? item.state as Record<string,string> : undefined)}><span><strong>{plainText(item.title)}</strong><small>{item.type}</small></span><ArrowRight size={18} /></button>)}{!results.length && <p>No results. Try another word.</p>}</div></section></ViewportOverlay>}
  </div>
}
