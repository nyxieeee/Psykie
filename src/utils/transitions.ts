/**
 * transitions.style — Full Implementation
 *
 * All transitions ported from transitions.style into Framer Motion variants.
 * Also exports CSS keyframe names that match the transitions.style naming.
 *
 * Categories:
 *  fade        — opacity only
 *  slide       — translate on one axis
 *  scale       — scale + fade
 *  wipe        — clip-path reveal
 *  cube        — 3D perspective rotation
 *  swap        — 3D card flip (X axis)
 *  skew        — translate + skew distortion
 *  uncover     — new page reveals, old stays fixed
 *  cover       — new page covers old (slide over)
 *  rotate      — full rotation entrance
 *  push        — push old out while new comes in
 */

// ── Duration constants (transitions.style defaults) ──
export const DURATION = {
  fast:    0.25,
  normal:  0.35,
  slow:    0.5,
  xslow:   0.65,
} as const

// ── Easing curves (matching transitions.style) ──
export const EASE = {
  // transitions.style's primary easing
  smooth:   [0.25, 0.46, 0.45, 0.94] as const,
  // Snappy spring-like
  snappy:   [0.22, 1, 0.36, 1] as const,
  // Aggressive out
  aggressive:[0.55, 0, 1, 0.45] as const,
  // Gentle
  gentle:   [0.4, 0, 0.2, 1] as const,
  // Bounce feel
  bounce:   [0.34, 1.56, 0.64, 1] as const,
} as const

// ── Base transition config ──
const T_ENTER = { duration: DURATION.normal, ease: EASE.snappy }
const T_EXIT  = { duration: DURATION.fast,   ease: EASE.aggressive }

// ═══════════════════════════════════════════
// TRANSITION VARIANTS
// ═══════════════════════════════════════════

export type TransitionDirection = 'up' | 'down' | 'left' | 'right'
export type TransitionStyle =
  | 'studio-slide'
  | 'fade'
  | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
  | 'scale-up' | 'scale-down'
  | 'wipe-right' | 'wipe-left' | 'wipe-up' | 'wipe-down'
  | 'cube-right' | 'cube-left' | 'cube-up' | 'cube-down'
  | 'swap-up' | 'swap-down' | 'swap-left' | 'swap-right'
  | 'skew-right' | 'skew-left' | 'skew-up' | 'skew-down'
  | 'uncover-right' | 'uncover-left' | 'uncover-up' | 'uncover-down'
  | 'rotate-in'
  | 'blur-in'
  | 'depth-zoom'
  | '3d-glass-depth'

export type TransitionSet = { initial: any; animate: any; exit: any }

// ── fade ──────────────────────────────────
const fade: TransitionSet = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { opacity: 0, transition: { ...T_EXIT, duration: DURATION.fast } },
}

// ── slide ─────────────────────────────────
const slideRight: TransitionSet = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: '0%', transition: T_ENTER },
  exit:    { opacity: 0, x: '-30%', transition: T_EXIT },
}

const slideLeft: TransitionSet = {
  initial: { opacity: 0, x: '-100%' },
  animate: { opacity: 1, x: '0%', transition: T_ENTER },
  exit:    { opacity: 0, x: '30%', transition: T_EXIT },
}

const slideUp: TransitionSet = {
  initial: { opacity: 0, y: '40px' },
  animate: { opacity: 1, y: '0px', transition: T_ENTER },
  exit:    { opacity: 0, y: '-20px', transition: T_EXIT },
}

const slideDown: TransitionSet = {
  initial: { opacity: 0, y: '-40px' },
  animate: { opacity: 1, y: '0px', transition: T_ENTER },
  exit:    { opacity: 0, y: '20px', transition: T_EXIT },
}

// ── scale ─────────────────────────────────
const scaleUp: TransitionSet = {
  initial: { opacity: 0, scale: 0.82 },
  animate: { opacity: 1, scale: 1, transition: { ...T_ENTER, ease: EASE.bounce } },
  exit:    { opacity: 0, scale: 0.88, transition: T_EXIT },
}

const scaleDown: TransitionSet = {
  initial: { opacity: 0, scale: 1.18 },
  animate: { opacity: 1, scale: 1, transition: T_ENTER },
  exit:    { opacity: 0, scale: 1.10, transition: T_EXIT },
}

