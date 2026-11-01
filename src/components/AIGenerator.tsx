import { useEffect, useRef, useState } from 'react'
import { Spinner, X } from '@phosphor-icons/react'
import { ViewportOverlay } from './ViewportOverlay'
import { AIDraft, AITask, generateAIDraft } from '../utils/ai'
import { MAX_SOURCE_LENGTH, readStudyUpload } from '../utils/studyUpload'
export function AIGenerator({ task, initialText = '', category = 'General Psychology', onClose, onSave }: { task: AITask; initialText?: string; category?: string; onClose: () => void; onSave: (draft: AIDraft) => void }) {
  const [text, setText] = useState(initialText), [count, setCount] = useState(task === 'quiz' ? 5 : 8)
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [draft, setDraft] = useState<AIDraft | null>(null)
  const controller = useRef<AbortController | null>(null)
  const [topic, setTopic] = useState(''), [fileName, setFileName] = useState(''), [reading, setReading] = useState(false)
  const source = [topic.trim() && `Requested topics and focus: ${topic.trim()}`, text.trim() && `Study material:\n${text.trim()}`].filter(Boolean).join('\n\n')
  const upload = async (file?: File) => {
    if (!file) return
    setReading(true); setError(''); setDraft(null)
    try { const extracted = await readStudyUpload(file); setText(extracted); setFileName(file.name) }
    catch (error) { setError(error instanceof Error ? error.message : 'Could not read this file. Try another document.') }
    finally { setReading(false) }
  }
  useEffect(() => () => controller.current?.abort(), [])
  const generate = async () => {
    if (!source || loading || reading || source.length > MAX_SOURCE_LENGTH) return
    setError(''); setDraft(null); setLoading(true); controller.current = new AbortController()
    try { setDraft(await generateAIDraft(task, source, category, count, controller.current.signal)) }
    catch(error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Generation failed. Please try again.') }
    finally { setLoading(false) }
  }
  const title = task === 'summary' ? 'Summarize with Mistral' : task === 'flashcards' ? 'Generate flashcards with Mistral' : 'Generate quiz with Mistral'
  return <ViewportOverlay onDismiss={onClose}><section className="glass-modal ref-form-dialog ai-draft-dialog"><div className="ref-panel-title"><h2>{title}</h2><button aria-label="Close AI generator" onClick={onClose}><X size={20}/></button></div><p>Choose your topics, paste study material, or upload a document. Review the draft before saving.</p><label>Topics and instructions<textarea aria-label="Topics and instructions" disabled={loading || reading} rows={2} maxLength={2000} placeholder="e.g. Mood disorders: focus on symptoms and diagnostic criteria, beginner level" value={topic} onChange={event => { setTopic(event.target.value); setDraft(null) }}/></label><label className="ref-file-upload">Upload study material<input type="file" accept=".pdf,.docx,.txt,.md,.csv" disabled={loading || reading} onChange={event => { void upload(event.target.files?.[0]); event.target.value = '' }}/><small>PDF, Word (.docx), TXT, Markdown, CSV, up to 10 MB. Uploading replaces the material below.</small></label>{reading && <p role="status">Reading document...</p>}{fileName && <p>Imported: {fileName}<button className="ref-text-action" disabled={loading || reading} onClick={() => {setText('');setFileName('');setDraft(null)}}>Remove material</button></p>}<label>Study material (optional)<textarea aria-label="Study material (optional)" disabled={loading || reading} rows={7} maxLength={MAX_SOURCE_LENGTH} value={text} onChange={event => {setText(event.target.value);setDraft(null)}}/></label><small>{source.length.toLocaleString()} / 25,000 characters. Extracted text is sent to AI only when you generate.</small>{source.length > MAX_SOURCE_LENGTH && <p role="alert" className="ref-form-error">Shorten the material or instructions to fit 25,000 characters.</p>}{task !== 'summary' && <label>Number of {task === 'quiz' ? 'questions' : 'cards'}<input disabled={loading} type="number" min={1} max={task === 'quiz' ? 15 : 20} value={count} onChange={event => {setCount(Number(event.target.value));setDraft(null)}}/></label>}{error && <p role="alert" className="ref-form-error">{error}</p>}<button className="ref-primary" disabled={loading || reading || !source || source.length > MAX_SOURCE_LENGTH || !Number.isInteger(count) || count < 1 || count > (task === 'quiz' ? 15 : 20)} onClick={generate}>{loading ? <><Spinner className="animate-spin" size={18}/>Generating...</> : draft ? 'Generate again' : 'Generate draft'}</button>{draft && <section className="ai-draft-preview" aria-label="AI draft preview"><h3>{draft.title}</h3>{task === 'summary' ? <><p>{draft.summary}</p><ul>{draft.keyPoints.map((point,index) => <li key={index}>{point}</li>)}</ul></> : task === 'flashcards' ? <ol>{draft.cards.map((card,index) => <li key={index}><strong>{card.question}</strong><p>{card.answer}</p></li>)}</ol> : <ol>{draft.questions.map((question,index) => <li key={index}><strong>{question.question}</strong><ul>{question.options.map((option,answer) => <li key={answer}>{option}{answer === question.correct ? ' (correct)' : ''}</li>)}</ul><p>{question.explanation}</p></li>)}</ol>}<p className="ref-inline-notice">AI-generated draft. Check accuracy against your source material.</p><button className="ref-primary ref-wide" onClick={() => onSave(draft)}>Save {task === 'summary' ? 'as a new note' : task === 'quiz' ? 'quiz' : 'flashcards'}</button></section>}</section></ViewportOverlay>
}
