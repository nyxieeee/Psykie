import type { ReactNode } from 'react'
import { ArrowRight, Check } from '@phosphor-icons/react'

type Props = {
  eyebrow:string;title:string;children:ReactNode;icon:ReactNode
  action:string;onAction:()=>void;secondary?:string;onSecondary?:()=>void
  extra?:ReactNode
  steps:[string,string,string]
}

export function CollectionWelcome({eyebrow,title,children,icon,action,onAction,secondary,onSecondary,steps,extra}:Props){
  return <section className="collection-welcome">
    <div className="collection-welcome-copy"><span className="collection-eyebrow">{eyebrow}</span><h2>{title}</h2><p>{children}</p><div className="collection-welcome-actions"><button className="ref-primary" onClick={onAction}>{action}<ArrowRight size={18}/></button>{secondary&&<button className="ref-secondary" onClick={onSecondary}>{secondary}</button>}</div>{extra&&<div className="collection-welcome-extra">{extra}</div>}</div>
    <div className="collection-illustration" aria-hidden="true"><div className="collection-paper paper-back"/><div className="collection-paper paper-front"><span>{icon}</span><i/><i/><i/><b><Check size={16}/></b></div><span className="collection-sparkle sparkle-one">✦</span><span className="collection-sparkle sparkle-two">✧</span></div>
    <ol className="collection-welcome-steps">{steps.map((step,index)=><li key={step}><span>{index+1}</span>{step}</li>)}</ol>
  </section>
}
