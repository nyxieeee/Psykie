import { StartupBoundary } from './components/StartupBoundary'
import { useStartupReady } from './context/StartupContext'
import { PasswordPage } from './pages/auth/PasswordPage'
import { useMotionPreference } from './hooks/useMotionPreference'
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage'
import { AccountTypePage } from './pages/auth/AccountTypePage'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, useEffect, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore, useIsAuthenticated } from './store'
import { TransitionProvider, useTransitionStyle } from './context/TransitionContext'
import { TRANSITIONS, DEFAULT_TRANSITION } from './utils/transitions'
import {
  HelpIcon,
  BrainIcon,
} from './components/icons/PsykieIcons'

// Lazy load pages for code splitting
const AuthLayout     = lazy(() => import('./layouts/AuthLayout').then(m => ({ default: m.AuthLayout })))
const AppLayout      = lazy(() => import('./layouts/AppLayout').then(m => ({ default: m.AppLayout })))
const LoginPage      = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage   = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const DashboardPage  = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const MindyPage      = lazy(() => import('./pages/MindyPage').then(m => ({ default: m.MindyPage })))
const NotesPage      = lazy(() => import('./pages/NotesPage').then(m => ({ default: m.NotesPage })))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage').then(m => ({ default: m.FlashcardsPage })))
const QuizzesPage    = lazy(() => import('./pages/QuizzesPage').then(m => ({ default: m.QuizzesPage })))
const ResearchPage   = lazy(() => import('./pages/ResearchPage').then(m => ({ default: m.ResearchPage })))
const CalendarPage   = lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })))
const ClientsPage    = lazy(() => import('./pages/ClientsPage').then(m => ({ default: m.ClientsPage })))
const SettingsPage   = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const HelpPage       = lazy(() => import('./pages/HelpPage').then(m => ({ default: m.HelpPage })))
const DocumentsPage  = lazy(() => import('./pages/DocumentsPage').then(m => ({ default: m.DocumentsPage })))
const StudyBoxPage = lazy(() => import('./pages/StudyBoxPage').then(m => ({ default: m.StudyBoxPage })))
const DSMPage      = lazy(() => import('./pages/DSMPage').then(m => ({ default: m.DSMPage })))

// ── Protected Route ──
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const isSessionReady = useAuthStore(state => state.isSessionReady)
  const user = useAuthStore(state => state.user)
  const location = useLocation()
  if (!isSessionReady) return null
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (!user || !['student', 'professional', 'admin'].includes(user.role)) return <Navigate to="/account-type" replace />
  return children
}

function ClinicalRoute({ children }: { children: React.ReactNode }) {
  const role = useAuthStore(state => state.user?.role)
  return role === 'professional' || role === 'admin' ? children : <Navigate to="/dashboard" replace />
}

// ── Public Route ──
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isSessionReady = useAuthStore(state => state.isSessionReady)
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  if (!isSessionReady) return null
  if (isAuthenticated) return <Navigate to="/dashboard" state={{ from: location }} replace />
  return children
}

// ── Page order for direction detection ──
const PAGE_ORDER = [
  '/dashboard',
  '/mindy',
  '/notes',
  '/flashcards',
  '/quizzes',
  '/research',
  '/dsm',
  '/documents',
  '/library',
  '/calendar',
  '/clients',
  '/settings',
  '/help',
]

