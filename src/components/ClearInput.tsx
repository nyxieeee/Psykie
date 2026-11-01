import { useEffect, useRef, forwardRef, useImperativeHandle, InputHTMLAttributes } from 'react'
import { X as CloseIcon } from '@phosphor-icons/react'

export interface ClearInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string
  defaultValue?: string
  onChange?: (val: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export interface ClearInputHandle {
  focus: () => void
  clear: () => void
  input: HTMLInputElement | null
}

const __TRANSITION_STYLES = `
:root {
  --clear-dur: 700ms;
  --clear-out-dur: 320ms;
  --clear-in-dur: 320ms;
  --clear-out-fly: 10px;
  --clear-in-fly: 10px;
  --clear-out-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --clear-in-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --clear-blur: 2px;
  --glow-delay: 40ms;
  --glow-peak-at: 0.15;
  --glow-opacity: 0.6;
  --glow-spread: 1.4;
}

.t-clear {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
}
.t-clear-mirror,
.t-clear-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  z-index: 2;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  padding: inherit;
}
.t-clear-mirror { opacity: 0; }
.t-clear.has-value .t-clear-mirror,
.t-clear.is-clearing .t-clear-mirror { opacity: 1; }
.t-clear.has-value > input,
.t-clear.is-clearing > input {
  -webkit-text-fill-color: transparent;
}
.t-clear.has-value .t-clear-placeholder { opacity: 0; }
.t-clear-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  z-index: 3;
  mix-blend-mode: multiply;
}

.t-clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--neutral-400, #94a3b8);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: all 0.15s ease;
  z-index: 4;
}
.t-clear-btn:hover {
  background: var(--neutral-100, #f1f5f9);
  color: var(--neutral-700, #334155);
}
.t-clear.has-value .t-clear-btn {
  opacity: 1;
  pointer-events: auto;
}

@media (prefers-reduced-motion: reduce) {
  .t-clear-glow { opacity: 0 !important; }
}
`

if (typeof document !== 'undefined' && !document.getElementById('transitions-p13-flat')) {
  const __style = document.createElement('style')
  __style.id = 'transitions-p13-flat'
  __style.textContent = __TRANSITION_STYLES
  document.head.appendChild(__style)
}

function readNum(name: string, fb: number): number {
  if (typeof document === 'undefined') return fb
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name))
  return Number.isFinite(v) ? v : fb
}

function readEase(name: string, fb: string): string {
  if (typeof document === 'undefined') return fb
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fb
}

function makeEase(ease: string) {
  const m = ease.match(/cubic-bezier\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/i)
  if (!m) return (t: number) => t
  const [x1, y1, x2, y2] = [m[1], m[2], m[3], m[4]].map(parseFloat)
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const sX = (s: number) => ((ax * s + bx) * s + cx) * s
  const sY = (s: number) => ((ay * s + by) * s + cy) * s
  const dX = (s: number) => (3 * ax * s + 2 * bx) * s + cx
  return (t: number) => {
    if (t <= 0) return 0
    if (t >= 1) return 1
    let s = t
    for (let i = 0; i < 8; i++) {
      const dx = sX(s) - t
      if (Math.abs(dx) < 1e-6) break
      const d = dX(s)
      if (d === 0) break
      s -= dx / d
    }
    return sY(s)
  }
}

let cachedCanvasCtx: CanvasRenderingContext2D | null = null

function buildLayers(wrap: HTMLElement, text: string): string {
  const inputW = wrap.clientWidth || 280
  const padLeft = 14
  const segments = text.split(/(\s+)/)
  const spread = readNum('--glow-spread', 1.4)
  if (!cachedCanvasCtx && typeof document !== 'undefined') {
    const c = document.createElement('canvas')
    cachedCanvasCtx = c.getContext('2d')
  }
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
  const rgb = isDark ? '255,255,255' : '15,23,42'
  const layers: string[] = []
  let x = 0
  for (const seg of segments) {
    let w = 20
    if (cachedCanvasCtx) {
      cachedCanvasCtx.font = '400 14px Quera, Inter, sans-serif'
      w = cachedCanvasCtx.measureText(seg).width
    }
    if (seg.trim()) {
      const cx = padLeft + x + w / 2
      const hw = Math.max(w * 0.45, 8) * spread
      const stops = [
        { dx: 0, rw: hw * 0.8, rh: 7, a: 0.18 },
        { dx: hw * 0.45, rw: hw * 0.55, rh: 8, a: 0.14 },
        { dx: -hw * 0.4, rw: hw * 0.65, rh: 6, a: 0.12 },
        { dx: hw * 0.15, rw: hw * 0.9, rh: 5, a: 0.1 },
      ]
      for (const l of stops) {
        const lx = (((cx + l.dx) / inputW) * 100).toFixed(2)
        layers.push(
          `radial-gradient(ellipse ${Math.max(l.rw, 2).toFixed(1)}px ${l.rh}px at ${lx}% 100%, rgba(${rgb},${l.a.toFixed(3)}), transparent)`
        )
      }
    }
    x += w
  }
  return layers.join(', ')
}

