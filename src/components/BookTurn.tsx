import { useMotionPreference } from '../hooks/useMotionPreference'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { forwardRef, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const
const Leaf = forwardRef<HTMLDivElement, {children:ReactNode; direction:number; side:'left'|'right'|'single'}>(function Leaf({children,direction,side},ref) {
  const present = useIsPresent()
  const hinge = side === 'left' ? 'right center' : 'left center'
  return <motion.div ref={ref} className="book-turn-leaf" aria-hidden={!present} data-present={present}
    custom={direction}
    initial={{rotateY:direction < 0 ? -180 : 0, opacity:1}}
    animate={{rotateY:0, opacity:1, transition:{duration:0.75,ease}}}
    variants={{leave:(exitDirection:number) => ({rotateY:exitDirection > 0 ? -180 : 0,opacity:1,transition:{duration:0.75,ease}})}} exit="leave"
    style={{transformOrigin:hinge,pointerEvents:present?'auto':'none',zIndex:present?(direction<0?3:1):2}}>
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

/** One two-sided sheet turns across the spine; the other pages stay still. */
export function BookSpreadTurn({page,left,right}:{page:number;left:ReactNode;right:ReactNode}) {
  const reduced=useMotionPreference()
  const previous=useRef({page,left,right})
  const [turn,setTurn]=useState<{from:typeof previous.current;direction:number}|null>(null)
  const [pastHalf,setPastHalf]=useState(false)
  useLayoutEffect(()=>{
    if(previous.current.page!==page&&!reduced){setTurn({from:previous.current,direction:page>previous.current.page?1:-1});setPastHalf(false)}
    if(reduced)setTurn(null)
    previous.current={page,left,right}
  },[page,left,right,reduced])
  const forward=turn?.direction===1
  return <div className="dsm-book-spread book-spread-scene" data-page={page}>
    <div data-side="left">{turn&&forward&&!pastHalf?turn.from.left:left}</div>
    <div className="dsm-book-spine" aria-hidden="true"/>
    <div data-side="right">{turn&&!forward&&!pastHalf?turn.from.right:right}</div>
    {turn&&<motion.div key={page} className={'book-spread-sheet '+(forward?'turn-forward':'turn-backward')} aria-hidden="true" initial={{rotateY:0}} animate={{rotateY:forward?-180:180}} transition={{duration:.85,ease:[.4,.05,.2,1]}} onUpdate={value=>setPastHalf(Math.abs(Number(value.rotateY))>=90)} onAnimationComplete={()=>setTurn(null)}>
      <div className="book-sheet-front">{forward?turn.from.right:turn.from.left}</div>
      <div className="book-sheet-back">{forward?left:right}</div>
    </motion.div>}
  </div>
}
