import { QuizDraftReview } from './QuizDraftReview'
import { AGGREGATE_LIMITS, generateStudyDraft, type GenerationCheckpoint } from '../utils/studyGeneration'
import { workspaceStorage } from '../utils/workspaceStorage'
import { plainText } from '../../supabase/functions/_shared/plainText'
import { validateDraft } from '../../supabase/functions/_shared/contracts'
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

export type GenerationSettings = { category: string; quizOptions: QuizOptions; timerMinutes: number; sourceName: string; questionSeconds:number; sourceText:string; sourceFile?:File; mode: 'study' | 'exam';shuffleQuestions:boolean;shuffleAnswers:boolean }
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
type Props = { task: AITask; initialText?: string; initialSourceName?: string; initialInstructions?:string; category?: string; saveLabel?: string; saveError?: string; saving?:boolean; onClose: () => void; onSave: (draft: AIDraft, settings: GenerationSettings) => void }

export function AIGenerator({ task, initialText = '', initialSourceName = '', initialInstructions='', category = 'General Psychology', saveLabel, saveError, saving=false, onClose, onSave }: Props) {
  const notes = useStudyStore(state => state.notes)
  const [uploadedFile,setUploadedFile]=useState<File>()
  const [sourceMode,setSourceMode] = useState(initialText ? 'text' : 'topic')
  const chooseSource = (mode:string) => {setSourceMode(mode);setUploadedFile(undefined);setText('');setTopic('');setFileName('');setNoteId('');setMaterialId('');setDraft(null);setError('')}
  const [libraryItems] = useState(readLibrary), [materialId, setMaterialId] = useState('')
  const [text, setText] = useState(initialText), [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false), [error, setError] = useState(''), [draft, setDraft] = useState<AIDraft | null>(null)
  const controller = useRef<AbortController | null>(null)
  const [topic, setTopic] = useState(initialInstructions), [fileName, setFileName] = useState(initialSourceName), [reading, setReading] = useState(false)
  const [subject, setSubject] = useState(category), [noteId, setNoteId] = useState('')
  const [quizOptions, setQuizOptions] = useState<QuizOptions>({style: 'multiple-choice', difficulty: 'medium'})
  const [mode,setMode] = useState<'study'|'exam'>('study')
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [questionSeconds,setQuestionSeconds]=useState(0)
  const [shuffleQuestions,setShuffleQuestions]=useState(false),[shuffleAnswers,setShuffleAnswers]=useState(false)
  const [readProgress, setReadProgress] = useState('')
  const [generationProgress,setGenerationProgress]=useState('')
  const [progressStorageWarning,setProgressStorageWarning]=useState('')
  const [checkpoint,setCheckpoint]=useState<GenerationCheckpoint>()
  const savedKey='psykie-generation-'+task
  const [savedGeneration,setSavedGeneration]=useState<null|{source:string;text:string;topic:string;fileName:string;category:string;count:number;quizOptions:QuizOptions;timerMinutes:number;questionSeconds:number;mode:'study'|'exam';shuffleQuestions:boolean;shuffleAnswers:boolean;checkpoint:GenerationCheckpoint}>(()=>{try{return JSON.parse(workspaceStorage.getItem(savedKey)||'null')}catch{return null}})
  const effectiveTopic = topic.trim() || subject || category || 'General Psychology'
  const source = [
    (sourceMode === 'topic' || topic.trim() || !text.trim()) && `Topic: ${effectiveTopic}${topic.trim() && topic.trim() !== effectiveTopic ? `\nFocus and instructions: ${topic.trim()}` : ''}`,
    text.trim() && `Study material:\n${text.trim()}`
  ].filter(Boolean).join('\n\n')
  const upload = async (file?: File) => {
    if (!file) return
    setReading(true);setUploadedFile(undefined); setError(''); setDraft(null);setText('');setFileName(''); controller.current = new AbortController()
    try { const extracted = await readStudyUpload(file, {ocr:extractImageText, signal:controller.current.signal, onProgress:setReadProgress}); setText(extracted);setUploadedFile(file); setFileName(file.name); setNoteId(''); setMaterialId('') }
    catch (error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Could not read this file. Try another document.') }
    finally { setReading(false); setReadProgress('') }
  }
  useEffect(() => () => controller.current?.abort(), [])
  const generate = async (fresh=false) => {
    if (!source || loading || reading || source.length > MAX_SOURCE_LENGTH) return
    if(fresh){setCheckpoint(undefined);setSavedGeneration(null);workspaceStorage.removeItem(savedKey)}
    setError(''); setLoading(true); controller.current = new AbortController()
    try { const result=await generateStudyDraft(generateAIDraft,task,source,subject,count,{signal:controller.current.signal,quizOptions:task==='quiz'?quizOptions:undefined,checkpoint:fresh?undefined:checkpoint,onProgress:setGenerationProgress,onCheckpoint:next=>{setCheckpoint(next);const saved={source,text,topic,fileName,category:subject,count,quizOptions,timerMinutes,questionSeconds,mode,shuffleQuestions,shuffleAnswers,checkpoint:next};setSavedGeneration(saved);try{workspaceStorage.setItem(savedKey,JSON.stringify(saved))}catch{setProgressStorageWarning('Browser storage is full. Completed batches are available in this tab, but cannot be restored after closing it.')}}});setDraft(result);if(task==='quiz'&&result.questions.length<count||task==='flashcards'&&result.cards.length<count)setError('The source supported fewer distinct items than requested. Review this draft or add more source material.') }
    catch(error) { if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Generation failed. Please try again.') }
    finally { setLoading(false);setGenerationProgress('') }
  }
  const saveDraft=async()=>{if(!draft)return;try{await onSave(validateDraft(draft,task,AGGREGATE_LIMITS),{category:subject,quizOptions,timerMinutes,questionSeconds,mode,shuffleQuestions,shuffleAnswers,sourceText:text,sourceFile:uploadedFile,sourceName:fileName||topic.trim().slice(0,120)||'Pasted study material'});workspaceStorage.removeItem(savedKey);setSavedGeneration(null);setCheckpoint(undefined)}catch(error){setError(error instanceof Error?error.message:'Complete the draft before saving.')}}
  const title = task==='reviewer'?'Create a psychology reviewer':task === 'summary' ? 'Create a study summary' : task === 'flashcards' ? 'Create flashcards' : 'Create a quiz'
  const busy = loading || reading || saving
  return <ViewportOverlay onDismiss={onClose}>
    <section className="glass-modal ref-form-dialog ai-draft-dialog">
      <div className="ref-panel-title"><h2>{title}</h2><button aria-label="Close AI generator" onClick={onClose}><X size={20}/></button></div>
      <div className="ai-generator-body"><p>{draft?(task==='flashcards'?'Review your draft before saving. You can edit each flashcard.':'Review your draft before saving.'):'Choose what to study, set your preferences, then review the draft.'}</p>
      {!draft&&savedGeneration&&!loading&&<div className="ref-inline-notice"><p>A saved generation is available ({savedGeneration.checkpoint.completed} items or sections ready).</p><button className="ref-secondary" onClick={()=>{setText(savedGeneration.text??savedGeneration.source);setTopic(savedGeneration.topic||'');setFileName(savedGeneration.fileName||'');setSourceMode('text');setSubject(savedGeneration.category);setCount(savedGeneration.count);setQuizOptions(savedGeneration.quizOptions);setTimerMinutes(savedGeneration.timerMinutes||0);setQuestionSeconds(savedGeneration.questionSeconds||0);setMode(savedGeneration.mode||'study');setShuffleQuestions(!!savedGeneration.shuffleQuestions);setShuffleAnswers(!!savedGeneration.shuffleAnswers);setCheckpoint(savedGeneration.checkpoint);setError('Saved progress loaded. Choose Generate draft to continue.')}}>Restore saved generation</button><button className="ref-text-action" onClick={()=>{workspaceStorage.removeItem(savedKey);setSavedGeneration(null);setCheckpoint(undefined)}}>Discard saved generation</button></div>}
      {!draft&&<><section className="ai-setup-section"><h3><span>1</span>What would you like to study?</h3><div className="ai-source-options" role="group" aria-label="Study source">{[{id:'topic',label:'Type a topic',icon:Sparkle},{id:'upload',label:'Upload a file',icon:UploadSimple},{id:'saved',label:'Saved material',icon:BookOpen},{id:'text',label:'Paste text',icon:FileText}].map(item=><button key={item.id} disabled={busy} aria-pressed={sourceMode===item.id} onClick={()=>chooseSource(item.id)}><item.icon size={23}/>{item.label}</button>)}</div><div className="ai-source-content">
      {sourceMode==='topic'&&<div className="ai-topic-setup">
        <label>Subject / Topic
          <select aria-label="Generation subject" disabled={busy} value={subject} onChange={e => {setSubject(e.target.value);setDraft(null)}}>
            {[...new Set([...subjects, category, subject])].map(value => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>Specific focus or subtopics <small className="text-[var(--text-secondary)] font-normal">(optional — AI uses general knowledge if blank)</small>
          <textarea aria-label="Topics and instructions" disabled={busy} rows={2} maxLength={2000} placeholder="e.g. Focus on cognitive distortions, heuristics, and decision-making" value={topic} onChange={event => { setTopic(event.target.value); setDraft(null) }}/>
        </label>
      </div>}
      {sourceMode==='saved'&&<>
        {!!libraryItems.length && (
          <div className="ai-saved-grid-group">
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Or select from your Library:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {libraryItems.slice(0, 6).map(item => (
                <button
                  key={item.id}
                  type="button"
                  disabled={busy}
                  aria-pressed={materialId === item.id}
                  onClick={() => { setMaterialId(item.id); setText(item.text); setFileName(item.title); setSubject(item.category); setNoteId(''); setDraft(null) }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-sm transition-colors ${materialId === item.id ? 'border-[var(--pink)] bg-[var(--rose-soft)] text-[var(--pink)] font-semibold' : 'border-[var(--border)] hover:bg-[var(--rose-soft)]'}`}
                >
                  <BookOpen size={16} className="shrink-0 text-[var(--pink)]" />
                  <span className="truncate">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {!!notes.length && (
          <div className="ai-saved-grid-group">
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">Or select from your Notes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {notes.slice(0, 6).map(note => (
                <button
                  key={note.id}
                  type="button"
                  disabled={busy}
                  aria-pressed={noteId === note.id}
                  onClick={() => { const item=notes.find(n=>n.id===note.id); if(item){setNoteId(item.id);setMaterialId('');setText(item.summary);setFileName(item.title);setSubject(item.category);setDraft(null)} }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-sm transition-colors ${noteId === note.id ? 'border-[var(--pink)] bg-[var(--rose-soft)] text-[var(--pink)] font-semibold' : 'border-[var(--border)] hover:bg-[var(--rose-soft)]'}`}
                >
                  <FileText size={16} className="shrink-0 text-[var(--pink)]" />
                  <span className="truncate">{note.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {!!libraryItems.length && <label>All Library materials<select aria-label="Use a Library material" disabled={busy} value={materialId} onChange={event => { const item=libraryItems.find(value=>value.id===event.target.value); setMaterialId(event.target.value); if(item){setText(item.text);setFileName(item.title);setSubject(item.category);setNoteId('');setDraft(null)} }}><option value="">Choose saved study material</option>{libraryItems.map(item=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>}
        {!!notes.length && <label>All notes<select aria-label="Use a saved note" disabled={busy} value={noteId} onChange={event => { const note = notes.find(item => item.id === event.target.value); setNoteId(event.target.value); setMaterialId(''); if (note) { setText(note.summary); setFileName(note.title); setSubject(note.category); setDraft(null) } }}><option value="">Choose a note or enter material below</option>{notes.map(note => <option key={note.id} value={note.id}>{note.title}</option>)}</select></label>}
        {!libraryItems.length&&!notes.length&&<p>No saved materials yet. Upload a file or choose a topic above to get started.</p>}
      </>}
      {sourceMode==='upload'&&<><p className="ref-inline-notice">Text is extracted automatically. Photos and scanned PDF pages use AI OCR and your AI allowance (up to 50 scanned pages per PDF).</p><StudyFilePicker disabled={busy} onSelect={file=>void upload(file)} hint="PDF, Word, PowerPoint, OpenDocument, text, and images. Up to 10 MB. Photos and scans are read automatically."/></>}
      {reading && <div><p role="status">{readProgress || 'Reading document...'}</p><button className="ref-text-action" onClick={() => controller.current?.abort()}>Cancel reading</button></div>}
      {fileName && <p>Source: {fileName} <button className="ref-text-action" disabled={busy} onClick={() => {setText('');setFileName('');setNoteId('');setMaterialId('');setDraft(null)}}>Remove material</button></p>}
      {(sourceMode==='text'||text.length>0)&&<label>Study text<textarea aria-label="Study material (optional)" disabled={busy} rows={5} maxLength={MAX_SOURCE_LENGTH} value={text} onChange={event => {setText(event.target.value);setDraft(null)}}/></label>}
      {sourceMode!=='topic'&&<details><summary>Add instructions (optional)</summary><label>Topics and instructions<textarea aria-label="Topics and instructions" disabled={busy} rows={2} maxLength={2000} value={topic} onChange={event=>{setTopic(event.target.value);setDraft(null)}}/></label></details>}
      {sourceMode === 'topic' && !text.trim() ? (
        <p className="ref-inline-notice" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          ✨ Ready to generate from established psychology knowledge for <strong>{effectiveTopic}</strong>. No text or file required.
        </p>
      ) : (
        <small>{source.length.toLocaleString()} / 1,000,000 characters. {text.trim() ? 'Extracted from your study material.' : 'This text is sent to AI when you generate.'}</small>
      )}
      {source.length > MAX_SOURCE_LENGTH && <p role="alert" className="ref-form-error">Shorten the material or instructions to fit 1,000,000 characters.</p>}
      </div></section>
      {task !== 'summary' && task !== 'reviewer' ? (
        <section className="ai-setup-section">
          <h3><span>2</span>{task === 'quiz' ? 'Quiz settings' : 'Deck settings'}</h3>
          {sourceMode !== 'topic' && <label>Subject<select aria-label="Generation subject" disabled={busy} value={subject} onChange={e => {setSubject(e.target.value);setDraft(null)}}>{[...new Set([...subjects, category, subject])].map(value => <option key={value}>{value}</option>)}</select></label>}
          {task==='quiz'&&<div className="quiz-setup-choices"><fieldset><legend>Question style</legend><div className="quiz-choice-chips">{[{id:'multiple-choice',label:'Multiple choice'},{id:'true-false',label:'True / false'},{id:'scenario',label:'Psychology scenarios'},{id:'mixed',label:'Mixed practice'},{id:'case-study',label:'Psychology case study'},{id:'research',label:'Research reasoning'},{id:'ethics',label:'Ethics & judgment'},{id:'identification',label:'Identification'},{id:'fill-blank',label:'Fill in the blank'}].map(item=><button key={item.id} disabled={busy} aria-pressed={quizOptions.style===item.id} onClick={()=>setQuizOptions({...quizOptions,style:item.id as QuizOptions['style']})}>{item.label}</button>)}</div></fieldset><fieldset><legend>Difficulty</legend><div className="quiz-choice-chips">{[{id:'easy',label:'Foundations'},{id:'medium',label:'Intermediate'},{id:'hard',label:'Advanced'},{id:'board',label:'Board-style'}].map(item=><button key={item.id} disabled={busy} aria-pressed={quizOptions.difficulty===item.id} onClick={()=>setQuizOptions({...quizOptions,difficulty:item.id as QuizOptions['difficulty']})}>{item.label}</button>)}</div></fieldset><fieldset><legend>Learning mode</legend><div className="quiz-choice-chips"><button disabled={busy} aria-pressed={mode==='study'} onClick={()=>setMode('study')}>Study - explain each answer</button><button disabled={busy} aria-pressed={mode==='exam'} onClick={()=>setMode('exam')}>Exam - feedback at the end</button></div></fieldset><fieldset><legend>Timer</legend><div className="quiz-choice-chips"><button disabled={busy} aria-pressed={!timerMinutes&&!questionSeconds} onClick={()=>{setTimerMinutes(0);setQuestionSeconds(0)}}>No timer</button>{[5,10,20,30,60,120,180].map(value=><button key={value} disabled={busy} aria-pressed={timerMinutes===value} onClick={()=>{setTimerMinutes(value);setQuestionSeconds(0)}}>{value} min total</button>)}</div><small>Per question</small><div className="quiz-choice-chips">{[30,60,90,120].map(value=><button key={value} disabled={busy} aria-pressed={questionSeconds===value} onClick={()=>{setQuestionSeconds(value);setTimerMinutes(0)}}>{value} sec</button>)}</div></fieldset><fieldset><legend>Custom timer (optional)</legend><label>Total minutes<input aria-label="Custom total minutes" type="number" min={0} max={300} disabled={busy} value={timerMinutes} onChange={e=>{setTimerMinutes(Math.max(0,Math.min(300,Number(e.target.value))));setQuestionSeconds(0)}}/></label><label>Seconds per question<input aria-label="Custom seconds per question" type="number" min={0} max={600} disabled={busy} value={questionSeconds} onChange={e=>{setQuestionSeconds(Math.max(0,Math.min(600,Number(e.target.value))));setTimerMinutes(0)}}/></label><small>Set either timer to 0 for untimed practice.</small></fieldset><fieldset><legend>Practice order</legend><label><input type="checkbox" disabled={busy} checked={shuffleQuestions} onChange={e=>setShuffleQuestions(e.target.checked)}/>Shuffle questions each attempt</label><label><input type="checkbox" disabled={busy} checked={shuffleAnswers} onChange={e=>setShuffleAnswers(e.target.checked)}/>Shuffle multiple-choice options</label></fieldset></div>}
          <div className="quiz-choice-chips" aria-label="Quick question count">{(task==='quiz'?[5,10,15,20,30,50,75,100]:[5,10,20,30,50,100]).map(value=><button key={value} disabled={busy} aria-pressed={count===value} onClick={()=>setCount(value)}>{value} {task==='quiz'?'questions':'cards'}</button>)}</div>
          <label>Number of {task === 'quiz' ? 'questions' : 'cards'}<input aria-label={task === 'quiz' ? 'Number of questions' : 'Number of cards'} disabled={busy} type="number" min={1} max={100} value={count} onChange={event => {setCount(Number(event.target.value));setDraft(null)}}/></label>
        </section>
      ) : (
        sourceMode !== 'topic' && (
          <div className="ai-summary-subject-picker" style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            <label>Subject<select aria-label="Generation subject" disabled={busy} value={subject} onChange={e => {setSubject(e.target.value);setDraft(null)}}>{[...new Set([...subjects, category, subject])].map(value => <option key={value}>{value}</option>)}</select></label>
          </div>
        )
      )}</>}
      {progressStorageWarning&&<p role="status" className="ref-inline-notice">{progressStorageWarning}</p>}
      {loading&&<div role="status" className="ref-inline-notice"><p>{generationProgress||'Preparing study material...'}</p><small>Long quizzes run in small batches, spaced to respect AI limits. Completed batches are saved.</small><button className="ref-secondary" onClick={()=>controller.current?.abort()}>Stop generation</button></div>}
      {error && <p role="alert" className="ref-form-error">{error}</p>}
      {!loading&&!draft&&checkpoint?.draft.title&&<button className="ref-secondary" onClick={()=>{try{setDraft(validateDraft(checkpoint.draft,task,AGGREGATE_LIMITS))}catch{setError('Continue generation to finish the first usable draft.')}}}>Review completed items</button>}
      {saveError && <p role="alert" className="ref-form-error">{saveError}</p>}
      {!draft&&<button className="ref-primary ref-wide" disabled={busy || !source || source.length > MAX_SOURCE_LENGTH || !Number.isInteger(count) || count < 1 || count > 100} onClick={()=>void generate()}>{loading?<><Spinner className="animate-spin" size={18}/>Generating...</>:'Generate draft'}</button>}
      {draft&&<section className="ai-draft-preview" aria-label="AI draft preview">
        {task==='reviewer'?<><h3>{plainText(draft.title)}</h3><ReviewerContent draft={draft} category={subject}/></>:task==='quiz'?<QuizDraftReview draft={draft} onChange={setDraft} disabled={busy}/>:task==='flashcards'?<FlashcardDraftReview draft={draft} category={subject} onChange={setDraft} disabled={busy}/>:<><h3>{plainText(draft.title)}</h3>{task==='summary'?<><p>{plainText(draft.summary)}</p><ul>{draft.keyPoints.map((point,index)=><li key={index}>{plainText(point)}</li>)}</ul></>:<ol>{draft.questions.map((question,index)=><li key={index}><strong>{plainText(question.question)}</strong><ul>{question.options.map((option,answer)=><li key={answer}>{plainText(option)}{answer===question.correct?' (correct)':''}</li>)}</ul><p>{plainText(question.explanation)}</p></li>)}</ol>}</>}
        <p className="ref-inline-notice">AI-generated draft. Check the content against your study material before saving.</p>
      </section>}
      </div>
      {draft&&<footer className="draft-save-bar"><div className="draft-save-meta"><strong>{task==='flashcards'?draft.cards.length+' cards ready':task==='quiz'?draft.questions.length+' questions ready':task==='reviewer'?'Reviewer ready':'Summary ready'}</strong><button className="ref-text-action" disabled={busy} onClick={()=>setDraft(null)}>Edit source and settings</button></div><div className="draft-save-actions"><button className="ref-secondary" disabled={busy} onClick={()=>void generate(true)}>{loading?'Generating...':'Generate again'}</button><button className="ref-primary" disabled={busy||!draft.title.trim()||task==='flashcards'&&draft.cards.some(card=>!card.question.trim()||!card.answer.trim())} onClick={saveDraft}>{saving?'Saving...':saveLabel||(task==='reviewer'?'Save reviewer':task==='summary'?'Save as a new note':task==='quiz'?'Save quiz':'Save deck')}</button></div></footer>}
    </section>
  </ViewportOverlay>
}
