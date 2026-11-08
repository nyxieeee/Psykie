import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useMotionPreference } from '../hooks/useMotionPreference'

const STRIPS = 20
const TURN_SECONDS = .9

type SheetProps = { front:ReactNode; back:ReactNode; direction:number; onHalf:()=>void; onComplete:()=>void }

function PaperStrip({progress,width,index,direction,front,back}:{progress:MotionValue<number>;width:number;index:number;direction:number;front:ReactNode;back:ReactNode}) {
  const stripWidth=width/STRIPS
  const forward=direction>0
  const transform=useTransform(progress,value=>{
    const curl=Math.sin(Math.PI*value)*.58
    let x=0,z=0
    for(let segment=0;segment<index;segment++) {
      const angle=curl*segment/(STRIPS-1)
      x+=Math.cos(angle)*stripWidth
      z+=Math.sin(angle)*stripWidth
    }
    const angle=curl*index/(STRIPS-1)*180/Math.PI
    return `translate3d(${forward?x:-x}px,0,${z}px) rotateY(${forward?-angle:angle}deg)`
  })
  const shade=useTransform(progress,value=>Math.sin(Math.PI*value)*(.05+index/STRIPS*.16))
  const frontOffset=(forward?index:STRIPS-1-index)*stripWidth
  const backOffset=(forward?STRIPS-1-index:index)*stripWidth
  return <motion.div className="curved-paper-strip" style={{width:stripWidth+.5,transform,left:forward?0:undefined,right:forward?undefined:0,transformOrigin:forward?'left center':'right center'}}>
    <div className="curved-paper-face"><div className="curved-paper-content" style={{width,marginLeft:-frontOffset}}>{front}</div><motion.span className="curved-paper-shading" style={{opacity:shade}}/></div>
    <div className="curved-paper-face curved-paper-back"><div className="curved-paper-content" style={{width,marginLeft:-backOffset}}>{back}</div><motion.span className="curved-paper-shading" style={{opacity:shade}}/></div>
  </motion.div>
}

function CurvedSheet({front,back,direction,onHalf,onComplete}:SheetProps) {
  const ref=useRef<HTMLDivElement>(null)
  const callbacks=useRef({onHalf,onComplete})
  callbacks.current={onHalf,onComplete}
  const [width,setWidth]=useState(0)
  const progress=useMotionValue(0)
  const rotation=useTransform(progress,value=>value*(direction>0?-180:180))
  const shadowOpacity=useTransform(progress,value=>Math.sin(Math.PI*value)*.24)
  useLayoutEffect(()=>{
    const element=ref.current
    if(!element)return
    const observer=new ResizeObserver(()=>setWidth(element.offsetWidth))
    setWidth(element.offsetWidth)
    observer.observe(element)
    return()=>observer.disconnect()
  },[])
  useEffect(()=>{
    if(!width)return
    let passedHalf=false
    const controls=animate(progress,1,{duration:TURN_SECONDS,ease:[.35,0,.2,1],onUpdate:value=>{if(value>=.5&&!passedHalf){passedHalf=true;callbacks.current.onHalf()}},onComplete:()=>callbacks.current.onComplete()})
    return()=>controls.stop()
  },[progress,width])
  return <>
    <motion.div className={'book-page-cast-shadow '+(direction>0?'shadow-left':'shadow-right')} style={{opacity:shadowOpacity}} aria-hidden="true"/>
    <motion.div ref={ref} className={'book-spread-sheet curved-paper-sheet '+(direction>0?'turn-forward':'turn-backward')} style={{rotateY:rotation}} aria-hidden="true">
      {width>0&&Array.from({length:STRIPS},(_,index)=><PaperStrip key={index} progress={progress} width={width} index={index} direction={direction} front={front} back={back}/>)}
    </motion.div>
  </>
}

export function BookTurn({page,side='single',children}:{page:number;side?:'left'|'right'|'single';children:ReactNode}) {
  const reduced=useMotionPreference()
  const previous=useRef({page,children})
  const [turn,setTurn]=useState<{from:ReactNode;direction:number}|null>(null)
  useLayoutEffect(()=>{
    if(previous.current.page!==page&&!reduced)setTurn({from:previous.current.children,direction:page>previous.current.page?1:-1})
    if(reduced)setTurn(null)
    previous.current={page,children}
  },[page,children,reduced])
  return <div className="book-turn-stage book-single-scene" data-page={page} data-side={side}>
    <div className="book-turn-leaf" data-present="true">{children}</div>
    {turn&&<CurvedSheet key={page} front={turn.from} back={children} direction={turn.direction} onHalf={()=>{}} onComplete={()=>setTurn(null)}/>}
  </div>
}

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
    {turn&&<CurvedSheet key={page} front={forward?turn.from.right:turn.from.left} back={forward?left:right} direction={turn.direction} onHalf={()=>setPastHalf(true)} onComplete={()=>setTurn(null)}/>}
  </div>
}
