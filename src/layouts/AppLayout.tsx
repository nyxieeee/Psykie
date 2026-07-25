import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useUser } from '../store'
import { Canvas } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import {
  Home, Brain, FileText, Heart, HelpCircle, Settings, Info, User,
  ChevronLeft, ChevronRight, Search, Bell, Clock, Calendar, Users,
  BookOpen, X, Menu
} from 'lucide-react'

// 3D Brain Background Component
function BrainBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 60 }}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#6366F1" />
      
      {/* Brain-shaped particle cloud */}
      <Points
        positions={Array.from({ length: 3000 }, () => ({
          x: (Math.random() - 0.5) * 15,
          y: (Math.random() - 0.5) * 12,
          z: (Math.random() - 0.5) * 10,
        }))}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#6366F1"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Secondary particles for depth */}
      <Points
        positions={Array.from({ length: 1500 }, () => ({
          x: (Math.random() - 0.5) * 12,
          y: (Math.random() - 0.5) * 10,
          z: (Math.random() - 0.5) * 8,
        }))}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#4F46E5"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </Canvas>
  )
}

// Sidebar Navigation Item
interface NavItemProps {
  icon: React.ReactNode
  label: string
  path: string
  isActive: boolean
  badge?: number | string
  onClick: () => void
}

function NavItem({ icon, label, path, isActive, badge, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 font-semibold'
          : 'text-gray-600 hover:bg-white/50 hover:text-indigo-600'
      }`}
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.span
        className="text-xl"
        animate={{ 
          scale: isActive ? [1, 1.1, 1] : 1,
          rotate: isActive ? [0, 5, -5, 0] : 0
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <motion.span
          className="px-2 py-1 text-xs bg-indigo-500 text-white rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  )
}

// Sidebar Component
function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useUser()
  const [collapsed, setCollapsed] = useState(false)

  const mainNav = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Brain size={20} />, label: 'Mindy', path: '/mindy', badge: 'AI' },
    { icon: <FileText size={20} />, label: 'Smart Notes', path: '/notes' },
    { icon: <Heart size={20} />, label: 'Flashcards', path: '/flashcards' },
    { icon: <HelpCircle size={20} />, label: 'Quizzes', path: '/quizzes' },
    { icon: <BookOpen size={20} />, label: 'Research', path: '/research' },
  ]

  const professionalNav = [
    { icon: <Calendar size={20} />, label: 'Calendar', path: '/calendar' },
    { icon: <Users size={20} />, label: 'Clients', path: '/clients' },
  ]

  const bottomNav = [
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    { icon: <Info size={20} />, label: 'Help', path: '/help' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <motion.aside
      className={`fixed left-0 top-0 bottom-0 z-40 liquid-glass border-r border-white/20 ${collapsed ? 'w-20' : 'w-72'}`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Logo */}
      <motion.div
        className="p-6 border-b border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Brain size={24} className="text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <span className="text-xl font-bold text-gradient">Psykie</span>
                <p className="text-xs text-gray-500">AI Assistant</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* User Info */}
      {user && (
        <motion.div
          className="p-4 border-b border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ x: 4 }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-lg"
              whileHover={{ scale: 1.1 }}
            >
              {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-xl object-cover" /> : <User size={20} className="text-white" />}
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {/* Main Navigation */}
      <motion.nav
        className="flex flex-col gap-2 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4"
        >
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4"
              >
                Main
              </motion.p>
            )}
          </AnimatePresence>
          {mainNav.map((item) => (
            <NavItem
              key={item.path}
              {...item}
              isActive={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </motion.div>

        {/* Professional Section (for professionals only) */}
        {user?.role === 'professional' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-4"
          >
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4"
                >
                  Professional
                </motion.p>
              )}
            </AnimatePresence>
            {professionalNav.map((item) => (
              <NavItem
                key={item.path}
                {...item}
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </motion.div>
        )}
      </motion.nav>

      {/* Bottom Navigation */}
      <motion.div
        className="p-4 border-t border-white/20 mt-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {bottomNav.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            isActive={isActive(item.path)}
            onClick={() => navigate(item.path)}
          />
        ))}
        
        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </motion.span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.aside>
  )
}

// Top Navigation Bar
function TopNav() {
  const user = useUser()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTime = time.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
  const formattedDate = time.toLocaleDateString([], { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <motion.header
      className="fixed top-0 left-72 right-0 z-30 glass-nav px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.span
            className="text-gray-400"
            whileHover={{ color: '#6366F1' }}
          >
            {formattedDate}
          </motion.span>
          <motion.span
            className="text-gray-300"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Clock size={16} />
          </motion.span>
          <motion.span
            className="text-gray-600 font-medium"
          >
            {formattedTime}
          </motion.span>
        </motion.div>

        {/* User & Actions */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Quick Actions */}
          <motion.button
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Search"
          >
            <Search size={20} className="text-gray-600" />
          </motion.button>
          
          <motion.button
            className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Notifications"
          >
            <Bell size={20} className="text-gray-600" />
          </motion.button>
          
          {/* User Avatar */}
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-lg cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-xl object-cover" /> : <User size={20} className="text-white" />}
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  )
}

// Main Layout Component
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen">
      {/* 3D Background */}
      <BrainBackground />
      
      {/* Mobile Overlay */}
      <motion.div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: sidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Desktop & Mobile */}
      <motion.div
        className="fixed left-0 top-0 bottom-0 z-40"
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <Sidebar />
      </motion.div>

      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <motion.main
        className="fixed top-0 right-0 bottom-0 lg:left-72 z-10"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="p-6 lg:p-8 pt-20 lg:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>

      {/* Mobile Menu Toggle */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>
    </div>
  )
}
