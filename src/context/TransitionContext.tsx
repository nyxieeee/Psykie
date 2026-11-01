/**
 * TransitionContext — global page transition preference
 *
 * Persisted to localStorage. Consumed by RouteTransition in App.tsx
 * and optionally exposed via a picker component.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type TransitionStyle, DEFAULT_TRANSITION, TRANSITIONS } from '../utils/transitions'

const LS_KEY = 'psykie-transition'

function loadSaved(): TransitionStyle {
  try {
    let saved = localStorage.getItem(LS_KEY)
    // Older builds overwrote every preference with the glass-depth effect.
    if (!localStorage.getItem('psykie-transition-migrated')) {
      if (saved === '3d-glass-depth') {
        saved = DEFAULT_TRANSITION
        localStorage.setItem(LS_KEY, saved)
      }
      localStorage.setItem('psykie-transition-migrated', '1')
    }
    if (saved && Object.prototype.hasOwnProperty.call(TRANSITIONS, saved)) return saved as TransitionStyle
  } catch { /* Storage may be unavailable. */ }
  return DEFAULT_TRANSITION
}

interface TransitionCtx {
  active: TransitionStyle
  setActive: (t: TransitionStyle) => void
}

const Ctx = createContext<TransitionCtx>({
  active: DEFAULT_TRANSITION,
  setActive: () => undefined,
})

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<TransitionStyle>(loadSaved)

  const setActive = useCallback((t: TransitionStyle) => {
    setActiveState(t)
    try { localStorage.setItem(LS_KEY, t) } catch { /* ignore */ }
  }, [])

  return <Ctx.Provider value={{ active, setActive }}>{children}</Ctx.Provider>
}

export function useTransitionStyle() {
  return useContext(Ctx)
}
