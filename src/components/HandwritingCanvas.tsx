import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getStroke } from 'perfect-freehand'
import {
  PenNib, Highlighter, Eraser, ArrowCounterClockwise, ArrowClockwise, HandPointing, FilePlus, X,
} from '@phosphor-icons/react'

// A4 portrait page ratio
const PAGE_RATIO = 1.294
const MAX_PAGE_WIDTH = 820
const MAX_PIXEL_RATIO = 2
const PAPER_COLOR = '#FFFDF9'
const ERASER_RADIUS = 0.012
const HISTORY_LIMIT = 60
const DEFAULT_PRESSURE = 0.5

const PEN_COLORS = ['#2B2B2B', '#BE5B6C', '#3B6FD8', '#2F8F5B']
const HIGHLIGHTER_COLORS = ['#FFE066', '#F9A8C2', '#9BE7C4']
const PEN_SIZES = [0.0028, 0.0045, 0.0075]
const HIGHLIGHTER_SIZE = 0.024

type Tool = 'pen' | 'highlighter' | 'eraser'
type Paper = 'lined' | 'grid' | 'dotted' | 'blank'

export type InkPoint = [number, number, number]
export interface InkStroke { tool: Tool; color: string; size: number; points: InkPoint[] }
export interface HandwritingDrawing { strokes: InkStroke[]; paper: Paper; pages: number }

/** Render original ink for OCR; drawing remains editable and untouched. */
export function handwritingImages(drawing:HandwritingDrawing):string[] {
  if(!drawing.strokes.length)throw new Error('Write something on the page first.')
  if(drawing.pages>5)throw new Error('Read up to five handwritten pages at a time.')
  return Array.from({length:drawing.pages},(_,page)=>{
    const canvas=document.createElement('canvas'),width=1000
    canvas.width=width;canvas.height=Math.ceil(width*PAGE_RATIO)
    const context=canvas.getContext('2d')
    if(!context)throw new Error('Handwriting could not be prepared.')
    context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height)
    drawing.strokes.forEach(stroke=>drawStroke(context,stroke,width,page*PAGE_RATIO))
    return canvas.toDataURL('image/jpeg',0.85)
  })
}

const round = (n: number) => Math.round(n * 10000) / 10000

function strokePath(stroke: InkStroke, width: number, yOffset: number) {
  const simulated = stroke.points.every(p => p[2] === DEFAULT_PRESSURE)
  const outline = getStroke(
    stroke.points.map(([x, y, p]) => [x * width, (y - yOffset) * width, p]),
    {
      size: stroke.size * width,
      thinning: stroke.tool === 'pen' ? 0.6 : 0,
      smoothing: 0.5,
      streamline: 0.45,
      simulatePressure: simulated,
      last: true,
    },
  )
  const path = new Path2D()
  if (outline.length === 0) return path
  path.moveTo(outline[0][0], outline[0][1])
  for (let i = 1; i < outline.length; i++) {
    const [x0, y0] = outline[i - 1]
    const [x1, y1] = outline[i]
    path.quadraticCurveTo(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
  }
  path.closePath()
  return path
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: InkStroke, width: number, yOffset: number) {
  ctx.save()
  ctx.fillStyle = stroke.color
  if (stroke.tool === 'highlighter') {
    ctx.globalAlpha = 0.38
    ctx.globalCompositeOperation = 'multiply'
  }
  ctx.fill(strokePath(stroke, width, yOffset))
  ctx.restore()
}

function drawPaper(ctx: CanvasRenderingContext2D, paper: Paper, width: number, height: number) {
  ctx.fillStyle = PAPER_COLOR
  ctx.fillRect(0, 0, width, height)
  if (paper === 'lined') {
    const gap = width * 0.036
    ctx.strokeStyle = '#D6E2F0'
    ctx.lineWidth = 1
    for (let y = width * 0.1; y < height - gap / 2; y += gap) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
    }
    ctx.strokeStyle = '#F0B4BE'
    ctx.beginPath(); ctx.moveTo(width * 0.1, 0); ctx.lineTo(width * 0.1, height); ctx.stroke()
  } else if (paper === 'grid') {
    const gap = width * 0.03
    ctx.strokeStyle = '#E4E7EE'
    ctx.lineWidth = 1
    for (let x = gap; x < width; x += gap) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
    for (let y = gap; y < height; y += gap) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke() }
  } else if (paper === 'dotted') {
    const gap = width * 0.03
    ctx.fillStyle = '#C9CED8'
    for (let x = gap; x < width; x += gap) {
      for (let y = gap; y < height; y += gap) { ctx.beginPath(); ctx.arc(x, y, 1.1, 0, Math.PI * 2); ctx.fill() }
    }
  }
}

