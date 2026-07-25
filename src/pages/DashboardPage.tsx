import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../store'
import { Link } from 'react-router-dom'
import * as React from 'react'
import {
  Brain, Heart, Clock, FileText, HelpCircle, BarChart3, TrendingUp, TrendingDown,
  Lightbulb, Target, BookOpen, Calendar, Users, Award, Plus, ArrowRight
} from 'lucide-react'

export function DashboardPage() {
  const user = useUser()
  const [stats, setStats] = useState({
    studyHours: 0,
    flashcards: 0,
    quizzes: 0,
    notes: 0,
  })
  const [recentActivity, setRecentActivity] = useState<{id: string; type: string; title: string; time: string; icon: React.ReactNode}[]>([])
  const [upcoming, setUpcoming] = useState<{id: string; type: string; title: string; time: string; color: string}[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        studyHours: 12.5,
        flashcards: 42,
        quizzes: 8,
        notes: 15,
      })
      
      setRecentActivity([
        { id: '1', type: 'Study Session', title: 'Cognitive Psychology', time: '2 hours ago', icon: <Brain size={18} /> },
        { id: '2', type: 'Flashcards', title: 'Memory Techniques', time: '5 hours ago', icon: <Heart size={18} /> },
        { id: '3', type: 'Quiz', title: 'Board Exam Practice', time: '1 day ago', icon: <HelpCircle size={18} /> },
        { id: '4', type: 'Note', title: 'Research Summary', time: '2 days ago', icon: <FileText size={18} /> },
      ])
      
      setUpcoming([
        { id: '1', type: 'Exam', title: 'Board Review', time: 'Tomorrow, 10:00 AM', color: 'bg-amber-100' },
        { id: '2', type: 'Session', title: 'Client Meeting', time: 'In 2 days', color: 'bg-purple-100' },
        { id: '3', type: 'Deadline', title: 'Research Paper', time: 'In 1 week', color: 'bg-pink-100' },
      ])
      
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const quickActions = [
    { 
      icon: <Brain size={24} />, 
      label: 'Chat with Mindy', 
      path: '/mindy',
      color: 'from-indigo-500 to-purple-500',
      desc: 'Get instant AI assistance'
    },
    { 
      icon: <FileText size={24} />, 
      label: 'Smart Notes', 
      path: '/notes',
      color: 'from-blue-500 to-cyan-500',
      desc: 'Upload and summarize documents'
    },
    { 
      icon: <Heart size={24} />, 
      label: 'Flashcards', 
      path: '/flashcards',
      color: 'from-emerald-500 to-teal-500',
      desc: 'Create and study cards'
    },
    { 
      icon: <HelpCircle size={24} />, 
      label: 'Take Quiz', 
      path: '/quizzes',
      color: 'from-amber-500 to-orange-500',
      desc: 'Test your knowledge'
    },
  ]

  const statItems = [
    { 
      label: 'Study Hours', 
      value: stats.studyHours,
      unit: 'hours',
      icon: <Clock size={20} />,
      color: 'bg-indigo-100',
      trend: '+12%'
    },
    { 
      label: 'Flashcards', 
      value: stats.flashcards,
      unit: 'cards',
      icon: <Heart size={20} />,
      color: 'bg-purple-100',
      trend: '+8%'
    },
    { 
      label: 'Quizzes', 
      value: stats.quizzes,
      unit: 'taken',
      icon: <HelpCircle size={20} />,
      color: 'bg-amber-100',
      trend: '+15%'
    },
    { 
      label: 'Notes', 
      value: stats.notes,
      unit: 'saved',
      icon: <FileText size={20} />,
      color: 'bg-blue-100',
      trend: '+20%'
    },
  ]

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <motion.div
          className="relative"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <motion.div
            className="w-20 h-20 rounded-full border-2 border-purple-300/50"
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
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl lg:text-5xl font-bold text-gradient mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </motion.h1>
        <motion.p
          className="text-slate-500 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {user?.role === 'professional' 
            ? "Here's your professional dashboard"
            : "Continue your psychology learning journey"}
        </motion.p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card card-3d"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-2xl`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {stat.icon}
              </motion.div>
              <motion.span
                className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                {stat.trend}
              </motion.span>
            </div>
            <motion.p
              className="text-3xl font-bold text-slate-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              {stat.value}
            </motion.p>
            <motion.p
              className="text-sm text-slate-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              {stat.label}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.h2
          className="text-2xl font-bold text-slate-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Quick Actions
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {quickActions.map((action, index) => (
            <Link to={action.path} key={action.label}>
              <motion.div
                className="card card-3d cursor-pointer group"
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <motion.h3
                  className="text-lg font-semibold text-slate-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  {action.label}
                </motion.h3>
                <motion.p
                  className="text-sm text-slate-500 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  {action.desc}
                </motion.p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <motion.h2
            className="text-xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Recent Activity
          </motion.h2>
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="card flex items-center gap-4 p-4 hover:border-purple-300 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl"
                  whileHover={{ scale: 1.1 }}
                >
                  {activity.icon}
                </motion.div>
                <div className="flex-1">
                  <motion.p
                    className="font-semibold text-slate-800"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  >
                    {activity.title}
                  </motion.p>
                  <motion.p
                    className="text-sm text-slate-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                  >
                    {activity.type} <span className="text-gray-400">•</span> {activity.time}
                  </motion.p>
                </div>
                <motion.div
                  className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Upcoming */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <motion.h2
            className="text-xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Upcoming
          </motion.h2>
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {upcoming.map((item, index) => (
              <motion.div
                key={item.id}
                className="card p-4 flex items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full ${item.color}`}
                  whileHover={{ scale: 1.2 }}
                />
                <div className="flex-1">
                  <motion.p
                    className="font-semibold text-slate-800"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                  >
                    {item.title}
                  </motion.p>
                  <motion.p
                    className="text-sm text-slate-400"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  >
                    {item.time}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <motion.div
          className="flex items-start gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1 }}
        >
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-2xl flex-shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Lightbulb size={24} className="text-white" />
          </motion.div>
          <div>
            <motion.h3
              className="font-bold text-slate-800 text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.1 }}
            >
              Today's Tip
            </motion.h3>
            <motion.p
              className="text-slate-600 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              {user?.role === 'professional'
                ? "Remember to review your client notes before each session. Mindy can help you generate session summaries!"
                : "Spaced repetition is key to long-term retention. Try reviewing your flashcards daily for better memory retention."}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Action Button */}
      <motion.button
        className="fab"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2, type: 'spring', damping: 10, stiffness: 200 }}
        title="Quick Actions"
      >
        +
      </motion.button>
    </motion.div>
  )
}
