import { useState } from 'react'
import { CaretLeft, CaretRight, PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { StudyFlashcard } from './StudyFlashcard'
import type { AIDraft } from '../utils/ai'

export function FlashcardDraftReview({draft,category,onChange,disabled}:{draft:AIDraft;category:string;onChange:(draft:AIDraft)=>void;disabled:boolean}) {
  const [index,setIndex]=useState(0),[flipped,setFlipped]=useState(false),[editing,setEditing]=useState(false)
  const current=Math.min(index,draft.cards.length-1),card=draft.cards[current]
  const go=(next:number)=>{setIndex(next);setFlipped(false)}
  const update=(field:'question'|'answer',value:string)=>onChange({...draft,cards:draft.cards.map((item,i)=>i===current?{...item,[field]:value}:item)})
  return <div className="flashcard-draft-review">
    <label>Deck title<input aria-label="Deck title" maxLength={200} value={draft.title} disabled={disabled} onChange={event=>onChange({...draft,title:event.target.value})}/></label>
    <div className="draft-card-navigation"><button className="ref-square-button" aria-label="Previous draft card" disabled={disabled||current===0} onClick={()=>go(current-1)}><CaretLeft size={18}/></button><strong>Card {current+1} of {draft.cards.length}</strong><button className="ref-square-button" aria-label="Next draft card" disabled={disabled||current===draft.cards.length-1} onClick={()=>go(current+1)}><CaretRight size={18}/></button></div>
    {editing?<div className="draft-card-editor"><label>Question<textarea aria-label="Draft card question" rows={3} maxLength={1000} disabled={disabled} value={card.question} onChange={event=>update('question',event.target.value)}/></label><label>Answer<textarea aria-label="Draft card answer" rows={6} maxLength={4000} disabled={disabled} value={card.answer} onChange={event=>update('answer',event.target.value)}/></label></div>:<StudyFlashcard question={card.question} answer={card.answer} category={category} flipped={flipped} showHints={false} onFlip={()=>setFlipped(value=>!value)}/>}
    <div className="draft-card-tools"><button className="ref-secondary" disabled={disabled} onClick={()=>{setEditing(value=>!value);setFlipped(false)}}><PencilSimple size={16}/>{editing?'Preview card':'Edit card'}</button><button className="ref-secondary" disabled={disabled||draft.cards.length>=20} onClick={()=>{onChange({...draft,cards:[...draft.cards,{question:'',answer:''}]});go(draft.cards.length);setEditing(true)}}><Plus size={16}/>Add card</button><button className="ref-text-action" disabled={disabled||draft.cards.length<=1} onClick={()=>{onChange({...draft,cards:draft.cards.filter((_,i)=>i!==current)});go(Math.max(0,current-1))}}><Trash size={16}/>Remove card</button></div>
  </div>
}
