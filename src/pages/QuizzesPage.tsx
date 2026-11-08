import { downloadWord } from '../utils/studyExport'
import { plainText } from '../../supabase/functions/_shared/plainText'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle, Clock, DownloadSimple, Flag, X } from '@phosphor-icons/react'
import { AIGenerator } from '../components/AIGenerator'
import { ReferenceEmpty, ReferenceStart, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useStudyStore } from '../store'
import { readWorkspaceList, workspaceStorage } from '../utils/workspaceStorage'
import '../study-workflows.css'
import { completeQuizSession, createQuizSession, missedQuestions, questionsFromCards, QuizAttempt, QuizSession, StudyQuiz } from '../utils/quizPractice'

const dateLabel = (date: string) => Number.isNaN(Date.parse(date)) ? date : new Date(date).toLocaleString()
const timeLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
type Handoff = { studyText?: string; sourceName?: string; category?: string; quizId?: string; startQuizId?:string }

export function QuizzesPage() {
  const cards = useStudyStore(state => state.cards)
  const location = useLocation(), navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<StudyQuiz[]>(() => readWorkspaceList<StudyQuiz>('psykie-quizzes').map(quiz => ({...quiz, questions: quiz.questions || questionsFromCards(cards, quiz.category, quiz.questionsCount)})))
  const [session, setSession] = useState<QuizSession | null>(() => {
    try { const saved = JSON.parse(workspaceStorage.getItem('psykie-quiz-session') || 'null'); return saved && quizzes.some(q => q.id === saved.quizId) && Array.isArray(saved.questions) && saved.questions.length && Array.isArray(saved.answers) ? saved : null } catch { return null }
  })
  const [result, setResult] = useState<QuizAttempt | null>(null), [reviewFilter, setReviewFilter] = useState('all')
  const [showAI, setShowAI] = useState(false), [handoff, setHandoff] = useState<Handoff>({})
  const [view, setView] = useState('mine'), [search, setSearch] = useState(''), [category, setCategory] = useState('all')
  const [showCards, setShowCards] = useState(false), [cardCategory, setCardCategory] = useState(cards[0]?.category || 'General Psychology')
  const [cardTitle, setCardTitle] = useState(''), [cardCount, setCardCount] = useState(10), [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())
  const [showPractice,setShowPractice] = useState(true)
  const [confirmFinish,setConfirmFinish] = useState(false)
  const finishedSession = useRef('')
  const practiceRef = useRef<HTMLElement>(null), scrollToPractice = useRef(false)
  const quiz = quizzes.find(item => item.id === session?.quizId)
  const question = session?.questions[session.index]
  const chosen = session?.answers[session.index] ?? null
  const studyMode = session?.mode==='study'
  const checked = studyMode&&!!session?.checkedAnswers?.includes(session.index)
  const expired = !!session?.expiredQuestions?.includes(session.index)
  const activeDeadline=session?.deadline || (!checked&&!expired?session?.questionDeadline:null)
  const filtered = quizzes.filter(item => (category === 'all' || item.category === category) && (item.title + ' ' + item.category + ' ' + (item.sourceName || '')).toLowerCase().includes(search.toLowerCase()))
  const attempts = quizzes.flatMap(item => item.attempts || []).sort((a,b) => b.date.localeCompare(a.date))
  const legacyResults = quizzes.filter(item => item.lastAttempt && !item.attempts?.length)
  const finish = useCallback((timedOut = false) => {
    if (!session || !quiz || finishedSession.current === session.id) return
    finishedSession.current = session.id
    const attempt = completeQuizSession(quiz, session, timedOut)
    setQuizzes(previous => previous.map(item => item.id === quiz.id ? {...item, attempts: [attempt, ...(item.attempts || [])].slice(0,30), lastAttempt: {score:attempt.score,percentage:attempt.percentage,date:attempt.date}} : item))
    scrollToPractice.current = true
    setConfirmFinish(false); setShowPractice(true); setResult(attempt); setReviewFilter('all'); setSession(null)
  }, [session, quiz])
  useEffect(() => { workspaceStorage.setItem('psykie-quizzes', JSON.stringify(quizzes)) }, [quizzes])
  useEffect(() => { if (session) workspaceStorage.setItem('psykie-quiz-session', JSON.stringify(session)); else workspaceStorage.removeItem('psykie-quiz-session') }, [session])
  useEffect(() => {
    if (!activeDeadline) return
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(timer)
  }, [activeDeadline])
  useEffect(()=>{
    if(session?.deadline&&now>=session.deadline){finish(true);return}
    if(session?.questionDeadline&&now>=session.questionDeadline&&!checked&&!expired)setSession({...session,expiredQuestions:[...(session.expiredQuestions||[]),session.index],checkedAnswers:studyMode?[...(session.checkedAnswers||[]),session.index]:session.checkedAnswers})
  },[now,session,checked,expired,studyMode,finish])
  useEffect(() => {
    const state = location.state as Handoff | null
    if(state?.startQuizId){const item=quizzes.find(quiz=>quiz.id===state.startQuizId);if(item){setShowPractice(true);setResult(null);setSession(createQuizSession(item))}navigate(location.pathname,{replace:true,state:null});return}
    if (state?.quizId) { const item=quizzes.find(quiz=>quiz.id===state.quizId); if(item){setShowPractice(false);setCategory('all');setSearch(item.title);setView('mine')} navigate(location.pathname,{replace:true,state:null}); return }
    if (!state?.studyText) return
    setHandoff(state); setShowAI(true)
    navigate(location.pathname, {replace:true, state:null})
  }, [location.state, location.pathname, navigate, quizzes])
  useEffect(() => {
    if (!scrollToPractice.current) return
    scrollToPractice.current = false
    if (window.innerWidth <= 1100) requestAnimationFrame(() => practiceRef.current?.scrollIntoView({block:'start',behavior:'instant'}))
  }, [session?.id, result?.id])
  const begin = (item: StudyQuiz, subset = item.questions) => {
    if (!subset.length) return
    setShowPractice(true)
    scrollToPractice.current = true
    setNow(Date.now()); setResult(null); setReviewFilter('all'); setSession(createQuizSession(item, subset))
  }
  const openGenerator = () => { setHandoff({}); setShowAI(true) }
  const removeQuiz = (id: string) => { setQuizzes(previous => previous.filter(item => item.id !== id)); if (session?.quizId === id) setSession(null); if (result?.quizId === id) setResult(null) }
  const exportReview = () => {
    if (!result) return
    const lines = [result.title, `${result.score}/${result.questions.length} (${result.percentage}%)`, dateLabel(result.date), ...result.questions.map((item,index) => `\n${index + 1}. ${plainText(item.question)}\nYour answer: ${item.options[result.answers[index] ?? -1] || 'Unanswered'}\nCorrect answer: ${plainText(item.options[item.correct])}\nExplanation: ${plainText(item.explanation)}`)]
    void downloadWord(result.title+' - quiz review',lines.slice(1).join('\n')).catch(()=>window.alert('Word download failed. Please try again.'))
  }
  const createFromCards = (event: React.FormEvent) => {
    event.preventDefault()
    const questions = questionsFromCards(cards, cardCategory, cardCount)
    if (!questions.length) { setError('Add at least two flashcards with different answers in this subject first.'); return }
    const item: StudyQuiz = {id:'quiz-'+crypto.randomUUID(),title:cardTitle.trim() || cardCategory+' practice',category:cardCategory,difficulty:'medium',questionsCount:questions.length,passingScore:70,questions,createdAt:new Date().toISOString(),sourceName:'Your flashcards',mode:'study'}
    setQuizzes(previous => [item,...previous]); setShowCards(false); setError(''); setCategory('all'); setSearch(''); setView('mine'); begin(item)
  }
  return <div className="reference-page ref-quizzes-page" data-focused-reader={!!(showPractice&&(session||result))}>
    <ReferenceHeader title="Quizzes" subtitle="Create practice from your readings, notes, or a psychology topic." action={showPractice&&(session||result)?undefined:"Create quiz"} onAction={openGenerator}/>
    {!(showPractice&&(session||result))&&<div className="quiz-browser-actions"><button className="ref-secondary" onClick={()=>{setError('');setShowCards(true)}}><Brain size={18}/>Practice from flashcards</button></div>}
    {!showPractice&&session&&<div className="quiz-resume ref-panel"><div><strong>{quiz?.title}</strong><p>Question {session.index+1} of {session.questions.length}. Your answers are saved.</p></div><button className="ref-primary" onClick={()=>{setShowPractice(true);setResult(null)}}>Resume quiz<ArrowRight size={16}/></button></div>}
    <div className="ref-quiz-layout" data-view={showPractice&&(session||result)?'practice':'browse'}>
      {!(showPractice&&(session||result))&&<section className="ref-quiz-browser">
        <div className="ref-panel ref-quiz-list">
          {!!quizzes.length&&<><div className="ref-collection-toolbar"><ReferenceTabs items={[{id:'mine',label:'My quizzes'},{id:'results',label:'Quiz history'}]} value={view} onChange={setView}/><select aria-label="Quiz subject" value={category} onChange={e => setCategory(e.target.value)}><option value="all">All subjects</option>{[...new Set(quizzes.map(item => item.category))].map(name => <option key={name}>{name}</option>)}</select></div>
          <ReferenceSearch value={search} onChange={setSearch} placeholder="Find a quiz or source..."/></>}
          {view !== 'results' && <div className="ref-quiz-rows">{filtered.map((item,index) => <article key={item.id} className="ref-quiz-row"><span className={'ref-icon tint-'+index%4}>{index%2 ? <BookOpen size={27}/> : <Brain size={27}/>}</span><div><h3>{plainText(item.title)}</h3><p>{item.questions.length} questions | {item.difficulty}{item.timerMinutes ? ` | ${item.timerMinutes} min` : ' | Untimed'}</p>{item.sourceName && <small className="study-source">{item.sourceName}</small>}</div><span className="ref-tag tint-2">{item.category}</span><button className="ref-primary" onClick={() => begin(item)} disabled={!item.questions.length}>Start quiz</button><details className="ref-item-menu"><summary aria-label={'Options for '+item.title}>...</summary><button onClick={() => removeQuiz(item.id)}>Delete quiz</button></details></article>)}{!filtered.length && <ReferenceStart icon={<Brain size={28}/>} title={quizzes.length?'No quizzes match this view':'Turn understanding into practice'} action={quizzes.length?'Reset quiz filters':'Build your first quiz'} onAction={()=>{if(quizzes.length){setSearch('');setCategory('all')}else openGenerator()}}>{quizzes.length?'Clear your search or choose another subject.':'Choose your topic, upload a reading, or use a saved note. Review the questions before you start.'}</ReferenceStart>}</div>}
        </div>
        {view==='results'&&<section className="ref-panel ref-results"><div className="ref-panel-title"><h2>Quiz history</h2></div><div className="ref-results-table"><div className="ref-results-heading"><span>Quiz</span><span>Subject</span><span>Score</span><span>Date</span></div>{attempts.filter(item => (category === 'all' || item.category === category) && (item.title+' '+item.category).toLowerCase().includes(search.toLowerCase())).slice(0,view === 'results' ? undefined : 3).map(attempt => <button className="ref-result-row" key={attempt.id} onClick={() => {scrollToPractice.current=true;setShowPractice(true);setResult(attempt);setReviewFilter('all')}}><span>{plainText(attempt.title)}</span><span>{attempt.category}</span><span className="ref-score">{attempt.percentage}%</span><small>{dateLabel(attempt.date)}</small></button>)}{legacyResults.map(item => <div className="ref-result-row" key={item.id}><span>{plainText(item.title)}</span><span>{item.category}</span><span>{item.lastAttempt?.percentage}%</span><small>{dateLabel(item.lastAttempt!.date)}</small></div>)}</div>{!attempts.length && !legacyResults.length && <ReferenceEmpty>Completed attempts and answer reviews will appear here.</ReferenceEmpty>}</section>}
        <p className="ref-inline-notice">Study content and up to 30 attempts per quiz are saved in this browser for your account. AI practice is educational; board-style questions are not official exam items.</p>
      </section>}
      {showPractice&&(session||result)&&<section ref={practiceRef} className="ref-panel ref-question-panel study-practice-panel">
        <div className="workflow-back"><button className="ref-secondary" onClick={()=>setShowPractice(false)}><ArrowLeft size={16}/>Back to quizzes</button></div>
        {session && question && !result ? <>
          <div className="ref-question-heading"><div><h2>{quiz?.title}</h2><p>Question {session.index+1} of {session.questions.length}</p></div><div className="ref-question-progress"><span style={{width:session.answers.filter(answer => answer !== null).length/session.questions.length*100+'%'}}/></div><small>{Math.round(session.answers.filter(answer => answer !== null).length/session.questions.length*100)}%</small></div>
          <div className="study-session-meta"><span><Clock size={16}/>{expired?'Question time ended':session.questionSeconds&&checked?'Answer checked':activeDeadline?timeLabel(Math.max(0,Math.ceil((activeDeadline-now)/1000))):'Untimed'}{activeDeadline?(session.questionSeconds?' per question':' remaining'):''}</span><small>{studyMode?'Study mode - check each answer':'Exam mode - feedback at the end'}</small></div>
          <nav className="study-question-nav" aria-label="Quiz questions">{session.questions.map((_,index) => <button key={index} disabled={!!session.questionSeconds} aria-label={'Go to question '+(index+1)} aria-current={index===session.index ? 'step' : undefined} className={index===session.index ? 'current' : session.answers[index]!==null ? 'answered' : ''} onClick={() => setSession({...session,index})}>{index+1}{session.flagged.includes(index) && <Flag size={10} weight="fill"/>}</button>)}</nav>
          <h3 className="ref-question-text">{plainText(question.question)}</h3>
          <div className="ref-answer-options">{question.options.map((answer,index) => <label key={plainText(answer)} className={checked?(index===question.correct?'answer-correct':chosen===index?'answer-incorrect':''):chosen===index?'selected':''}><input type="radio" name="practice-answer" disabled={checked||expired} checked={chosen===index} onChange={() => setSession({...session,answers:session.answers.map((value,i) => i===session.index ? index : value)})}/><span className="quiz-choice-letter">{String.fromCharCode(65+index)}</span><span>{plainText(answer)}</span>{checked&&index===question.correct&&<CheckCircle size={20} aria-label="Correct answer"/>}</label>)}</div>
          {expired&&!checked&&<p role="status" className="ref-inline-notice">Time is up for this question. Continue to the next question when ready.</p>}
          {checked&&<section className={'quiz-answer-feedback '+(chosen===question.correct?'is-correct':'is-incorrect')} role="status"><strong>{chosen===question.correct?'You got it.':'Let us work through this.'}</strong><p><b>Correct answer:</b> {plainText(question.options[question.correct])}</p><p>{plainText(question.explanation || 'Review this concept in your original study material.')}</p></section>}
          <div className="study-actions"><button className="ref-secondary" aria-pressed={session.flagged.includes(session.index)} onClick={() => setSession({...session,flagged:session.flagged.includes(session.index) ? session.flagged.filter(index => index!==session.index) : [...session.flagged,session.index]})}><Flag size={18}/>{session.flagged.includes(session.index) ? 'Flagged' : 'Flag for review'}</button><button className="ref-secondary" disabled={session.index===0||!!session.questionSeconds} onClick={() => setSession({...session,index:session.index-1})}><ArrowLeft size={16}/>Previous</button>{studyMode&&!checked&&!expired?<button className="ref-primary" disabled={chosen===null} onClick={()=>setSession({...session,checkedAnswers:[...(session.checkedAnswers||[]),session.index]})}>Check answer<CheckCircle size={17}/></button>:<button className="ref-primary" disabled={chosen===null&&!expired} onClick={()=>session.index+1===session.questions.length?finish():setSession({...session,index:session.index+1,questionDeadline:session.questionSeconds?Date.now()+session.questionSeconds*1000:undefined})}>{session.index+1===session.questions.length?'See results':'Next question'}<ArrowRight size={16}/></button>}</div>
          <button className="ref-text-action study-finish" onClick={() => setConfirmFinish(true)}>Finish attempt ({session.answers.filter(answer => answer!==null).length}/{session.questions.length} answered)</button>
        </> : result ? <>
          <div className="ref-quiz-finished"><CheckCircle size={44} weight="duotone"/><h2>{plainText(result.title)}</h2><strong>{result.score} / {result.questions.length} ({result.percentage}%)</strong><p>{result.timedOut ? 'Time is up. Your answers have been saved.' : 'Practice complete. Review the explanations below.'} | {timeLabel(result.durationSeconds)}</p><div className="study-actions">{session && <button className="ref-primary" onClick={() => {scrollToPractice.current=true;setResult(null)}}>Resume current quiz</button>}<button className="ref-primary" onClick={() => {const item=quizzes.find(q => q.id===result.quizId);if(item)begin(item)}}>Practice again</button><button className="ref-secondary" disabled={!missedQuestions(result).length} onClick={() => {const item=quizzes.find(q => q.id===result.quizId);if(item)begin(item,missedQuestions(result))}}>Retry missed questions</button><button className="ref-secondary" onClick={exportReview}><DownloadSimple size={17}/>Download review (.docx)</button></div></div>
          <div className="quiz-result-metrics"><div><strong>{result.score}</strong><span>Correct</span></div><div><strong>{result.questions.filter((_,index)=>result.answers[index]!==null&&result.answers[index]!==undefined&&result.answers[index]!==result.questions[index].correct).length}</strong><span>To revisit</span></div><div><strong>{result.questions.filter((_,index)=>result.answers[index]===null||result.answers[index]===undefined).length}</strong><span>Unanswered</span></div></div>
          {!!missedQuestions(result).length&&<div className="quiz-next-step"><div><h3>Keep the difficult concepts close</h3><p>Turn the {missedQuestions(result).length} missed or unanswered questions into cards you can review.</p></div><button className="ref-secondary" onClick={()=>{const store=useStudyStore.getState(),id=store.createDeck(result.title+' - review',result.category);missedQuestions(result).forEach(question=>store.addCard(id,question.question,question.options[question.correct]+'\n\n'+(question.explanation||''),result.category));navigate('/flashcards',{state:{deckId:id}})}}>Make review flashcards</button></div>}
          <div className="study-answer-review"><h3>Review answers</h3><ReferenceTabs items={[{id:'all',label:'All answers'},{id:'missed',label:'Missed'},{id:'flagged',label:'Flagged'}]} value={reviewFilter} onChange={setReviewFilter}/>{result.questions.map((item,index) => ({item,index,correct:result.answers[index]===item.correct})).filter(({index,correct}) => reviewFilter==='all' || (reviewFilter==='missed' ? !correct : result.flagged.includes(index))).map(({item,index,correct}) => <article className={'study-review-item '+(correct ? 'correct' : 'incorrect')} key={index}><small>{correct ? 'Correct' : 'Needs review'}{result.flagged.includes(index) ? ' | Flagged' : ''}</small><h4>{index+1}. {plainText(item.question)}</h4><p><strong>Your answer:</strong> {plainText(item.options[result.answers[index]??-1] || 'Unanswered')}</p><p><strong>Correct answer:</strong> {plainText(item.options[item.correct])}</p><div><strong>Why this answer?</strong><p>{plainText(item.explanation || 'Review this concept in your source material.')}</p></div></article>)}{reviewFilter==='flagged' && !result.flagged.length && <ReferenceEmpty>No questions were flagged.</ReferenceEmpty>}{reviewFilter==='missed' && !missedQuestions(result).length && <ReferenceEmpty>You answered every question correctly.</ReferenceEmpty>}</div>
        </> : <ReferenceEmpty>Choose Start quiz to begin, or create a quiz from your own study material.</ReferenceEmpty>}
      </section>}
    </div>
    {confirmFinish&&session&&<ViewportOverlay onDismiss={()=>setConfirmFinish(false)}><section className="glass-modal ref-form-dialog"><h2>Finish this attempt?</h2><p>You have answered {session.answers.filter(answer=>answer!==null).length} of {session.questions.length} questions. Unanswered questions count as incorrect. Your result will be saved.</p><div className="study-actions"><button className="ref-secondary" onClick={()=>setConfirmFinish(false)}>Keep studying</button><button className="ref-primary" onClick={()=>finish()}>Submit attempt</button></div></section></ViewportOverlay>}
    {showCards && <ViewportOverlay onDismiss={() => setShowCards(false)}><form className="glass-modal ref-form-dialog" onSubmit={createFromCards}><div className="ref-panel-title"><h2>Practice from flashcards</h2><button type="button" aria-label="Close flashcard quiz setup" onClick={() => setShowCards(false)}><X size={20}/></button></div><p>Build a practice quiz from cards you have already saved. Questions are kept with the quiz even if you edit your cards later.</p><label>Quiz title<input value={cardTitle} onChange={e => setCardTitle(e.target.value)} maxLength={200}/></label><label>Flashcard subject<select value={cardCategory} onChange={e => setCardCategory(e.target.value)}>{[...new Set([cardCategory,...cards.map(card=>card.category)])].map(name=><option key={name}>{name}</option>)}</select></label><label>Number of questions<input type="number" min={1} max={30} value={cardCount} onChange={e => setCardCount(Number(e.target.value))}/></label>{error && <p role="alert" className="ref-form-error">{error}</p>}<button className="ref-primary" disabled={!Number.isInteger(cardCount)||cardCount<1||cardCount>30}>Create from flashcards</button></form></ViewportOverlay>}
    {showAI && <AIGenerator task="quiz" initialText={handoff.studyText || ''} initialSourceName={handoff.sourceName || ''} category={handoff.category || 'General Psychology'} onClose={() => setShowAI(false)} onSave={(draft,settings) => {
      const item: StudyQuiz = {id:'quiz-'+crypto.randomUUID(),title:draft.title,category:settings.category,difficulty:settings.quizOptions.difficulty,mode:settings.mode,questionSeconds:settings.questionSeconds,style:settings.quizOptions.style,timerMinutes:settings.timerMinutes,sourceName:settings.sourceName,questionsCount:draft.questions.length,passingScore:70,createdAt:new Date().toISOString(),questions:draft.questions}
      setQuizzes(previous=>[item,...previous]);setShowAI(false);setView('mine');setCategory('all');setSearch('');begin(item)
    }}/>}
  </div>
}
