import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface LoadingScreenProps {
  fullScreen?: boolean
  label?: string
  description?: string
}

export function LoadingScreen({
  fullScreen = true,
  label = 'Loading your psychology sanctuary...',
  description = 'Preparing study notes, flashcards & Mindy AI',
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const steps = [
      { target: 25, delay: 0 },
      { target: 50, delay: 250 },
      { target: 75, delay: 600 },
      { target: 92, delay: 1100 },
      { target: 100, delay: 1600 },
    ]
    const timers: number[] = steps.map(({ target, delay }) =>
      window.setTimeout(() => setProgress(target), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // 4 dots appearing and disappearing animation
  const renderFourDots = (size = 8) => (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1.3, 1, 0.3],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.22,
            ease: 'easeInOut',
          }}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: ['#FF66A3', '#FF85BF', '#C084FC', '#A855F7'][i],
            boxShadow: '0 0 10px rgba(255, 102, 163, 0.6)',
          }}
        />
      ))}
    </div>
  )

  if (!fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] w-full p-8 select-none rounded-3xl bg-white/70 backdrop-blur-md border border-pink-200/60 shadow-lg shadow-pink-500/5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4"
        >
          {/* Logo image with breathing effect */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <img
              src="/mindy-mascot.png"
              alt="Psykie Mascot"
              className="w-20 h-20 object-contain drop-shadow-[0_10px_20px_rgba(255,102,163,0.35)]"
            />
          </motion.div>

          <div className="text-center">
            <h3 className="text-sm font-bold text-pink-700 tracking-wide">
              {label}
            </h3>
            {description && (
              <p className="text-xs text-neutral-500 mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Stepped Progress Bar */}
          <div
            className="w-48 h-1.5 rounded-full overflow-hidden"
            style={{
              background: 'rgba(255, 182, 217, 0.35)',
              boxShadow: 'inset 0 1px 2px rgba(233, 30, 140, 0.1)',
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #FF6EB4, #FF4D94, #A855F7)',
                boxShadow: '0 0 8px rgba(255, 110, 180, 0.6)',
              }}
            />
          </div>

          {/* 4 dots appearing and disappearing */}
          {renderFourDots(7)}
        </motion.div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #FFF0F6 0%, #FAF5FF 50%, #FFE4F0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: "'Nunito', 'Quicksand', sans-serif",
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Dreamy floating background bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #FFB6D9 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #D8B4FE 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #FFE4F0 0%, transparent 70%)' }}
        />
      </div>

      {/* Main loading card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-5 p-8 sm:p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-2xl shadow-pink-500/10 max-w-sm w-full mx-4"
      >
        {/* Mascot Logo with gentle float */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 1.5, -1.5, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <img
            src="/mindy-mascot.png"
            alt="Psykie Mascot"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_12px_28px_rgba(255,102,163,0.45)]"
          />
          <div className="absolute -top-2 -right-2 text-pink-400 text-lg animate-pulse">
            ✨
          </div>
          <div className="absolute -bottom-1 -left-2 text-purple-400 text-base animate-pulse delay-300">
            🌸
          </div>
        </motion.div>

        {/* Title & Brand */}
        <div className="text-center">
          <div className="text-2xl font-black bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
            Psykie
          </div>
          <p className="text-xs font-semibold text-neutral-400 tracking-wide mt-0.5">
            Your AI Psychology Study Companion
          </p>
        </div>

        {/* Label & Description */}
        <div className="text-center px-2">
          <div className="text-sm font-bold text-neutral-700">
            {label}
          </div>
          {description && (
            <div className="text-xs text-neutral-400 mt-1">
              {description}
            </div>
          )}
        </div>

        {/* Stepped Progress Bar */}
        <div
          className="w-56 h-2 rounded-full overflow-hidden p-0.5"
          style={{
            background: 'rgba(255, 182, 217, 0.35)',
            boxShadow: 'inset 0 1px 3px rgba(233, 30, 140, 0.12)',
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #FF6EB4 0%, #FF4D94 50%, #A855F7 100%)',
              boxShadow: '0 0 12px rgba(255, 110, 180, 0.7)',
            }}
          />
        </div>

        {/* 4 dots appearing and disappearing */}
        <div className="flex flex-col items-center gap-2 pt-1">
          {renderFourDots(9)}
          <span className="text-[11px] font-semibold text-pink-400 tracking-wider">
            {progress}%
          </span>
        </div>
      </motion.div>
    </div>
  )
}
