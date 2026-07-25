import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const { login, error, isLoading: authLoading } = useAuthStore()
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    setIsLoading(true)
    const success = await login({ email, password })
    setIsLoading(false)
    
    if (success) {
      navigate(from, { replace: true })
    }
  }

  const demoUsers = [
    { email: 'student@psykie.com', password: 'password', role: 'Student' },
    { email: 'professional@psykie.com', password: 'password', role: 'Professional' },
    { email: 'admin@psykie.com', password: 'password', role: 'Admin' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.h2
          className="text-3xl font-bold text-gradient mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Welcome Back
        </motion.h2>
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Sign in to access your psychology companion
        </motion.p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <p className="text-red-500 text-sm">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-solid"
              required
            />
            <motion.span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              animate={{ opacity: email ? 0 : 1 }}
            >
              ✉️
            </motion.span>
          </div>
        </motion.div>

        {/* Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-solid pr-12"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? '👁️' : '🔒'}
            </motion.button>
          </div>
        </motion.div>

        {/* Forgot Password */}
        <motion.div
          className="flex justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <motion.button
            type="button"
            className="text-sm text-purple-600 hover:text-purple-700"
            whileHover={{ x: 4 }}
          >
            Forgot password?
          </motion.button>
        </motion.div>

        {/* Login Button */}
        <motion.button
          type="submit"
          disabled={isLoading || authLoading || !email || !password}
          className="w-full btn-primary py-4 text-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {isLoading || authLoading ? (
            <motion.span
              className="flex items-center justify-center gap-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <motion.span
                className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Signing in...
            </motion.span>
          ) : (
            'Sign In'
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <motion.div
        className="my-6 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </motion.div>

      {/* Demo Accounts */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <motion.p
          className="text-sm text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          Try demo accounts:
        </motion.p>
        <div className="grid grid-cols-1 gap-2">
          {demoUsers.map((user, index) => (
            <motion.button
              key={user.email}
              type="button"
              onClick={() => {
                setEmail(user.email)
                setPassword(user.password)
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <span>{user.role === 'Student' ? '🎓' : user.role === 'Professional' ? '👨‍💼' : '👑'}</span>
                <span className="text-sm text-gray-600">{user.role}</span>
              </div>
              <motion.span
                className="text-xs text-gray-400"
                whileHover={{ x: 5 }}
              >
                {user.email}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sign Up Link */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          Don&apos;t have an account?{' '}
          <motion.button
            type="button"
            onClick={() => navigate('/register')}
            className="text-purple-600 font-semibold hover:text-purple-700"
            whileHover={{ x: 4 }}
          >
            Sign Up
          </motion.button>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
