import { useRef, useState, useEffect, ReactNode } from 'react'

const __TRANSITION_STYLES = `
:root {
  --stagger-dur: 500ms;
  --stagger-distance: 12px;
  --stagger-stagger: 40ms;
  --stagger-blur: 3px;
  --stagger-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-stagger-line {
  display: block;
  opacity: 0;
  transform: translateY(var(--stagger-distance));
  filter: blur(var(--stagger-blur));
  transition:
    opacity   var(--stagger-dur) var(--stagger-ease),
    transform var(--stagger-dur) var(--stagger-ease),
    filter    var(--stagger-dur) var(--stagger-ease);
  will-change: transform, opacity, filter;
}
.t-stagger-line--2 { transition-delay: var(--stagger-stagger); }
.t-stagger-line--3 { transition-delay: calc(var(--stagger-stagger) * 2); }

.t-stagger.is-shown .t-stagger-line {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.t-stagger.is-hiding .t-stagger-line {
  opacity: 0;
  transform: translateY(0);
  filter: blur(0);
  transition:
    opacity 200ms ease,
    transform 0s linear,
    filter 0s linear;
  transition-delay: 0s;
}

@media (prefers-reduced-motion: reduce) {
  .t-stagger-line { transition: none !important; }
}
`

if (typeof document !== 'undefined' && !document.getElementById('transitions-p18')) {
  const __style = document.createElement('style')
  __style.id = 'transitions-p18'
  __style.textContent = __TRANSITION_STYLES
  document.head.appendChild(__style)
}

export interface StaggerRevealProps {
  primary: ReactNode
  secondary?: ReactNode
  tertiary?: ReactNode
  autoPlay?: boolean
  className?: string
  primaryClassName?: string
  secondaryClassName?: string
  tertiaryClassName?: string
}

export function StaggerReveal({
  primary,
  secondary,
  tertiary,
  autoPlay = true,
  className = '',
  primaryClassName = '',
  secondaryClassName = '',
  tertiaryClassName = '',
}: StaggerRevealProps) {
  const [shown, setShown] = useState(!autoPlay)
  const [hiding, setHiding] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (autoPlay) {
      const anim = requestAnimationFrame(() => {
        setShown(true)
      })
      return () => cancelAnimationFrame(anim)
    }
  }, [autoPlay])

  const trigger = () => {
    if (shown) {
      setShown(false)
      setHiding(true)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setHiding(false), 200)
    } else {
      if (timerRef.current) window.clearTimeout(timerRef.current)
      setHiding(false)
      window.requestAnimationFrame(() => setShown(true))
    }
  }

  const cls = `t-stagger ${shown ? 'is-shown' : ''} ${hiding ? 'is-hiding' : ''} ${className}`.trim()

  return (
    <div className={cls} onClick={trigger}>
      <div className={`t-stagger-line t-stagger-line--1 ${primaryClassName}`}>
        {primary}
      </div>
      {secondary && (
        <div className={`t-stagger-line t-stagger-line--2 ${secondaryClassName}`}>
          {secondary}
        </div>
      )}
      {tertiary && (
        <div className={`t-stagger-line t-stagger-line--3 ${tertiaryClassName}`}>
          {tertiary}
        </div>
      )}
    </div>
  )
}
