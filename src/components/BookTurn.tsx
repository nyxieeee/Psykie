import { useMotionPreference } from '../hooks/useMotionPreference'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { forwardRef, useLayoutEffect, useRef, type ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const
const Leaf = forwardRef<HTMLDivElement, {children:ReactNode; direction:number; side:'left'|'right'|'single'}>(function Leaf({children,direction,side},ref) {
  const present = useIsPresent()
  const hinge = side === 'left' ? 'right center' : 'left center'
  return <motion.div ref={ref} className="book-turn-leaf" aria-hidden={!present} data-present={present}
    custom={direction}
    initial={{rotateY:direction * 58, opacity:0.25}}
    animate={{rotateY:0, opacity:1, transition:{duration:0.52,ease}}}
    variants={{leave:(exitDirection:number) => ({rotateY:exitDirection * -78,opacity:0,transition:{duration:0.32,ease}})}} exit="leave"
    style={{transformOrigin:hinge,pointerEvents:present?'auto':'none',zIndex:present?1:2}}>
    {children}
    <motion.span className="book-turn-shade" aria-hidden="true" initial={{opacity:0.22}} animate={{opacity:0,transition:{duration:0.52,ease}}}/>
  </motion.div>
})

/** Each leaf pivots around the spine. Exiting copies are hidden from assistive technology. */
export function BookTurn({page,side='single',children}:{page:number;side?:'left'|'right'|'single';children:ReactNode}) {
  const previous = useRef(page)
  const direction = page >= previous.current ? 1 : -1
  const reduced = useMotionPreference()
  useLayoutEffect(() => { previous.current = page }, [page])
  return <div className="book-turn-stage" data-page={page} data-side={side}>
    {reduced ? <div className="book-turn-leaf" data-present="true">{children}</div> :
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <Leaf key={page} direction={direction} side={side}>{children}</Leaf>
      </AnimatePresence>}
  </div>
}
