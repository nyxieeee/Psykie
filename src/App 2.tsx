import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Features } from './pages/Features'
import { Students } from './pages/Students'
import { Professionals } from './pages/Professionals'
import { Mindy } from './pages/Mindy'
import { About } from './pages/About'
import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))

function LoadingFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center"
    >
      <motion.div
        className="w-24 h-24 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <motion.span
          className="text-4xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🧠
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center mx-auto mb-6"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="text-5xl">❓</span>
        </motion.div>
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #FFF 0%, #FFD1DC 50%, #E6E6FA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </motion.h1>
        <motion.p
          className="text-xl text-pastel-pink/80 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Page not found
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.1, x: 10 }}
          whileTap={{ scale: 0.95 }}
          className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pastel-pink to-pastel-lavender text-white font-bold text-xl hover:shadow-glow-pink-lg transition-all border-0"
        >
          <a href="/">Go Home</a>
        </motion.button>
      </motion.div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="students" element={<Students />} />
          <Route path="students/dashboard" element={<Dashboard />} />
          <Route path="students/tutor" element={<Mindy />} />
          <Route path="students/notes" element={<div className="min-h-screen pt-24 container mx-auto px-6">Smart Notes (Coming Soon)</div>} />
          <Route path="students/board-review" element={<div className="min-h-screen pt-24 container mx-auto px-6">Board Review (Coming Soon)</div>} />
          <Route path="students/research" element={<div className="min-h-screen pt-24 container mx-auto px-6">Research Assistant (Coming Soon)</div>} />
          <Route path="professionals" element={<Professionals />} />
          <Route path="professionals/clients" element={<div className="min-h-screen pt-24 container mx-auto px-6">Client Management (Coming Soon)</div>} />
          <Route path="professionals/therapy" element={<div className="min-h-screen pt-24 container mx-auto px-6">Therapy Library (Coming Soon)</div>} />
          <Route path="mindy" element={<Mindy />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