// ── wipe (clip-path) ──────────────────────
// transitions.style: wipe uses clip-path inset()
const wipeRight: TransitionSet = {
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: { clipPath: 'inset(0 0% 0 0)',   transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { clipPath: 'inset(0 0 0 100%)', transition: { ...T_EXIT, duration: DURATION.fast } },
}

const wipeLeft: TransitionSet = {
  initial: { clipPath: 'inset(0 0 0 100%)' },
  animate: { clipPath: 'inset(0 0 0 0%)',   transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { clipPath: 'inset(0 100% 0 0)', transition: { ...T_EXIT, duration: DURATION.fast } },
}

const wipeUp: TransitionSet = {
  initial: { clipPath: 'inset(100% 0 0 0)' },
  animate: { clipPath: 'inset(0% 0 0 0)',   transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { clipPath: 'inset(0 0 100% 0)', transition: { ...T_EXIT, duration: DURATION.fast } },
}

const wipeDown: TransitionSet = {
  initial: { clipPath: 'inset(0 0 100% 0)' },
  animate: { clipPath: 'inset(0 0 0% 0)',   transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { clipPath: 'inset(100% 0 0 0)', transition: { ...T_EXIT, duration: DURATION.fast } },
}

// ── cube (3D perspective) ─────────────────
// transitions.style cube: perspective + rotateY/X
// Origin changes direction of the cube face
const cubeRight: TransitionSet = {
  initial: { rotateY: -90, transformPerspective: 800, transformOrigin: 'left center', opacity: 0 },
  animate: { rotateY:   0, transformPerspective: 800, transformOrigin: 'left center', opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { rotateY:  90, transformPerspective: 800, transformOrigin: 'right center', opacity: 0, transition: T_EXIT },
}

const cubeLeft: TransitionSet = {
  initial: { rotateY:  90, transformPerspective: 800, transformOrigin: 'right center', opacity: 0 },
  animate: { rotateY:   0, transformPerspective: 800, transformOrigin: 'right center', opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { rotateY: -90, transformPerspective: 800, transformOrigin: 'left center',  opacity: 0, transition: T_EXIT },
}

const cubeUp: TransitionSet = {
  initial: { rotateX:  90, transformPerspective: 800, transformOrigin: 'center bottom', opacity: 0 },
  animate: { rotateX:   0, transformPerspective: 800, transformOrigin: 'center bottom', opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { rotateX: -90, transformPerspective: 800, transformOrigin: 'center top',    opacity: 0, transition: T_EXIT },
}

const cubeDown: TransitionSet = {
  initial: { rotateX: -90, transformPerspective: 800, transformOrigin: 'center top',    opacity: 0 },
  animate: { rotateX:   0, transformPerspective: 800, transformOrigin: 'center top',    opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { rotateX:  90, transformPerspective: 800, transformOrigin: 'center bottom', opacity: 0, transition: T_EXIT },
}

// ── swap (3D card flip) ───────────────────
// transitions.style swap: new page flips in from behind
const swapUp: TransitionSet = {
  initial: { rotateX: -90, transformPerspective: 1000, transformOrigin: 'center top', scale: 0.92, opacity: 0 },
  animate: { rotateX:   0, transformPerspective: 1000, transformOrigin: 'center top', scale: 1,    opacity: 1, transition: { ...T_ENTER, ease: EASE.bounce } },
  exit:    { rotateX:  90, transformPerspective: 1000, transformOrigin: 'center bottom', scale: 0.92, opacity: 0, transition: T_EXIT },
}

const swapDown: TransitionSet = {
  initial: { rotateX:  90, transformPerspective: 1000, transformOrigin: 'center bottom', scale: 0.92, opacity: 0 },
  animate: { rotateX:   0, transformPerspective: 1000, transformOrigin: 'center bottom', scale: 1,    opacity: 1, transition: { ...T_ENTER, ease: EASE.bounce } },
  exit:    { rotateX: -90, transformPerspective: 1000, transformOrigin: 'center top',    scale: 0.92, opacity: 0, transition: T_EXIT },
}

const swapLeft: TransitionSet = {
  initial: { rotateY:  90, transformPerspective: 1000, transformOrigin: 'left center',  scale: 0.92, opacity: 0 },
  animate: { rotateY:   0, transformPerspective: 1000, transformOrigin: 'left center',  scale: 1,    opacity: 1, transition: { ...T_ENTER, ease: EASE.bounce } },
  exit:    { rotateY: -90, transformPerspective: 1000, transformOrigin: 'right center', scale: 0.92, opacity: 0, transition: T_EXIT },
}

const swapRight: TransitionSet = {
  initial: { rotateY: -90, transformPerspective: 1000, transformOrigin: 'right center', scale: 0.92, opacity: 0 },
  animate: { rotateY:   0, transformPerspective: 1000, transformOrigin: 'right center', scale: 1,    opacity: 1, transition: { ...T_ENTER, ease: EASE.bounce } },
  exit:    { rotateY:  90, transformPerspective: 1000, transformOrigin: 'left center',  scale: 0.92, opacity: 0, transition: T_EXIT },
}

// ── skew ─────────────────────────────────
// transitions.style skew: translate + skew distortion
const skewRight: TransitionSet = {
  initial: { opacity: 0, x: '60px',  skewX:  14 },
  animate: { opacity: 1, x: '0px',   skewX:   0, transition: T_ENTER },
  exit:    { opacity: 0, x: '-40px', skewX: -10, transition: T_EXIT },
}

const skewLeft: TransitionSet = {
  initial: { opacity: 0, x: '-60px', skewX: -14 },
  animate: { opacity: 1, x: '0px',   skewX:   0, transition: T_ENTER },
  exit:    { opacity: 0, x:  '40px', skewX:  10, transition: T_EXIT },
}

const skewUp: TransitionSet = {
  initial: { opacity: 0, y: '40px', skewY:  8 },
  animate: { opacity: 1, y: '0px',  skewY:  0, transition: T_ENTER },
  exit:    { opacity: 0, y: '-30px', skewY: -6, transition: T_EXIT },
}

const skewDown: TransitionSet = {
  initial: { opacity: 0, y: '-40px', skewY: -8 },
  animate: { opacity: 1, y: '0px',   skewY:  0, transition: T_ENTER },
  exit:    { opacity: 0, y:  '30px', skewY:  6, transition: T_EXIT },
}

// ── uncover ───────────────────────────────
// transitions.style uncover: old page stays, new slides over/from behind
// In Framer Motion AnimatePresence, we simulate with the enter only
const uncoverRight: TransitionSet = {
  initial: { x: '-100%', opacity: 1 },
  animate: { x: '0%',    opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { x: '-100%', opacity: 1, transition: T_EXIT },
}

const uncoverLeft: TransitionSet = {
  initial: { x: '100%',  opacity: 1 },
  animate: { x: '0%',    opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { x: '100%',  opacity: 1, transition: T_EXIT },
}

const uncoverUp: TransitionSet = {
  initial: { y: '-100%', opacity: 1 },
  animate: { y: '0%',    opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { y: '-100%', opacity: 1, transition: T_EXIT },
}

const uncoverDown: TransitionSet = {
  initial: { y: '100%',  opacity: 1 },
  animate: { y: '0%',    opacity: 1, transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { y: '100%',  opacity: 1, transition: T_EXIT },
}

// ── rotate-in ─────────────────────────────
const rotateIn: TransitionSet = {
  initial: { opacity: 0, rotate: -8,  scale: 0.88, transformPerspective: 800 },
  animate: { opacity: 1, rotate:  0,  scale: 1,    transformPerspective: 800, transition: { ...T_ENTER, ease: EASE.bounce } },
  exit:    { opacity: 0, rotate:  4,  scale: 0.92, transition: T_EXIT },
}

// ── blur-in ───────────────────────────────
const blurIn: TransitionSet = {
  initial: { opacity: 0, filter: 'blur(14px)', scale: 1.01 },
  animate: { opacity: 1, filter: 'blur(0px)',  scale: 1,    transition: { duration: 0.28, ease: EASE.snappy } },
  exit:    { opacity: 0, filter: 'blur(8px)',  scale: 0.99, transition: { duration: 0.18, ease: EASE.gentle } },
}

// ── depth-zoom (custom) ───────────────────
const depthZoom: TransitionSet = {
  initial: { opacity: 0, scale: 1.07, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1,    filter: 'blur(0px)',  transition: { ...T_ENTER, duration: DURATION.slow } },
  exit:    { opacity: 0, scale: 0.93, filter: 'blur(6px)',  transition: T_EXIT },
}

// ── 3d-glass-depth (3D Liquid Glass Perspective Depth) ──
const threeDGlassDepth: TransitionSet = {
  initial: {
    opacity: 0,
    scale: 0.94,
    rotateX: 4,
    transformPerspective: 1200,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transformPerspective: 1200,
    filter: 'blur(0px)',
    transition: {
      duration: 0.36,
      ease: EASE.snappy,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    rotateX: -4,
    transformPerspective: 1200,
    filter: 'blur(8px)',
    transition: {
      duration: 0.22,
      ease: EASE.aggressive,
    },
  },
}

// ═══════════════════════════════════════════
// REGISTRY — map TransitionStyle → TransitionSet
// ═══════════════════════════════════════════
export const TRANSITIONS: Record<TransitionStyle, TransitionSet> = {
  'studio-slide': { initial:{opacity:0,y:8}, animate:{opacity:1,y:0,transition:{duration:0.25,ease:EASE.snappy}}, exit:{opacity:0,y:-8,transition:{duration:0.15,ease:EASE.snappy}} },
  'fade':           fade,
  'slide-up':       slideUp,
  'slide-down':     slideDown,
  'slide-left':     slideLeft,
  'slide-right':    slideRight,
  'scale-up':       scaleUp,
  'scale-down':     scaleDown,
  'wipe-right':     wipeRight,
  'wipe-left':      wipeLeft,
  'wipe-up':        wipeUp,
  'wipe-down':      wipeDown,
  'cube-right':     cubeRight,
  'cube-left':      cubeLeft,
  'cube-up':        cubeUp,
  'cube-down':      cubeDown,
  'swap-up':        swapUp,
  'swap-down':      swapDown,
  'swap-left':      swapLeft,
  'swap-right':     swapRight,
  'skew-right':     skewRight,
  'skew-left':      skewLeft,
  'skew-up':        skewUp,
  'skew-down':      skewDown,
  'uncover-right':  uncoverRight,
  'uncover-left':   uncoverLeft,
  'uncover-up':     uncoverUp,
  'uncover-down':   uncoverDown,
  'rotate-in':      rotateIn,
  'blur-in':        blurIn,
  'depth-zoom':     depthZoom,
  '3d-glass-depth': threeDGlassDepth,
}

// Direction-aware variant pair — forward/backward
export function getDirectionalVariants(
  forward: TransitionStyle,
  backward: TransitionStyle,
): { forward: TransitionSet; backward: TransitionSet } {
  return {
    forward:  TRANSITIONS[forward],
    backward: TRANSITIONS[backward],
  }
}

// All available transition names for the picker UI
export const TRANSITION_NAMES: { label: string; value: TransitionStyle }[] = [
  { label: 'Soft slide', value: 'studio-slide' },
  { label: '3D Glass Depth', value: '3d-glass-depth' },
  { label: 'Cube Right',    value: 'cube-right' },
  { label: 'Cube Left',     value: 'cube-left' },
  { label: 'Cube Up',       value: 'cube-up' },
  { label: 'Cube Down',     value: 'cube-down' },
  { label: 'Swap Up',       value: 'swap-up' },
  { label: 'Swap Down',     value: 'swap-down' },
  { label: 'Swap Left',     value: 'swap-left' },
  { label: 'Swap Right',    value: 'swap-right' },
  { label: 'Depth Zoom',    value: 'depth-zoom' },
  { label: 'Blur In',       value: 'blur-in' },
  { label: 'Rotate In',     value: 'rotate-in' },
  { label: 'Fade',          value: 'fade' },
]

// Default active transition for the app — permanently 3D Glass Depth
export const DEFAULT_TRANSITION: TransitionStyle = 'studio-slide'
