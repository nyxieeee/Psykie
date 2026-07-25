import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore, useIsAuthenticated } from './store'
import { Brain, HelpCircle } from 'lucide-react'

// Lazy load pages for code splitting
const AuthLayout = lazy(() => import('./layouts/AuthLayout').then(m => ({ default: m.AuthLayout })))
const AppLayout = lazy(() => import('./layouts/AppLayout').then(m => ({ default: m.AppLayout })))

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))

// App Pages
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const MindyPage = lazy(() => import('./pages/MindyPage').then(m => ({ default: m.MindyPage })))
const NotesPage = lazy(() => import('./pages/NotesPage').then(m => ({ default: m.NotesPage })))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage').then(m => ({ default: m.FlashcardsPage })))
const QuizzesPage = lazy(() => import('./pages/QuizzesPage').then(m => ({ default: m.QuizzesPage })))
const ResearchPage = lazy(() => import('./pages/ResearchPage').then(m => ({ default: m.ResearchPage })))
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })))
const ClientsPage = lazy(() => import('./pages/ClientsPage').then(m => ({ default: m.ClientsPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const HelpPage = lazy(() => import('./pages/HelpPage').then(m => ({ default: m.HelpPage })))

// Loading Fallback
function LoadingFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20"
    >
      <motion.div
        className="relative"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        {/* 3D Brain Loader */}
        <motion.div
          className="w-20 h-20 rounded-full border-2 border-indigo-300/50"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <Brain size={32} className="text-indigo-600" />
          </motion.div>
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-indigo-400"
              style={{
                top: `${50 + 30 * Math.sin((i / 6) * Math.PI * 2)}%`,
                left: `${50 + 30 * Math.cos((i / 6) * Math.PI * 2)}%`,
              }}
              animate={{ scale: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
        <motion.p
          className="mt-6 text-indigo-600 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Loading Psykie...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return children
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }
  
  return children
}

// Route Transition Component
function RouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Main App Component
function App() {
  const { checkAuth } = useAuthStore()
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes (Auth) */}
        <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="/login" element={<RouteTransition><LoginPage /></RouteTransition>} />
          <Route path="/register" element={<RouteTransition><RegisterPage /></RouteTransition>} />
        </Route>
        
        {/* Protected Routes (App) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<RouteTransition><DashboardPage /></RouteTransition>} />
          <Route path="/mindy" element={<RouteTransition><MindyPage /></RouteTransition>} />
          <Route path="/notes" element={<RouteTransition><NotesPage /></RouteTransition>} />
          <Route path="/flashcards" element={<RouteTransition><FlashcardsPage /></RouteTransition>} />
          <Route path="/quizzes" element={<RouteTransition><QuizzesPage /></RouteTransition>} />
          <Route path="/research" element={<RouteTransition><ResearchPage /></RouteTransition>} />
          <Route path="/calendar" element={<RouteTransition><CalendarPage /></RouteTransition>} />
          <Route path="/clients" element={<RouteTransition><ClientsPage /></RouteTransition>} />
          <Route path="/settings" element={<RouteTransition><SettingsPage /></RouteTransition>} />
          <Route path="/help" element={<RouteTransition><HelpPage /></RouteTransition>} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

// 404 Page
function NotFoundPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20"
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <HelpCircle size={60} className="text-indigo-600" />
        </motion.div>
        <motion.h1
          className="text-5xl font-bold text-gradient mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Oops! The page you're looking for doesn't exist.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-8 py-3"
          >
            <a href="/dashboard">Go to Dashboard</a>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default App
