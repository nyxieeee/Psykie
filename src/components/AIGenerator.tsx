import { useEffect, useRef, useState } from 'react'
import { BookOpen, FileText, Sparkle, Spinner, UploadSimple, X } from '@phosphor-icons/react'
import { ViewportOverlay } from './ViewportOverlay'
import { AIDraft, AITask, QuizOptions, extractImageText, generateAIDraft } from '../utils/ai'
import { MAX_SOURCE_LENGTH, STUDY_UPLOAD_ACCEPT, readStudyUpload } from '../utils/studyUpload'
import { useStudyStore } from '../store'
import { readLibrary } from '../utils/studyLibrary'
import '../study-workflows.css'

export type GenerationSettings = { category: string; quizOptions: QuizOptions; timerMinutes: number; sourceName: string; mode: 'study' | 'exam' }
export const PSYCHOLOGY_SUBJECTS = [
  'General Psychology',
  'Cognitive Psychology',
  'Developmental Psychology',
  'Abnormal & Clinical Psychology',
  'Biological Psychology & Neuroscience',
  'Social Psychology',
  'Personality Psychology',
  'Research Methods & Statistics',
  'Psychological Assessment & Testing',
  'Learning & Behavioral Psychology',
  'Sensation & Perception',
  'Health Psychology',
  'Industrial-Organizational Psychology',
  'Educational Psychology',
  'Forensic Psychology',
  'Neuropsychology',
  'Psychopathology & DSM-5-TR',
  'Theories of Psychotherapy',
  'Ethics & Professional Practice',
  'Board Exam & Licensure Prep',
]
const subjects = PSYCHOLOGY_SUBJECTS
type Props = { task: AITask; initialText?: string; initialSourceName?: string; category?: string; saveLabel?: string; saveError?: string; onClose: () => void; onSave: (draft: AIDraft, settings: GenerationSettings) => void }

