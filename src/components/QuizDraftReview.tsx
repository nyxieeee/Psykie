import { useState } from 'react'
import type { AIDraft } from '../utils/ai'
import { plainText } from '../../supabase/functions/_shared/plainText'

export function QuizDraftReview({draft,onChange,disabled}:{draft:AIDraft;onChange:(draft:AIDraft)=>void;disabled:boolean}){
  const [index,setIndex]=useState(0),[editing,setEditing]=useState(false)
  const current=Math.min(index,draft.questions.length-1),question=draft.questions[current]
  if(!question)return null
  const update=(next:typeof question)=>onChange({...draft,questions:draft.questions.map((item,i)=>i===current?next:item)})
  return <div className="flashcard-draft-review"><label>Quiz title<input aria-label="Draft quiz title" maxLength={200} disabled={disabled} value={draft.title} onChange={event=>onChange({...draft,title:event.target.value})}/></label>
    <div className="draft-card-navigation"><button className="ref-secondary" disabled={disabled||current===0} onClick={()=>setIndex(current-1)}>Previous question</button><span>{current+1} of {draft.questions.length}</span><button className="ref-secondary" disabled={disabled||current===draft.questions.length-1} onClick={()=>setIndex(current+1)}>Next draft question</button></div>
    {editing?<><label>Question<textarea aria-label="Draft question" maxLength={1500} rows={4} disabled={disabled} value={question.question} onChange={event=>update({...question,question:event.target.value})}/></label>{question.options.map((option,i)=><label key={i}>{question.format?'Expected answer':'Option '+String.fromCharCode(65+i)}<input aria-label={'Draft option '+(i+1)} maxLength={1000} disabled={disabled} value={option} onChange={event=>update({...question,options:question.options.map((value,j)=>i===j?event.target.value:value)})}/>{!question.format&&<span><input type="radio" name="draft-correct" checked={question.correct===i} disabled={disabled} onChange={()=>update({...question,correct:i})}/>Correct answer</span>}</label>)}<label>Explanation<textarea aria-label="Draft explanation" rows={4} maxLength={2500} disabled={disabled} value={question.explanation} onChange={event=>update({...question,explanation:event.target.value})}/></label></>:<article className="study-review-item"><h3>{plainText(question.question)}</h3><ol type="A">{question.options.map((option,i)=><li key={i}>{plainText(option)}{question.correct===i?' (correct)':''}</li>)}</ol><p>{plainText(question.explanation)}</p></article>}
    <div className="study-actions"><button className="ref-secondary" disabled={disabled} onClick={()=>setEditing(value=>!value)}>{editing?'Preview question':'Edit question'}</button><button className="ref-text-action" disabled={disabled||draft.questions.length<=1} onClick={()=>{onChange({...draft,questions:draft.questions.filter((_,i)=>i!==current)});setIndex(Math.max(0,current-1))}}>Remove question</button></div>
  </div>
}
