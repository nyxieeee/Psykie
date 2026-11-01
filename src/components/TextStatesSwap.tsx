import { useRef, useState, useEffect, ReactNode } from 'react'

const __TRANSITION_STYLES = `
:root {
  --text-swap-dur: 150ms;
  --text-swap-translate-y: 4px;
  --text-swap-blur: 2px;
  --text-swap-ease: ease-in-out;
}

.t-text-swap {
  display: inline-block;
  transform: translateY(0);
  filter: blur(0);
  opacity: 1;
  transition:
    transform var(--text-swap-dur) var(--text-swap-ease),
    filter    var(--text-swap-dur) var(--text-swap-ease),
    opacity   var(--text-swap-dur) var(--text-swap-ease);
  will-change: transform, filter, opacity;
}
.t-text-swap.is-exit {
  transform: translateY(calc(var(--text-swap-translate-y) * -1));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
}
.t-text-swap.is-enter-start {
  transform: translateY(var(--text-swap-translate-y));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
  transition: none !important;
}

@media (prefers-reduced-motion: reduce) {
  .t-text-swap { transition: none !important; }
}
`

if (typeof document !== 'undefined' && !document.getElementById('transitions-p6')) {
  const __style = document.createElement('style')
  __style.id = 'transitions-p6'
  __style.textContent = __TRANSITION_STYLES
  document.head.appendChild(__style)
}

function readMs(name: string, fallback: number): number {
  if (typeof document === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

export interface TextStatesSwapProps {
  /** Single dynamic text prop: animates whenever value changes */
  text?: ReactNode
  /** Array of messages to cycle through */
  messages?: string[]
  className?: string
  onClick?: () => void
}

export function TextStatesSwap({
  text,
  messages,
  className = '',
  onClick,
}: TextStatesSwapProps) {
  const [currentContent, setCurrentContent] = useState<ReactNode>(
    text !== undefined ? text : messages?.[0] ?? ''
  )
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const busy = useRef(false)
  const initialMount = useRef(true)

  // React to prop `text` changes
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false
      return
    }
    if (text === undefined) return
    const el = ref.current
    if (!el || busy.current) {
      setCurrentContent(text)
      return
    }

    busy.current = true
    const dur = readMs('--text-swap-dur', 150)

    el.classList.add('is-exit')
    const timer = window.setTimeout(() => {
      setCurrentContent(text)
      el.classList.remove('is-exit')
      el.classList.add('is-enter-start')
      void el.offsetWidth // force reflow
      el.classList.remove('is-enter-start')
      busy.current = false
    }, dur)

    return () => clearTimeout(timer)
  }, [text])

  // Cycle messages on click if provided
  const handleNext = () => {
    if (messages && messages.length > 1 && !busy.current) {
      const el = ref.current
      if (!el) return
      busy.current = true
      const dur = readMs('--text-swap-dur', 150)

      el.classList.add('is-exit')
      window.setTimeout(() => {
        const nextIdx = (index + 1) % messages.length
        setIndex(nextIdx)
        setCurrentContent(messages[nextIdx])
        el.classList.remove('is-exit')
        el.classList.add('is-enter-start')
        void el.offsetWidth
        el.classList.remove('is-enter-start')
        busy.current = false
      }, dur)
    }
    onClick?.()
  }

  return (
    <span
      ref={ref}
      className={`t-text-swap ${className}`.trim()}
      onClick={handleNext}
    >
      {currentContent}
    </span>
  )
}