export function AIGenerator({ task, initialText = '', initialSourceName = '', category = 'General Psychology', saveLabel, saveError, onClose, onSave }: Props) {
  const notes = useStudyStore(state => state.notes)
  const [sourceMode,setSourceMode] = useState(initialText ? 'text' : 'topic')
  const chooseSource = (mode:string) => {setSourceMode(mode);setText('');setTopic('');setFileName('');setNoteId('');setMaterialId('');setDraft(null);setError('')}
  const [libraryItems] = useState(readLibrary), [materialId, setMaterialId] = useState('')
  const [text, setText] = useState(initialText), [count, setCount] = useState(task === 'quiz' ? 5 : 8)
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [draft, setDraft] = useState<AIDraft | null>(null)
  const controller = useRef<AbortController | null>(null)
  const [topic, setTopic] = useState(''), [fileName, setFileName] = useState(initialSourceName), [reading, setReading] = useState(false)
  const [subject, setSubject] = useState(category), [noteId, setNoteId] = useState('')
  const [quizOptions, setQuizOptions] = useState<QuizOptions>({style: 'multiple-choice', difficulty: 'medium'})
  const [mode,setMode] = useState<'study'|'exam'>('study')
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [ocrEnabled, setOCREnabled] = useState(false), [readProgress, setReadProgress] = useState('')
  const source = [topic.trim() && `Requested topics and focus: ${topic.trim()}`, text.trim() && `Study material:\n${text.trim()}`].filter(Boolean).join('\n\n')
  const upload = async (file?: File) => {
    if (!file) return
    setReading(true); setError(''); setDraft(null); controller.current = new AbortController()
    try { const extracted = await readStudyUpload(file, {ocr:ocrEnabled ? extractImageText : undefined, signal:controller.current.signal, onProgress:setReadProgress}); setText(extracted); setFileName(file.name); setNoteId(''); setMaterialId('') }
    catch (error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Could not read this file. Try another document.') }
    finally { setReading(false); setReadProgress('') }
  }
  useEffect(() => () => controller.current?.abort(), [])
  const generate = async () => {
    if (!source || loading || reading || source.length > MAX_SOURCE_LENGTH) return
    setError(''); setDraft(null); setLoading(true); controller.current = new AbortController()
    try { setDraft(await generateAIDraft(task, source, subject, count, controller.current.signal, task === 'quiz' ? quizOptions : undefined)) }
    catch(error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Generation failed. Please try again.') }
    finally { setLoading(false) }
  }
  const title = task === 'summary' ? 'Create a study summary' : task === 'flashcards' ? 'Create flashcards' : 'Create a quiz'
  const busy = loading || reading
  return <ViewportOverlay onDismiss={onClose}>
    <section className="glass-modal ref-form-dialog ai-draft-dialog">
      <div className="ref-panel-title"><h2>{title}</h2><button aria-label="Close AI generator" onClick={onClose}><X size={20}/></button></div>
      <p>Choose what to study, set your preferences, then review the draft.</p>
      {!draft&&<><section className="ai-setup-section"><h3><span>1</span>What would you like to study?</h3><div className="ai-source-options" role="group" aria-label="Study source">{[{id:'topic',label:'Type a topic',icon:Sparkle},{id:'upload',label:'Upload a file',icon:UploadSimple},{id:'saved',label:'Saved material',icon:BookOpen},{id:'text',label:'Paste text',icon:FileText}].map(item=><button key={item.id} disabled={busy} aria-pressed={sourceMode===item.id} onClick={()=>chooseSource(item.id)}><item.icon size={23}/>{item.label}</button>)}</div><div className="ai-source-content">
      {sourceMode==='topic'&&<label>Topics and instructions<textarea aria-label="Topics and instructions" disabled={busy} rows={2} maxLength={2000} placeholder="e.g. Mood disorders: focus on symptoms and diagnostic criteria, beginner level" value={topic} onChange={event => { setTopic(event.target.value); setDraft(null) }}/></label>}
      {sourceMode==='saved'&&<>{!!libraryItems.length && <label>Use a Study Box material<select aria-label="Use a Study Box material" disabled={busy} value={materialId} onChange={event => { const item=libraryItems.find(value=>value.id===event.target.value); setMaterialId(event.target.value); if(item){setText(item.text);setFileName(item.title);setSubject(item.category);setNoteId('');setDraft(null)} }}><option value="">Choose saved study material</option>{libraryItems.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>}{!!notes.length && <label>Use a saved note<select aria-label="Use a saved note" disabled={busy} value={noteId} onChange={event => { const note = notes.find(item => item.id === event.target.value); setNoteId(event.target.value); setMaterialId(''); if (note) { setText(note.summary); setFileName(note.title); setSubject(note.category); setDraft(null) } }}><option value="">Choose a note or enter material below</option>{notes.map(note => <option key={note.id} value={note.id}>{note.title}</option>)}</select></label>}{!libraryItems.length&&!notes.length&&<p>No saved materials yet. Upload a file or paste your reading to get started.</p>}</>}
      {sourceMode==='upload'&&<><label className="study-ocr-toggle"><input type="checkbox" aria-label="Use AI OCR" disabled={busy} checked={ocrEnabled} onChange={event => setOCREnabled(event.target.checked)}/><span>Use AI OCR for photos and scanned pages<small>Sends images to Mistral when uploaded; uses your AI allowance. Up to 5 scanned pages per PDF. Review extracted text for errors.</small></span></label><label className="ref-file-upload">Upload study material<input type="file" accept={STUDY_UPLOAD_ACCEPT} disabled={busy} onChange={event => { void upload(event.target.files?.[0]); event.target.value = '' }}/><small>PDF, Word, text, JPEG, PNG, WebP, up to 10 MB. Uploading replaces the material below.</small></label></>}
      {reading && <div><p role="status">{readProgress || 'Reading document...'}</p><button className="ref-text-action" onClick={() => controller.current?.abort()}>Cancel reading</button></div>}
      {fileName && <p>Source: {fileName} <button className="ref-text-action" disabled={busy} onClick={() => {setText('');setFileName('');setNoteId('');setMaterialId('');setDraft(null)}}>Remove material</button></p>}
      {(sourceMode==='text'||text.length>0)&&<label>Study text<textarea aria-label="Study material (optional)" disabled={busy} rows={5} maxLength={MAX_SOURCE_LENGTH} value={text} onChange={event => {setText(event.target.value);setDraft(null)}}/></label>}
      {sourceMode!=='topic'&&<details><summary>Add instructions (optional)</summary><label>Topics and instructions<textarea aria-label="Topics and instructions" disabled={busy} rows={2} maxLength={2000} value={topic} onChange={event=>{setTopic(event.target.value);setDraft(null)}}/></label></details>}
      <small>{source.length.toLocaleString()} / 25,000 characters. This text is sent to AI when you generate.</small>
      {source.length > MAX_SOURCE_LENGTH && <p role="alert" className="ref-form-error">Shorten the material or instructions to fit 25,000 characters.</p>}
      </div></section><section className="ai-setup-section"><h3><span>2</span>Make it yours</h3>
        <label>Subject<select aria-label="Generation subject" disabled={busy} value={subject} onChange={e => {setSubject(e.target.value);setDraft(null)}}>{[...new Set([...subjects, category, subject])].map(value => <option key={value}>{value}</option>)}</select></label>
      {task === 'quiz' && <div className="study-setup-grid">
        <label>Question style<select aria-label="Question style" disabled={busy} value={quizOptions.style} onChange={e => {setQuizOptions({...quizOptions,style:e.target.value as QuizOptions['style']});setDraft(null)}}><option value="multiple-choice">Multiple choice</option><option value="true-false">True / false</option><option value="scenario">Psychology scenarios</option><option value="mixed">Mixed practice</option></select></label>
        <label>Difficulty<select aria-label="Difficulty" disabled={busy} value={quizOptions.difficulty} onChange={e => {setQuizOptions({...quizOptions,difficulty:e.target.value as QuizOptions['difficulty']});setDraft(null)}}><option value="easy">Foundations</option><option value="medium">Intermediate</option><option value="hard">Advanced</option><option value="board">Board-style practice</option></select></label>
        <label>Learning mode<select aria-label="Learning mode" disabled={busy} value={mode} onChange={event=>setMode(event.target.value as 'study'|'exam')}><option value="study">Study - explain each answer</option><option value="exam">Exam - feedback at the end</option></select></label>
        <label>Practice timer<select aria-label="Practice timer" disabled={busy} value={timerMinutes} onChange={e => setTimerMinutes(Number(e.target.value))}><option value={0}>Untimed</option><option value={5}>5 minutes</option><option value={10}>10 minutes</option><option value={20}>20 minutes</option><option value={30}>30 minutes</option></select></label>
      </div>}
      {task !== 'summary' && <label>Number of {task === 'quiz' ? 'questions' : 'cards'}<input aria-label={task === 'quiz' ? 'Number of questions' : 'Number of cards'} disabled={busy} type="number" min={1} max={task === 'quiz' ? 15 : 20} value={count} onChange={event => {setCount(Number(event.target.value));setDraft(null)}}/></label>}
      </section></>}
      {error && <p role="alert" className="ref-form-error">{error}</p>}
      {saveError && <p role="alert" className="ref-form-error">{saveError}</p>}
      {draft&&<button className="ref-secondary" onClick={()=>setDraft(null)}>Edit source and settings</button>}
      <button className="ref-primary" disabled={busy || !source || source.length > MAX_SOURCE_LENGTH || !Number.isInteger(count) || count < 1 || count > (task === 'quiz' ? 15 : 20)} onClick={generate}>{loading ? <><Spinner className="animate-spin" size={18}/>Generating...</> : draft ? 'Generate again' : 'Generate draft'}</button>
      {draft && <section className="ai-draft-preview" aria-label="AI draft preview"><h3>{draft.title}</h3>
        {task === 'summary' ? <><p>{draft.summary}</p><ul>{draft.keyPoints.map((point,index) => <li key={index}>{point}</li>)}</ul></> : task === 'flashcards' ? <ol>{draft.cards.map((card,index) => <li key={index}><strong>{card.question}</strong><p>{card.answer}</p></li>)}</ol> : <ol>{draft.questions.map((question,index) => <li key={index}><strong>{question.question}</strong><ul>{question.options.map((option,answer) => <li key={answer}>{option}{answer === question.correct ? ' (correct)' : ''}</li>)}</ul><p>{question.explanation}</p></li>)}</ol>}
        <p className="ref-inline-notice">AI-generated draft. Check accuracy against your source material. Psychology practice is educational and does not replace an official exam or professional judgment.</p>
        <button className="ref-primary ref-wide" onClick={() => onSave(draft, {category:subject, quizOptions, timerMinutes, mode, sourceName:fileName || topic.trim().slice(0, 120) || 'Pasted study material'})}>{saveLabel || (task === 'summary' ? 'Save as a new note' : task === 'quiz' ? 'Save quiz' : 'Save flashcards')}</button>
      </section>}
    </section>
  </ViewportOverlay>
}
