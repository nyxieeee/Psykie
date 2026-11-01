import { useEffect, useRef, useState } from 'react'
import { Spinner, X } from '@phosphor-icons/react'
import { ViewportOverlay } from './ViewportOverlay'
import { AIDraft, AITask, generateAIDraft } from '../utils/ai'
export function AIGenerator({ task, initialText = '', category = 'General Psychology', onClose, onSave }: { task: AITask; initialText?: string; category?: string; onClose: () => void; onSave: (draft: AIDraft) => void }) {
  const [text, setText] = useState(initialText), [count, setCount] = useState(task === 'quiz' ? 5 : 8)
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [draft, setDraft] = useState<AIDraft | null>(null)
  const controller = useRef<AbortController | null>(null)
  useEffect(() => () => controller.current?.abort(), [])
  const generate = async () => {
    if (!text.trim() || loading) return
    setError(''); setDraft(null); setLoading(true); controller.current = new AbortController()
    try { setDraft(await generateAIDraft(task, text, category, count, controller.current.signal)) }
    catch(error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Generation failed. Please try again.') }
    finally { setLoading(false) }
  }
  const title = task === 'summary' ? 'Summarize with Mistral' : task === 'flashcards' ? 'Generate flashcards with Mistral' : 'Generate quiz with Mistral'
  return <ViewportOverlay onDismiss={onClose}><section className="glass-modal ref-form-dialog ai-draft-dialog"><div className="ref-panel-title"><h2>{title}</h2><button aria-label="Close AI generator" onClick={onClose}><X size={20}/></button></div><p>Use a study topic or paste source text. Review the draft before saving. Only the text entered here is included as source material.</p><label>Source text or topic<textarea disabled={loading} rows={7} maxLength={25000} value={text} onChange={event => {setText(event.target.value);setDraft(null)}}/></label>{task !== 'summary' && <label>Number of {task === 'quiz' ? 'questions' : 'cards'}<input disabled={loading} type="number" min={1} max={task === 'quiz' ? 15 : 20} value={count} onChange={event => {setCount(Number(event.target.value));setDraft(null)}}/></label>}{error && <p role="alert" className="ref-form-error">{error}</p>}<button className="ref-primary" disabled={loading || !text.trim() || text.length > 25000 || count < 1 || count > (task === 'quiz' ? 15 : 20)} onClick={generate}>{loading ? <><Spinner className="animate-spin" size={18}/>Generating...</> : draft ? 'Generate again' : 'Generate draft'}</button>{draft && <section className="ai-draft-preview" aria-label="AI draft preview"><h3>{draft.title}</h3>{task === 'summary' ? <><p>{draft.summary}</p><ul>{draft.keyPoints.map((point,index) => <li key={index}>{point}</li>)}</ul></> : task === 'flashcards' ? <ol>{draft.cards.map((card,index) => <li key={index}><strong>{card.question}</strong><p>{card.answer}</p></li>)}</ol> : <ol>{draft.questions.map((question,index) => <li key={index}><strong>{question.question}</strong><ul>{question.options.map((option,answer) => <li key={answer}>{option}{answer === question.correct ? ' (correct)' : ''}</li>)}</ul><p>{question.explanation}</p></li>)}</ol>}<p className="ref-inline-notice">AI-generated draft. Check accuracy against your source material.</p><button className="ref-primary ref-wide" onClick={() => onSave(draft)}>Save {task === 'summary' ? 'as a new note' : task === 'quiz' ? 'quiz' : 'flashcards'}</button></section>}</section></ViewportOverlay>
}