export const ClearInput = forwardRef<ClearInputHandle, ClearInputProps>(function ClearInput(
  { value, defaultValue = '', onChange, onClear: onClearProp, placeholder = '', className = '', autoFocus, ...rest },
  ref
) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)
  const fakePhRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const isClearing = useRef(false)

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => handleClear(),
    input: inputRef.current,
  }))

  const sync = () => {
    const wrap = wrapRef.current
    const input = inputRef.current
    if (!wrap || !input) return
    const has = input.value.length > 0
    wrap.classList.toggle('has-value', has)
    if (has && mirrorRef.current) {
      mirrorRef.current.textContent = input.value.replace(/ /g, '\u00a0')
    }
  }

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    if (value !== undefined) {
      input.value = value
      sync()
    }
  }, [value])

  useEffect(() => {
    const wrap = wrapRef.current
    const input = inputRef.current
    if (!wrap || !input) return
    input.addEventListener('input', sync)
    sync()
    return () => input.removeEventListener('input', sync)
  }, [])

  const handleClear = () => {
    const wrap = wrapRef.current
    const input = inputRef.current
    const mirror = mirrorRef.current
    const fakePh = fakePhRef.current
    const glow = glowRef.current
    if (!wrap || !input || !mirror || !fakePh || !glow) return
    if (isClearing.current || !input.value) return
    isClearing.current = true
    const wasFocused = document.activeElement === input
    mirror.textContent = input.value.replace(/ /g, '\u00a0')
    const bg = buildLayers(wrap, mirror.textContent)

    const peakAt = readNum('--glow-peak-at', 0.15)
    const opacity = readNum('--glow-opacity', 0.42)
    const total = readNum('--clear-dur', 700)
    const outDur = readNum('--clear-out-dur', 320)
    const inDur = readNum('--clear-in-dur', 320)
    const outFly = readNum('--clear-out-fly', 10)
    const inFly = readNum('--clear-in-fly', 10)
    const blurPx = readNum('--clear-blur', 2)
    const glowDly = readNum('--glow-delay', 40)
    const eOut = makeEase(readEase('--clear-out-ease', 'cubic-bezier(0.22, 1, 0.36, 1)'))
    const eIn = makeEase(readEase('--clear-in-ease', 'cubic-bezier(0.22, 1, 0.36, 1)'))

    input.value = ''
    onChange?.('')
    onClearProp?.()

    wrap.classList.remove('has-value')
    wrap.classList.add('is-clearing')
    fakePh.style.transform = `translateY(-${inFly}px)`
    fakePh.style.opacity = '0.9'
    fakePh.style.filter = `blur(${blurPx}px)`
    glow.style.background = bg
    glow.style.opacity = '0'

    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      const p = Math.min(1, elapsed / total)
      const e = eOut(Math.min(1, elapsed / outDur))
      mirror.style.transform = `translateY(${(e * outFly).toFixed(1)}px)`
      mirror.style.opacity = (1 - e).toFixed(3)
      mirror.style.filter = `blur(${(e * blurPx).toFixed(1)}px)`
      const pe = eIn(Math.min(1, elapsed / inDur))
      fakePh.style.transform = `translateY(${(-inFly + pe * inFly).toFixed(1)}px)`
      fakePh.style.opacity = (0.9 + pe * 0.1).toFixed(3)
      fakePh.style.filter = `blur(${(blurPx - pe * blurPx).toFixed(1)}px)`
      let g = 0
      if (elapsed > glowDly) {
        const remaining = Math.max(1, total - glowDly)
        const gp = Math.min(1, (elapsed - glowDly) / remaining)
        g = gp < peakAt ? gp / peakAt : 1 - (gp - peakAt) / (1 - peakAt)
      }
      glow.style.opacity = (g * opacity).toFixed(3)
      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        wrap.classList.remove('is-clearing')
        for (const el of [mirror, fakePh]) el.style.cssText = ''
        mirror.textContent = ''
        glow.style.opacity = '0'
        glow.style.background = ''
        isClearing.current = false
        if (wasFocused) input.focus({ preventScroll: true })
      }
    }
    requestAnimationFrame(tick)
  }

  return (
    <div ref={wrapRef} className={`t-clear ${className}`}>
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={e => {
          sync()
          onChange?.(e.target.value)
        }}
        {...rest}
      />
      <div ref={mirrorRef} className="t-clear-mirror" aria-hidden="true" />
      <div ref={fakePhRef} className="t-clear-placeholder text-slate-400" aria-hidden="true">
        {placeholder}
      </div>
      <div ref={glowRef} className="t-clear-glow" aria-hidden="true" />
      <button
        type="button"
        className="t-clear-btn"
        aria-label="Clear text"
        onPointerDown={e => {
          if (document.activeElement === inputRef.current) e.preventDefault()
        }}
        onMouseDown={e => {
          if (document.activeElement === inputRef.current) e.preventDefault()
        }}
        onClick={handleClear}
      >
        <CloseIcon size={14} weight="bold" />
      </button>
    </div>
  )
})
