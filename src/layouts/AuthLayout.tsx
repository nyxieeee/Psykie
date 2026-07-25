import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { Brain } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-pastel-cream via-pastel-blue/20 to-pastel-lavender/20">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 min-h-screen p-12 justify-center items-center"
      >
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Logo with 3D effect */}
          <motion.div
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-8"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.02, 1] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: 'easeInOut' 
            }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Brain size={40} className="text-indigo-600" />
            </motion.span>
          </motion.div>
          
          <motion.h1
            className="text-5xl font-bold text-gradient mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Psykie
          </motion.h1>
          
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Your AI-powered psychology companion for learning, research, and practice.
          </motion.p>
          
          {/* Floating particles */}
          <motion.div
            className="relative h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[...Array(8)].map((_, i) => {
              const size = Math.random() * 12 + 8
              const top = Math.random() * 80 + 10
              const left = Math.random() * 80 + 10
              const delay = Math.random() * 2
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-purple-300/50"
                  style={{ width: size, height: size, top: `${top}%`, left: `${left}%` }}
                  animate={{ 
                    y: [0, -20, 0], 
                    opacity: [0.5, 1, 0.5] 
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2, 
                    repeat: Infinity, 
                    delay 
                  }}
                />
              )
            })}
          </motion.div>
          
          {/* 3D Brain visualization */}
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              className="w-64 h-64 rounded-full border-2 border-purple-200/50 relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30"
                style={{ transform: 'translate(-50%, -50%)' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.span
                    className="text-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain size={24} className="text-indigo-600" />
                  </motion.span>
                </motion.div>
              </motion.div>
              {/* Orbiting particles */}
              {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * 360
                const x = 50 + 28 * Math.cos((angle * Math.PI) / 180)
                const y = 50 + 28 * Math.sin((angle * Math.PI) / 180)
                
                return (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-purple-400"
                    style={{ top: `${y}%`, left: `${x}%` }}
                    animate={{ 
                      scale: [0.8, 1.5, 0.8], 
                      opacity: [0.6, 1, 0.6] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.3 
                    }}
                  />
                )
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Right Side - Auth Forms */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 lg:w-1/2 min-h-screen p-8 lg:p-12 flex items-center justify-center"
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </motion.div>
    </div>
  )
}
