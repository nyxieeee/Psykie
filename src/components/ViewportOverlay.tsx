import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, type HTMLMotionProps } from 'framer-motion'

let openOverlays = 0
let previousOverflow = ''

type ViewportOverlayProps = HTMLMotionProps<'div'> & { onDismiss?: () => void }

/** Keep dialogs out of transformed, filtered, or clipped page ancestors. */
export function ViewportOverlay({ children, className = '', onDismiss, onClick, ...props }: ViewportOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    if (openOverlays++ === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    const overlay = ref.current
    const heading = overlay?.querySelector('h1,h2,h3')
    if (heading?.textContent) overlay?.setAttribute('aria-label', heading.textContent)
    const focusable = () => Array.from(overlay?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled),a[href],[tabindex="0"]') || []).filter(el => el.getClientRects().length && !el.closest('[aria-hidden="true"]'))
    const frame = requestAnimationFrame(() => (focusable()[0] || overlay)?.focus({ preventScroll: true }))
    const handleKey = (event: KeyboardEvent) => {
      const overlays = document.querySelectorAll('.viewport-overlay')
      if (overlays[overlays.length - 1] !== overlay) return
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        dismissRef.current?.()
      }
      if (event.key === 'Tab') {
        const items = focusable()
        const first = items[0], last = items[items.length - 1]
        if (!first) { event.preventDefault(); overlay?.focus(); return }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === overlay)) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === overlay)) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleKey, true)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKey, true)
      if (--openOverlays === 0) document.body.style.overflow = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(
    <motion.div {...props} ref={ref} className={`viewport-overlay ${className}`} role="dialog" aria-modal="true" tabIndex={-1} onClick={event => {
      onClick?.(event)
      if (event.target === event.currentTarget) onDismiss?.()
    }}>{children}</motion.div>,
    document.body,
  )
}