// ── Route Transition ──
// Uses the globally-set TransitionStyle from context, direction-aware
function RouteTransition({ children }: { children: React.ReactNode }) {
  useStartupReady()
  const location = useLocation()
  const prevPathRef = useRef<string>(location.pathname)
  const { active } = useTransitionStyle()

  // Reset once the destination page commits, including lazy-loaded routes.
  // `instant` overrides the document's smooth scrolling preference.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  const prevIdx = PAGE_ORDER.indexOf(prevPathRef.current)
  const currIdx = PAGE_ORDER.indexOf(location.pathname)
  const isForward = currIdx > prevIdx

  // For directional transitions, pick opposing direction for backward navigation
  const getVariant = () => {
    const base = TRANSITIONS[active] ?? TRANSITIONS[DEFAULT_TRANSITION]

    // Direction-aware: flip left↔right / up↔down for backward nav
    if (prevIdx !== -1 && currIdx !== -1 && !isForward) {
      // Automatically use the mirror direction for back navigation
      const mirrorMap: Partial<Record<string, string>> = {
        'cube-right':    'cube-left',
        'cube-left':     'cube-right',
        'cube-up':       'cube-down',
        'cube-down':     'cube-up',
        'slide-right':   'slide-left',
        'slide-left':    'slide-right',
        'slide-up':      'slide-down',
        'slide-down':    'slide-up',
        'wipe-right':    'wipe-left',
        'wipe-left':     'wipe-right',
        'wipe-up':       'wipe-down',
        'wipe-down':     'wipe-up',
        'swap-right':    'swap-left',
        'swap-left':     'swap-right',
        'swap-up':       'swap-down',
        'swap-down':     'swap-up',
        'skew-right':    'skew-left',
        'skew-left':     'skew-right',
        'skew-up':       'skew-down',
        'skew-down':     'skew-up',
        'uncover-right': 'uncover-left',
        'uncover-left':  'uncover-right',
        'uncover-up':    'uncover-down',
        'uncover-down':  'uncover-up',
      }
      const mirror = mirrorMap[active]
      if (mirror) return TRANSITIONS[mirror as keyof typeof TRANSITIONS] ?? base
    }
    return base
  }

  const reducedMotion = useMotionPreference()
  const variant = reducedMotion ? TRANSITIONS.fade : getVariant()

  useEffect(() => {
    prevPathRef.current = location.pathname
  }, [location.pathname])

  return (
    <motion.div
      key={location.pathname}
      className="route-content"
      initial={reducedMotion ? false : variant.initial as any}
      animate={{ ...variant.animate, transitionEnd: { ...variant.animate.transitionEnd, filter: 'none', transform: 'none', clipPath: 'none', willChange: 'auto' } }}
      style={{
        transformOrigin: 'center center',
        width: '100%',
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Inner App (needs TransitionProvider in tree) ──
function InnerApp() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = previous }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      <Route element={<AuthLayout />}><Route path="/forgot-password" element={<PasswordPage/>}/><Route path="/reset-password" element={<PasswordPage reset/>}/><Route path="/account-type" element={<AccountTypePage />} /><Route path="/auth/callback" element={<AuthCallbackPage />} /></Route>
      {/* Public Routes */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/login"    element={<RouteTransition><LoginPage /></RouteTransition>} />
        <Route path="/register" element={<RouteTransition><RegisterPage /></RouteTransition>} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/"           element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"  element={<RouteTransition><DashboardPage /></RouteTransition>} />
        <Route path="/mindy"      element={<RouteTransition><MindyPage /></RouteTransition>} />
        <Route path="/notes"      element={<RouteTransition><NotesPage /></RouteTransition>} />
        <Route path="/flashcards" element={<RouteTransition><FlashcardsPage /></RouteTransition>} />
        <Route path="/quizzes"    element={<RouteTransition><QuizzesPage /></RouteTransition>} />
        <Route path="/research"   element={<RouteTransition><ResearchPage /></RouteTransition>} />
        <Route path="/documents"  element={<RouteTransition><DocumentsPage /></RouteTransition>} />
        <Route path="/library" element={<RouteTransition><StudyBoxPage /></RouteTransition>} />
        <Route path="/study-box" element={<Navigate to="/library" replace />} />
        <Route path="/dsm"      element={<RouteTransition><DSMPage /></RouteTransition>} />
        <Route path="/calendar"   element={<RouteTransition><CalendarPage /></RouteTransition>} />
        <Route path="/sessions"   element={<ClinicalRoute><RouteTransition><CalendarPage /></RouteTransition></ClinicalRoute>} />
        <Route path="/clients"    element={<ClinicalRoute><RouteTransition><ClientsPage /></RouteTransition></ClinicalRoute>} />
        <Route path="/settings"   element={<RouteTransition><SettingsPage /></RouteTransition>} />
        <Route path="/help"       element={<RouteTransition><HelpPage /></RouteTransition>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

// ── Root App ──
function App() {
  return (
    <TransitionProvider>
      <StartupBoundary><InnerApp /></StartupBoundary>
    </TransitionProvider>
  )
}

// ── 404 Page ──
function NotFoundPage() {
  useStartupReady()
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        className="text-center max-w-sm p-8 rounded-xl bg-white border border-slate-200"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
          <HelpIcon size={28} weight="duotone" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          404
        </h1>

        <p className="text-sm font-semibold text-slate-700 mb-2">
          Page Not Found
        </p>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          The requested clinical tool or learning resource does not exist or has moved.
        </p>

        <a
          href="/dashboard"
          className="btn btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <BrainIcon size={16} weight="duotone" />
          Return to Dashboard
        </a>
      </motion.div>
    </div>
  )
}

export default App
