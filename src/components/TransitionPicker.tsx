/**
 * TransitionPicker — floating glass badge (bottom-right)
 *
 * Lets users switch between all transitions.style variants live.
 * Grouped by category: Cube, Wipe, Swap, Skew, Slide, Scale, Other
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TRANSITION_NAMES, type TransitionStyle } from '../utils/transitions'
import { useTransitionStyle } from '../context/TransitionContext'
import { SlidersHorizontal as FiltersIcon, X, CheckCircle } from '@phosphor-icons/react'

// Group by prefix
const GROUPS: { label: string; prefix: string }[] = [
  { label: '3D Cube',    prefix: 'cube' },
  { label: '3D Swap',    prefix: 'swap' },
  { label: 'Wipe',       prefix: 'wipe' },
  { label: 'Skew',       prefix: 'skew' },
  { label: 'Slide',      prefix: 'slide' },
  { label: 'Scale',      prefix: 'scale' },
  { label: 'Uncover',    prefix: 'uncover' },
  { label: 'Other',      prefix: '' },
]

const OTHER_PREFIXES = GROUPS.filter(g => g.prefix).map(g => g.prefix)

export function TransitionPicker() {
  const { active, setActive } = useTransitionStyle()
  const [open, setOpen] = useState(false)

  const grouped = GROUPS.map(g => ({
    label: g.label,
    items: TRANSITION_NAMES.filter(n =>
      g.prefix
        ? n.value.startsWith(g.prefix)
        : !OTHER_PREFIXES.some(p => n.value.startsWith(p))
    ),
  })).filter(g => g.items.length > 0)

  return (
    <>
      {/* Trigger badge */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-[9990] cursor-pointer"
        title="Page Transitions (transitions.style)"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
      >
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-extrabold"
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,110,180,0.32)',
            boxShadow: '0 4px 20px rgba(255,110,180,0.22), 0 1px 4px rgba(0,0,0,0.06)',
            color: '#E91E8C',
          }}
        >
          <motion.span
            animate={open ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiltersIcon size={15} weight="bold" />
          </motion.span>
          <span style={{ fontFamily: 'Nunito, sans-serif' }}>
            {TRANSITION_NAMES.find(n => n.value === active)?.label ?? 'Transition'}
          </span>
        </div>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[9985]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Glass panel */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,  y: 16, scale: 0.95 }}
              transition={{ duration: 0.22, type: 'spring', damping: 20 }}
              className="fixed bottom-16 right-4 z-[9995] w-[340px] max-h-[70vh] overflow-y-auto rounded-3xl p-5 space-y-4"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(32px) saturate(200%)',
                WebkitBackdropFilter: 'blur(32px) saturate(200%)',
                border: '1px solid rgba(255,110,180,0.22)',
                boxShadow: '0 24px 60px rgba(255,110,180,0.18), 0 6px 20px rgba(0,0,0,0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black" style={{ color: '#8B1A4A', fontFamily: 'Nunito, sans-serif' }}>
                    Page Transitions
                  </h3>
                  <p className="text-[10px] font-semibold" style={{ color: '#C06080' }}>
                    Powered by{' '}
                    <a
                      href="https://transitions.style"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-pink-600"
                      onClick={e => e.stopPropagation()}
                    >
                      transitions.style
                    </a>
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-pink-50 cursor-pointer"
                  style={{ color: '#C06080' }}
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Groups */}
              {grouped.map(group => (
                <div key={group.label}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-2 px-0.5"
                    style={{ color: '#E91E8C', opacity: 0.7 }}>
                    {group.label}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {group.items.map(item => {
                      const isActive = active === item.value
                      return (
                        <motion.button
                          key={item.value}
                          onClick={() => { setActive(item.value as TransitionStyle); setOpen(false) }}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative px-2 py-2 rounded-xl text-[10px] font-bold text-left cursor-pointer transition-all"
                          style={{
                            background: isActive
                              ? 'linear-gradient(135deg, rgba(255,110,180,0.2), rgba(233,30,140,0.12))'
                              : 'rgba(255,240,246,0.7)',
                            border: isActive
                              ? '1px solid rgba(255,110,180,0.4)'
                              : '1px solid rgba(255,110,180,0.1)',
                            color: isActive ? '#C0157A' : '#8B1A4A',
                            boxShadow: isActive
                              ? '0 2px 8px rgba(255,110,180,0.2)'
                              : 'none',
                          }}
                        >
                          {isActive && (
                            <motion.span
                              className="absolute top-1.5 right-1.5"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', damping: 12 }}
                            >
                              <CheckCircle size={10} weight="fill" color="#E91E8C" />
                            </motion.span>
                          )}
                          {item.label}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Active info */}
              <div
                className="text-center py-2 rounded-xl text-[10px] font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,110,180,0.1), rgba(233,30,140,0.06))',
                  border: '1px solid rgba(255,110,180,0.15)',
                  color: '#E91E8C',
                }}
              >
                Active: {TRANSITION_NAMES.find(n => n.value === active)?.label}
                <span style={{ color: '#C06080', fontWeight: 400 }}> — navigate between pages to preview</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
