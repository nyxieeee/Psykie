import { ReviewerContent } from './ReviewerContent'
import { FlashcardDraftReview } from './FlashcardDraftReview'
import { StudyFilePicker } from './StudyFilePicker'
import { useEffect, useRef, useState } from 'react'
import { BookOpen, FileText, Sparkle, Spinner, UploadSimple, X } from '@phosphor-icons/react'
import { ViewportOverlay } from './ViewportOverlay'
import { AIDraft, AITask, QuizOptions, extractImageText, generateAIDraft } from '../utils/ai'
import { MAX_SOURCE_LENGTH, readStudyUpload } from '../utils/studyUpload'
import { useStudyStore } from '../store'
import { readLibrary } from '../utils/studyLibrary'
import '../study-workflows.css'

export type GenerationSettings = { category: string; quizOptions: QuizOptions; timerMinutes: number; sourceName: string; questionSeconds:number; sourceText:string; sourceFile?:File; mode: 'study' | 'exam' }
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
type Props = { task: AITask; initialText?: string; initialSourceName?: string; category?: string; saveLabel?: string; saveError?: string; saving?:boolean; onClose: () => void; onSave: (draft: AIDraft, settings: GenerationSettings) => void }

export function AIGenerator({ task, initialText = '', initialSourceName = '', category = 'General Psychology', saveLabel, saveError, saving=false, onClose, onSave }: Props) {
  const notes = useStudyStore(state => state.notes)
  const [uploadedFile,setUploadedFile]=useState<File>()
  const [sourceMode,setSourceMode] = useState(initialText ? 'text' : 'topic')
  const chooseSource = (mode:string) => {setSourceMode(mode);setUploadedFile(undefined);setText('');setTopic('');setFileName('');setNoteId('');setMaterialId('');setDraft(null);setError('')}
  const [libraryItems] = useState(readLibrary), [materialId, setMaterialId] = useState('')
  const [text, setText] = useState(initialText), [count, setCount] = useState(task === 'quiz' ? 5 : 8)
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [draft, setDraft] = useState<AIDraft | null>(null)
  const controller = useRef<AbortController | null>(null)
  const [topic, setTopic] = useState(''), [fileName, setFileName] = useState(initialSourceName), [reading, setReading] = useState(false)
  const [subject, setSubject] = useState(category), [noteId, setNoteId] = useState('')
  const [quizOptions, setQuizOptions] = useState<QuizOptions>({style: 'multiple-choice', difficulty: 'medium'})
  const [mode,setMode] = useState<'study'|'exam'>('study')
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [questionSeconds,setQuestionSeconds]=useState(0)
  const [ocrEnabled, setOCREnabled] = useState(false), [readProgress, setReadProgress] = useState('')
  const source = [topic.trim() && `Requested topics and focus: ${topic.trim()}`, text.trim() && `Study material:\n${text.trim()}`].filter(Boolean).join('\n\n')
  const upload = async (file?: File) => {
    if (!file) return
    setReading(true);setUploadedFile(undefined); setError(''); setDraft(null);setText('');setFileName(''); controller.current = new AbortController()
    try { const extracted = await readStudyUpload(file, {ocr:ocrEnabled ? extractImageText : undefined, signal:controller.current.signal, onProgress:setReadProgress}); setText(extracted);setUploadedFile(file); setFileName(file.name); setNoteId(''); setMaterialId('') }
    catch (error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Could not read this file. Try another document.') }
    finally { setReading(false); setReadProgress('') }
  }
  useEffect(() => () => controller.current?.abort(), [])
  const generate = async () => {
    if (!source || loading || reading || source.length > MAX_SOURCE_LENGTH) return
    setError(''); setLoading(true); controller.current = new AbortController()
    try { setDraft(await generateAIDraft(task, source, subject, count, controller.current.signal, task === 'quiz' ? quizOptions : undefined)) }
    catch(error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Generation failed. Please try again.') }
    finally { setLoading(false) }
  }
  const title = task==='reviewer'?'Create a psychology reviewer':task === 'summary' ? 'Create a study summary' : task === 'flashcards' ? 'Create flashcards' : 'Create a quiz'
  const busy = loading || reading || saving
  return <ViewportOverlay onDismiss={onClose}>
    <section className="glass-modal ref-form-dialog ai-draft-dialog">
      <div className="ref-panel-title"><h2>{title}</h2><button aria-label="Close AI generator" onClick={onClose}><X size={20}/></button></div>
      <div className="ai-generator-body"><p>{draft?(task==='flashcards'?'Review your draft before saving. You can edit each flashcard.':'Review your draft before saving.'):'Choose what to study, set your preferences, then review the draft.'}</p>
      {!draft&&<><section className="ai-setup-section"><h3><span>1</span>What would you like to study?</h3><div className="ai-source-options" role="group" aria-label="Study source">{[{id:'topic',label:'Type a topic',icon:Sparkle},{id:'upload',label:'Upload a file',icon:UploadSimple},{id:'saved',label:'Saved material',icon:BookOpen},{id:'text',label:'Paste text',icon:FileText}].map(item=><button key={item.id} disabled={busy} aria-pressed={sourceMode===item.id} onClick={()=>chooseSource(item.id)}><item.icon size={23}/>{item.label}</button>)}</div><div className="ai-source-content">
      {sourceMode==='topic'&&<label>Topics and instructions<textarea aria-label="Topics and instructions" disabled={busy} rows={2} maxLength={2000} placeholder="e.g. Mood disorders: focus on symptoms and diagnostic criteria, beginner level" value={topic} onChange={event => { setTopic(event.target.value); setDraft(null) }}/></label>}
      {sourceMode==='saved'&&<>{!!libraryItems.length && <label>Use a Library material<select aria-label="Use a Library material" disabled={busy} value={materialId} onChange={event => { const item=libraryItems.find(value=>value.id===event.target.value); setMaterialId(event.target.value); if(item){setText(item.text);setFileName(item.title);setSubject(item.category);setNoteId('');setDraft(null)} }}><option value="">Choose saved study material</option>{libraryItems.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>}{!!notes.length && <label>Use a saved note<select aria-label="Use a saved note" disabled={busy} value={noteId} onChange={event => { const note = notes.find(item => item.id === event.target.value); setNoteId(event.target.value); setMaterialId(''); if (note) { setText(note.summary); setFileName(note.title); setSubject(note.category); setDraft(null) } }}><option value="">Choose a note or enter material below</option>{notes.map(note => <option key={note.id} value={note.id}>{note.title}</option>)}</select></label>}{!libraryItems.length&&!notes.length&&<p>No saved materials yet. Upload a file or paste your reading to get started.</p>}</>}
      {sourceMode==='upload'&&<><label className="study-ocr-toggle"><input type="checkbox" aria-label="Use AI OCR" disabled={busy} checked={ocrEnabled} onChange={event => setOCREnabled(event.target.checked)}/><span>Use AI OCR for photos and scanned pages<small>Sends images to Mistral when uploaded; uses your AI allowance. Up to 5 scanned pages per PDF. Review extracted text for errors.</small></span></label><StudyFilePicker disabled={busy} onSelect={file=>void upload(file)} hint="PDF, Word, PowerPoint, OpenDocument, text, and images. Up to 10 MB. Photos and scans need AI OCR."/></>}
      {reading && <div><p role="status">{readProgress || 'Reading document...'}</p><button className="ref-text-action" onClick={() => controller.current?.abort()}>Cancel reading</button></div>}
      {fileName && <p>Source: {fileName} <button className="ref-text-action" disabled={busy} onClick={() => {setText('');setFileName('');setNoteId('');setMaterialId('');setDraft(null)}}>Remove material</button></p>}
      {(sourceMode==='text'||text.length>0)&&<label>Study text<textarea aria-label="Study material (optional)" disabled={busy} rows={5} maxLength={MAX_SOURCE_LENGTH} value={text} onChange={event => {setText(event.target.value);setDraft(null)}}/></label>}
      {sourceMode!=='topic'&&<details><summary>Add instructions (optional)</summary><label>Topics and instructions<textarea aria-label="Topics and instructions" disabled={busy} rows={2} maxLength={2000} value={topic} onChange={event=>{setTopic(event.target.value);setDraft(null)}}/></label></details>}
      <small>{source.length.toLocaleString()} / 25,000 characters. This text is sent to AI when you generate.</small>
      {source.length > MAX_SOURCE_LENGTH && <p role="alert" className="ref-form-error">Shorten the material or instructions to fit 25,000 characters.</p>}
      </div></section><section className="ai-setup-section"><h3><span>2</span>Make it yours</h3>
        <label>Subject<select aria-label="Generation subject" disabled={busy} value={subject} onChange={e => {setSubject(e.target.value);setDraft(null)}}>{[...new Set([...subjects, category, subject])].map(value => <option key={value}>{value}</option>)}</select></label>
      {task==='quiz'&&<div className="quiz-setup-choices"><fieldset><legend>Question style</legend><div className="quiz-choice-chips">{[{id:'multiple-choice',label:'Multiple choice'},{id:'true-false',label:'True / false'},{id:'scenario',label:'Psychology scenarios'},{id:'mixed',label:'Mixed practice'}].map(item=><button key={item.id} disabled={busy} aria-pressed={quizOptions.style===item.id} onClick={()=>setQuizOptions({...quizOptions,style:item.id as QuizOptions['style']})}>{item.label}</button>)}</div></fieldset><fieldset><legend>Difficulty</legend><div className="quiz-choice-chips">{[{id:'easy',label:'Foundations'},{id:'medium',label:'Intermediate'},{id:'hard',label:'Advanced'},{id:'board',label:'Board-style'}].map(item=><button key={item.id} disabled={busy} aria-pressed={quizOptions.difficulty===item.id} onClick={()=>setQuizOptions({...quizOptions,difficulty:item.id as QuizOptions['difficulty']})}>{item.label}</button>)}</div></fieldset><fieldset><legend>Learning mode</legend><div className="quiz-choice-chips"><button disabled={busy} aria-pressed={mode==='study'} onClick={()=>setMode('study')}>Study - explain each answer</button><button disabled={busy} aria-pressed={mode==='exam'} onClick={()=>setMode('exam')}>Exam - feedback at the end</button></div></fieldset><fieldset><legend>Timer</legend><div className="quiz-choice-chips"><button disabled={busy} aria-pressed={!timerMinutes&&!questionSeconds} onClick={()=>{setTimerMinutes(0);setQuestionSeconds(0)}}>No timer</button>{[5,10,20,30].map(value=><button key={value} disabled={busy} aria-pressed={timerMinutes===value} onClick={()=>{setTimerMinutes(value);setQuestionSeconds(0)}}>{value} min total</button>)}</div><small>Per question</small><div className="quiz-choice-chips">{[30,60,90,120].map(value=><button key={value} disabled={busy} aria-pressed={questionSeconds===value} onClick={()=>{setQuestionSeconds(value);setTimerMinutes(0)}}>{value} sec</button>)}</div></fieldset></div>}
      {task !== 'summary'&&task!=='reviewer'&&<div className="quiz-choice-chips" aria-label="Quick question count">{(task==='quiz'?[5,10,15]:[5,10,15,20]).map(value=><button key={value} disabled={busy} aria-pressed={count===value} onClick={()=>setCount(value)}>{value} {task==='quiz'?'questions':'cards'}</button>)}</div>}
      {task !== 'summary' && <label>Number of {task === 'quiz' ? 'questions' : 'cards'}<input aria-label={task === 'quiz' ? 'Number of questions' : 'Number of cards'} disabled={busy} type="number" min={1} max={task === 'quiz' ? 15 : 20} value={count} onChange={event => {setCount(Number(event.target.value));setDraft(null)}}/></label>}
      </section></>}
      {error && <p role="alert" className="ref-form-error">{error}</p>}
      {saveError && <p role="alert" className="ref-form-error">{saveError}</p>}
      {!draft&&<button className="ref-primary ref-wide" disabled={busy || !source || source.length > MAX_SOURCE_LENGTH || !Number.isInteger(count) || count < 1 || count > (task === 'quiz' ? 15 : 20)} onClick={generate}>{loading?<><Spinner className="animate-spin" size={18}/>Generating...</>:'Generate draft'}</button>}
      {draft&&<section className="ai-draft-preview" aria-label="AI draft preview">
        {task==='reviewer'?<><h3>{draft.title}</h3><ReviewerContent draft={draft} category={subject}/></>:task==='flashcards'?<FlashcardDraftReview draft={draft} category={subject} onChange={setDraft} disabled={busy}/>:<><h3>{draft.title}</h3>{task==='summary'?<><p>{draft.summary}</p><ul>{draft.keyPoints.map((point,index)=><li key={index}>{point}</li>)}</ul></>:<ol>{draft.questions.map((question,index)=><li key={index}><strong>{question.question}</strong><ul>{question.options.map((option,answer)=><li key={answer}>{option}{answer===question.correct?' (correct)':''}</li>)}</ul><p>{question.explanation}</p></li>)}</ol>}</>}
        <p className="ref-inline-notice">AI-generated draft. Check the content against your study material before saving.</p>
      </section>}
      </div>
      {draft&&<footer className="draft-save-bar"><div className="draft-save-meta"><strong>{task==='flashcards'?draft.cards.length+' cards ready':task==='quiz'?draft.questions.length+' questions ready':task==='reviewer'?'Reviewer ready':'Summary ready'}</strong><button className="ref-text-action" disabled={busy} onClick={()=>setDraft(null)}>Edit source and settings</button></div><div className="draft-save-actions"><button className="ref-secondary" disabled={busy} onClick={generate}>{loading?'Generating...':'Generate again'}</button><button className="ref-primary" disabled={busy||!draft.title.trim()||task==='flashcards'&&draft.cards.some(card=>!card.question.trim()||!card.answer.trim())} onClick={()=>onSave(draft,{category:subject,quizOptions,timerMinutes,questionSeconds,mode,sourceText:text,sourceFile:uploadedFile,sourceName:fileName||topic.trim().slice(0,120)||'Pasted study material'})}>{saving?'Saving...':saveLabel||(task==='reviewer'?'Save reviewer':task==='summary'?'Save as a new note':task==='quiz'?'Save quiz':'Save deck')}</button></div></footer>}
    </section>
  </ViewportOverlay>
}
