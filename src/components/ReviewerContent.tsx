import { plainText } from '../../supabase/functions/_shared/plainText'
import { useState } from 'react'
import { ReferenceTabs } from './ReferenceUI'
import { StudyText } from './StudyText'
import { StudyFlashcard } from './StudyFlashcard'
import type { AIDraft } from '../utils/ai'

export function ReviewerContent({draft,category}:{draft:AIDraft;category:string}) {
  const [tab,setTab]=useState('guide'),[index,setIndex]=useState(0),[flipped,setFlipped]=useState(false)
  const card=draft.cards[Math.min(index,draft.cards.length-1)]
  return <div className="reviewer-content"><ReferenceTabs items={[{id:'guide',label:'Study guide'},{id:'points',label:'Key points',count:draft.keyPoints.length},{id:'cards',label:'Flashcards',count:draft.cards.length},{id:'questions',label:'Self-test',count:draft.questions.length}]} value={tab} onChange={setTab}/>
    {tab==='guide'&&<div className="reviewer-guide">{plainText(draft.summary).split(/\n+/).filter(Boolean).map((line,i)=>/^[A-Z][A-Z &,:-]{3,80}$/.test(line.replace(/^#+\s*/,''))?<h3 key={i}>{line.replace(/^#+\s*/,'')}</h3>:<p key={i}><StudyText text={line}/></p>)}</div>}
    {tab==='points'&&<ol className="reviewer-points">{draft.keyPoints.map((point,i)=><li key={i}><span>{i+1}</span><p><StudyText text={point}/></p></li>)}</ol>}
    {tab==='cards'&&card&&<div className="flashcard-draft-review"><div className="draft-card-navigation"><button className="ref-secondary" disabled={index===0} onClick={()=>{setIndex(index-1);setFlipped(false)}}>Previous</button><span>{index+1} of {draft.cards.length}</span><button className="ref-secondary" disabled={index>=draft.cards.length-1} onClick={()=>{setIndex(index+1);setFlipped(false)}}>Next</button></div><StudyFlashcard question={card.question} answer={card.answer} category={category} flipped={flipped} onFlip={()=>setFlipped(value=>!value)} showHints={false}/></div>}
    {tab==='questions'&&<div className="reviewer-self-test">{draft.questions.map((question,i)=><article key={i}><h3>{i+1}. <StudyText text={question.question}/></h3><ol type="A">{question.options.map((answer,j)=><li key={j}><StudyText text={answer}/></li>)}</ol><details><summary>Reveal answer and explanation</summary><strong>{plainText(question.options[question.correct])}</strong><p><StudyText text={question.explanation}/></p></details></article>)}</div>}
  </div>
}