function strokeBounds(stroke: InkStroke) {
  let min = Infinity, max = -Infinity
  for (const [, y] of stroke.points) { if (y < min) min = y; if (y > max) max = y }
  return [min - stroke.size, max + stroke.size]
}

interface InkPageProps {
  index: number
  width: number
  paper: Paper
  strokes: InkStroke[]
  activeStroke: Omit<InkStroke, 'points'> | null
  fingerDraws: boolean
  onPenDetected: () => void
  onStroke: (stroke: InkStroke) => void
  onErase: (strokeIndexes: Set<number>) => void
}

function InkPage({ index, width, paper, strokes, activeStroke, fingerDraws, onPenDetected, onStroke, onErase }: InkPageProps) {
  const baseRef = useRef<HTMLCanvasElement>(null)
  const liveRef = useRef<HTMLCanvasElement>(null)
  const points = useRef<InkPoint[]>([])
  const erased = useRef<Set<number>>(new Set())
  const scrollFrom = useRef<{ id: number; y: number } | null>(null)
  const drawing = useRef<{ id: number; type: string } | null>(null)
  const fingerDrawsRef = useRef(fingerDraws)
  useEffect(() => { fingerDrawsRef.current = fingerDraws }, [fingerDraws])
  const [eraseTick, setEraseTick] = useState(0)
  const height = Math.round(width * PAGE_RATIO)
  const yOffset = index * PAGE_RATIO
  const ratio = Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1)

  useEffect(() => {
    const canvas = baseRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    drawPaper(ctx, paper, width, height)
    strokes.forEach((stroke, i) => {
      if (erased.current.has(i)) return
      const [top, bottom] = strokeBounds(stroke)
      if (bottom >= yOffset && top <= yOffset + PAGE_RATIO) drawStroke(ctx, stroke, width, yOffset)
    })
  }, [strokes, paper, width, height, yOffset, ratio, eraseTick])

  const toPoint = (e: { clientX: number; clientY: number; pressure: number; pointerType: string }): InkPoint => {
    const rect = liveRef.current!.getBoundingClientRect()
    const pressure = e.pointerType === 'pen' && e.pressure > 0 ? e.pressure : DEFAULT_PRESSURE
    return [round((e.clientX - rect.left) / width), round((e.clientY - rect.top) / width + yOffset), round(pressure)]
  }

  const paintLive = () => {
    const ctx = liveRef.current?.getContext('2d')
    if (!ctx || !activeStroke) return
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, width, height)
    drawStroke(ctx, { ...activeStroke, points: points.current }, width, yOffset)
  }

  const lastErase = useRef<InkPoint | null>(null)

  const eraseAlong = (point: InkPoint) => {
    const from = lastErase.current ?? point
    const steps = Math.max(1, Math.ceil(Math.hypot(point[0] - from[0], point[1] - from[1]) / (ERASER_RADIUS / 2)))
    for (let s = 1; s <= steps; s++) {
      const t = s / steps
      eraseAt([from[0] + (point[0] - from[0]) * t, from[1] + (point[1] - from[1]) * t, 0])
    }
    lastErase.current = point
  }

  const eraseAt = ([x, y]: InkPoint) => {
    strokes.forEach((stroke, i) => {
      if (erased.current.has(i)) return
      const reach = ERASER_RADIUS + stroke.size / 2
      if (stroke.points.some(([px, py]) => Math.abs(px - x) < reach && Math.abs(py - y) < reach && Math.hypot(px - x, py - y) < reach)) {
        erased.current.add(i)
      }
    })
  }

  const isScrollGesture = (e: React.PointerEvent) => e.pointerType === 'touch' && !fingerDraws

  const clearLive = () => {
    const ctx = liveRef.current?.getContext('2d')
    ctx?.clearRect(0, 0, width, height)
  }

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'pen') onPenDetected()
    if (e.pointerType === 'pen') scrollFrom.current = null
    if (drawing.current) {
      if (e.pointerType === 'pen' && drawing.current.type === 'touch') {
        points.current = []
        clearLive()
      } else {
        return
      }
    }
    if (isScrollGesture(e)) {
      if (!scrollFrom.current) scrollFrom.current = { id: e.pointerId, y: e.clientY }
      return
    }
    if (e.button !== 0) return
    drawing.current = { id: e.pointerId, type: e.pointerType }
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* optional */ }
    const point = toPoint(e)
    if (!activeStroke) {
      erased.current = new Set()
      lastErase.current = null
      eraseAlong(point)
      setEraseTick(t => t + 1)
      return
    }
    points.current = [point]
    paintLive()
  }

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (scrollFrom.current?.id === e.pointerId) {
      liveRef.current?.closest('main')?.scrollBy(0, scrollFrom.current.y - e.clientY)
      scrollFrom.current = { id: e.pointerId, y: e.clientY }
      return
    }
    if (drawing.current?.id !== e.pointerId) return
    const coalesced = e.nativeEvent.getCoalescedEvents?.() ?? []
    const samples = coalesced.length > 0 ? coalesced : [e.nativeEvent]
    if (!activeStroke) {
      const before = erased.current.size
      samples.forEach(s => eraseAlong(toPoint(s)))
      if (erased.current.size !== before) setEraseTick(t => t + 1)
      return
    }
    samples.forEach(s => points.current.push(toPoint(s)))
    paintLive()
  }

  const handleUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (scrollFrom.current?.id === e.pointerId) { scrollFrom.current = null; return }
    if (drawing.current?.id !== e.pointerId) return
    drawing.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    if (activeStroke && e.type === 'pointerup') points.current.push(toPoint(e))
    if (!activeStroke) {
      if (erased.current.size > 0) onErase(new Set(erased.current))
      erased.current = new Set()
      return
    }
    if (points.current.length > 0) onStroke({ ...activeStroke, points: points.current })
    points.current = []
    clearLive()
  }

  useEffect(() => {
    const canvas = liveRef.current
    if (!canvas) return
    const own = (e: TouchEvent) => {
      const stylus = Array.from(e.changedTouches).some(t => (t as Touch & { touchType?: string }).touchType === 'stylus')
      if (stylus || fingerDrawsRef.current || drawing.current) e.preventDefault()
    }
    canvas.addEventListener('touchstart', own, { passive: false })
    canvas.addEventListener('touchmove', own, { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', own)
      canvas.removeEventListener('touchmove', own)
    }
  }, [])

  return (
    <div
      className="relative rounded-xl shadow-md border border-pink-100/60 overflow-hidden select-none"
      style={{ width, height, WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
      onContextMenu={e => e.preventDefault()}
    >
      <canvas ref={baseRef} width={width * ratio} height={height * ratio} style={{ width, height }} className="absolute inset-0" />
      <canvas
        ref={liveRef}
        width={width * ratio}
        height={height * ratio}
        style={{ width, height, touchAction: 'none' }}
        className={`absolute inset-0 ${activeStroke ? 'cursor-crosshair' : 'cursor-cell'}`}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      />
      <span className="absolute bottom-2 right-3 text-[10px] text-neutral-400 select-none pointer-events-none">{index + 1}</span>
    </div>
  )
}

interface CommitOptions {
  strokes?: InkStroke[] | ((current: InkStroke[]) => InkStroke[])
  paper?: Paper
  pages?: number
}

export function HandwritingCanvas({ drawing, onChange }: {
  drawing: HandwritingDrawing
  onChange: (drawing: HandwritingDrawing) => void
}) {
  const [strokes, setStrokes] = useState<InkStroke[]>(drawing.strokes)
  const [paper, setPaper] = useState<Paper>(drawing.paper)
  const [pages, setPages] = useState(drawing.pages)
  const [tool, setTool] = useState<Tool>('pen')
  const [penColor, setPenColor] = useState(PEN_COLORS[0])
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHTER_COLORS[0])
  const [penSize, setPenSize] = useState(PEN_SIZES[1])
  const [fingerDraws, setFingerDraws] = useState(true)
  const [penNotice, setPenNotice] = useState(false)
  const [width, setWidth] = useState(0)
  const undoStack = useRef<InkStroke[][]>([])
  const redoStack = useRef<InkStroke[][]>([])
  const [historySize, setHistorySize] = useState({ undo: 0, redo: 0 })
  const syncHistory = () => setHistorySize({ undo: undoStack.current.length, redo: redoStack.current.length })
  const wrapRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.min(MAX_PAGE_WIDTH, Math.floor(entry.contentRect.width))))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const latest = useRef({ strokes: drawing.strokes, paper: drawing.paper, pages: drawing.pages })

  const commit = (next: CommitOptions, recordHistory = true) => {
    const current = latest.current
    const nextStrokes = typeof next.strokes === 'function' ? next.strokes(current.strokes) : next.strokes
    if (nextStrokes && recordHistory) {
      undoStack.current = [...undoStack.current.slice(-HISTORY_LIMIT + 1), current.strokes]
      redoStack.current = []
      syncHistory()
    }
    const merged = { strokes: nextStrokes ?? current.strokes, paper: next.paper ?? current.paper, pages: next.pages ?? current.pages }
    latest.current = merged
    if (nextStrokes) setStrokes(merged.strokes)
    if (next.paper) setPaper(merged.paper)
    if (next.pages) setPages(merged.pages)
    onChange(merged)
  }

  const undo = () => {
    const prev = undoStack.current.pop()
    if (!prev) return
    redoStack.current.push(latest.current.strokes)
    commit({ strokes: prev }, false)
    syncHistory()
  }

  const redo = () => {
    const next = redoStack.current.pop()
    if (!next) return
    undoStack.current.push(latest.current.strokes)
    commit({ strokes: next }, false)
    syncHistory()
  }

  const activeStroke: Omit<InkStroke, 'points'> | null =
    tool === 'pen' ? { tool: 'pen', color: penColor, size: penSize }
    : tool === 'highlighter' ? { tool: 'highlighter', color: highlightColor, size: HIGHLIGHTER_SIZE }
    : null

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-white/95 backdrop-blur border border-pink-100/80 shadow-sm shadow-pink-200/40">
        {([
          { id: 'pen' as Tool, icon: PenNib, label: 'Pen' },
          { id: 'highlighter' as Tool, icon: Highlighter, label: 'Highlighter' },
          { id: 'eraser' as Tool, icon: Eraser, label: 'Eraser' },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            aria-label={t.label}
            title={t.label}
            className={`p-2 rounded-xl transition-colors ${tool === t.id ? 'bg-pink-500 text-white' : 'text-neutral-500 hover:bg-pink-50'}`}
          >
            <t.icon size={19} weight={tool === t.id ? 'fill' : 'regular'} />
          </button>
        ))}

        <span className="w-px h-6 bg-pink-100 mx-1" />

        {tool !== 'eraser' && (tool === 'pen' ? PEN_COLORS : HIGHLIGHTER_COLORS).map(c => {
          const selected = (tool === 'pen' ? penColor : highlightColor) === c
          return (
            <button
              key={c}
              onClick={() => (tool === 'pen' ? setPenColor(c) : setHighlightColor(c))}
              aria-label={`Color ${c}`}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${selected ? 'border-neutral-700 scale-110' : 'border-white shadow'}`}
              style={{ background: c }}
            />
          )
        })}

        {tool === 'pen' && (
          <>
            <span className="w-px h-6 bg-pink-100 mx-1" />
            {PEN_SIZES.map((s, i) => (
              <button
                key={s}
                onClick={() => setPenSize(s)}
                aria-label={['Fine', 'Medium', 'Bold'][i]}
                title={['Fine', 'Medium', 'Bold'][i]}
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${penSize === s ? 'bg-pink-50' : 'hover:bg-pink-50'}`}
              >
                <span className="rounded-full bg-neutral-800" style={{ width: 4 + i * 3, height: 4 + i * 3 }} />
              </button>
            ))}
          </>
        )}

        <span className="w-px h-6 bg-pink-100 mx-1" />
        <button onClick={undo} disabled={historySize.undo === 0} className="p-2 rounded-xl disabled:opacity-30 hover:bg-pink-50 transition-colors" aria-label="Undo" title="Undo"><ArrowCounterClockwise size={18} /></button>
        <button onClick={redo} disabled={historySize.redo === 0} className="p-2 rounded-xl disabled:opacity-30 hover:bg-pink-50 transition-colors" aria-label="Redo" title="Redo"><ArrowClockwise size={18} /></button>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => { setFingerDraws(f => !f); setPenNotice(false) }}
            title={fingerDraws ? 'Finger draws — tap to scroll with finger instead' : 'Finger scrolls — tap to draw with finger'}
            aria-pressed={fingerDraws}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 ${fingerDraws ? 'bg-pink-50 text-pink-500' : 'text-neutral-500 hover:bg-pink-50'}`}
          >
            <HandPointing size={18} weight={fingerDraws ? 'fill' : 'regular'} />
            <span className="hidden sm:inline">{fingerDraws ? 'Finger draws' : 'Finger scrolls'}</span>
          </button>
          <select
            value={paper}
            onChange={e => commit({ paper: e.target.value as Paper })}
            className="text-xs bg-white border border-pink-200 rounded-full px-2.5 py-1.5 outline-none"
            aria-label="Paper style"
          >
            <option value="lined">Lined</option>
            <option value="grid">Grid</option>
            <option value="dotted">Dotted</option>
            <option value="blank">Blank</option>
          </select>
        </div>
      </div>

      {penNotice && (
        <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-pink-50 border border-pink-200/60 text-xs">
          <HandPointing size={16} className="text-pink-500 shrink-0 mt-px" />
          <p className="flex-1 text-neutral-600">
            Stylus detected, so fingers now scroll and your palm won't leave marks. To write with your finger, tap <strong className="text-neutral-800">Finger scrolls</strong> in the toolbar.
          </p>
          <button onClick={() => setPenNotice(false)} className="text-neutral-400 hover:text-pink-500 shrink-0" aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Pages */}
      <div ref={wrapRef} className="w-full flex flex-col items-center gap-4">
        {width > 0 && Array.from({ length: pages }, (_, i) => (
          <InkPage
            key={i}
            index={i}
            width={width}
            paper={paper}
            strokes={strokes}
            activeStroke={activeStroke}
            fingerDraws={fingerDraws}
            onPenDetected={() => { if (fingerDraws) { setFingerDraws(false); setPenNotice(true) } }}
            onStroke={stroke => commit({ strokes: current => [...current, stroke] })}
            onErase={ids => commit({ strokes: current => current.filter((_, idx) => !ids.has(idx)) })}
          />
        ))}
        <button onClick={() => commit({ pages: latest.current.pages + 1 })} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-pink-600 bg-white border border-pink-200 rounded-full hover:bg-pink-50 transition-colors shadow-sm">
          <FilePlus size={16} /> Add page
        </button>
      </div>
    </div>
  )
}
