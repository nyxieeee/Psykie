import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'student' | 'professional'>('student')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { register, isLoading: authLoading } = useAuthStore()

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setError(null)
    
    const success = await register({ 
      name, 
      email, 
      password, 
      role 
    })
    
    setIsLoading(false)
    
    if (success) {
      navigate(from, { replace: true })
    }
  }

  const roleOptions = [
    { value: 'student', label: 'Student', icon: '🎓', description: 'For psychology students and learners' },
    { value: 'professional', label: 'Professional', icon: '👨‍💼', description: 'For licensed psychologists and clinicians' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
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
          Create Account
        </motion.h2>
        <motion.p
          className="text-slate-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Join Psykie and start your psychology journey
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
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="input-solid"
              required
            />
            <motion.span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              animate={{ opacity: name ? 0 : 1 }}
            >
              👤
            </motion.span>
          </div>
        </motion.div>

        {/* Email Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
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
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="input-solid pr-12"
              required
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? '👁️' : '🔒'}
            </motion.button>
          </div>
          <motion.p
            className="text-xs text-slate-400 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            Must be at least 6 characters
          </motion.p>
        </motion.div>

        {/* Confirm Password Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="input-solid pr-12"
              required
            />
            <motion.span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              animate={{ opacity: confirmPassword ? 0 : 1 }}
            >
              🔒
            </motion.span>
          </div>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Account Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {roleOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value as 'student' | 'professional')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  role === option.value
                    ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">{option.icon}</span>
                  <span className="font-semibold text-slate-700">{option.label}</span>
                  <span className="text-xs text-slate-400 mt-1 text-center">
                    {option.description}
                  </span>
                </div>
                {role === option.value && (
                  <motion.div
                    className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Register Button */}
        <motion.button
          type="submit"
          disabled={isLoading || authLoading || !name || !email || !password || !confirmPassword}
          className="w-full btn-primary py-4 text-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
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
              Creating Account...
            </motion.span>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <motion.div
        className="my-6 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-sm text-slate-400">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </motion.div>

      {/* Already have account */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1 }}
      >
        <motion.p
          className="text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          Already have an account?{' '}
          <motion.button
            type="button"
            onClick={() => navigate('/login')}
            className="text-purple-600 font-semibold hover:text-purple-700"
            whileHover={{ x: 4 }}
          >
            Sign In
          </motion.button>
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
