import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Brain, CheckCircle, Clock, DownloadSimple, Flag, X } from '@phosphor-icons/react'
import { AIGenerator } from '../components/AIGenerator'
import { ReferenceEmpty, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useStudyStore } from '../store'
import { readWorkspaceList, workspaceStorage } from '../utils/workspaceStorage'
import { completeQuizSession, createQuizSession, missedQuestions, questionsFromCards, QuizAttempt, QuizSession, StudyQuiz } from '../utils/quizPractice'

const dateLabel = (date: string) => Number.isNaN(Date.parse(date)) ? date : new Date(date).toLocaleString()
const timeLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
type Handoff = { studyText?: string; sourceName?: string; category?: string }

export function QuizzesPage() {
  const cards = useStudyStore(state => state.cards)
  const location = useLocation(), navigate = useNavigate()
  const [quizzes, setQuizzes] = useState<StudyQuiz[]>(() => readWorkspaceList<StudyQuiz>('psykie-quizzes').map(quiz => ({...quiz, questions: quiz.questions || questionsFromCards(cards, quiz.category, quiz.questionsCount)})))
  const [session, setSession] = useState<QuizSession | null>(() => {
    try { const saved = JSON.parse(workspaceStorage.getItem('psykie-quiz-session') || 'null'); return saved && quizzes.some(q => q.id === saved.quizId) && Array.isArray(saved.questions) && saved.questions.length && Array.isArray(saved.answers) ? saved : null } catch { return null }
  })
  const [result, setResult] = useState<QuizAttempt | null>(null), [reviewFilter, setReviewFilter] = useState('all')
  const [showAI, setShowAI] = useState(false), [handoff, setHandoff] = useState<Handoff>({})
  const [view, setView] = useState('practice'), [search, setSearch] = useState(''), [category, setCategory] = useState('all')
  const [showCards, setShowCards] = useState(false), [cardCategory, setCardCategory] = useState(cards[0]?.category || 'General Psychology')
  const [cardTitle, setCardTitle] = useState(''), [cardCount, setCardCount] = useState(10), [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())
  const finishedSession = useRef('')
  const practiceRef = useRef<HTMLElement>(null), scrollToPractice = useRef(false)
  const quiz = quizzes.find(item => item.id === session?.quizId)
  const question = session?.questions[session.index]
  const chosen = session?.answers[session.index] ?? null
  const filtered = quizzes.filter(item => (category === 'all' || item.category === category) && (item.title + ' ' + item.category + ' ' + (item.sourceName || '')).toLowerCase().includes(search.toLowerCase()))
  const attempts = quizzes.flatMap(item => item.attempts || []).sort((a,b) => b.date.localeCompare(a.date))
  const legacyResults = quizzes.filter(item => item.lastAttempt && !item.attempts?.length)
  const finish = useCallback((timedOut = false) => {
    if (!session || !quiz || finishedSession.current === session.id) return
    finishedSession.current = session.id
    const attempt = completeQuizSession(quiz, session, timedOut)
    setQuizzes(previous => previous.map(item => item.id === quiz.id ? {...item, attempts: [attempt, ...(item.attempts || [])].slice(0,30), lastAttempt: {score:attempt.score,percentage:attempt.percentage,date:attempt.date}} : item))
    scrollToPractice.current = true
    setResult(attempt); setReviewFilter('all'); setSession(null)
  }, [session, quiz])
  useEffect(() => { workspaceStorage.setItem('psykie-quizzes', JSON.stringify(quizzes)) }, [quizzes])
  useEffect(() => { if (session) workspaceStorage.setItem('psykie-quiz-session', JSON.stringify(session)); else workspaceStorage.removeItem('psykie-quiz-session') }, [session])
  useEffect(() => {
    if (!session?.deadline) return
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(timer)
  }, [session?.deadline])
  useEffect(() => { if (session?.deadline && now >= session.deadline) finish(true) }, [now, session?.deadline, finish])
  useEffect(() => {
    const state = location.state as Handoff | null
    if (!state?.studyText) return
    setHandoff(state); setShowAI(true)
    navigate(location.pathname, {replace:true, state:null})
  }, [location.state, location.pathname, navigate])
  useEffect(() => {
    if (!scrollToPractice.current) return
    scrollToPractice.current = false
    if (window.innerWidth <= 1100) requestAnimationFrame(() => practiceRef.current?.scrollIntoView({block:'start',behavior:'instant'}))
  }, [session?.id, result?.id])
  const begin = (item: StudyQuiz, subset = item.questions) => {
    if (!subset.length) return
    scrollToPractice.current = true
    setNow(Date.now()); setResult(null); setReviewFilter('all'); setSession(createQuizSession(item, subset))
  }
  const openGenerator = () => { setHandoff({}); setShowAI(true) }
  const removeQuiz = (id: string) => { setQuizzes(previous => previous.filter(item => item.id !== id)); if (session?.quizId === id) setSession(null); if (result?.quizId === id) setResult(null) }
  const exportReview = () => {
    if (!result) return
    const lines = [result.title, `${result.score}/${result.questions.length} (${result.percentage}%)`, dateLabel(result.date), ...result.questions.map((item,index) => `\n${index + 1}. ${item.question}\nYour answer: ${item.options[result.answers[index] ?? -1] || 'Unanswered'}\nCorrect answer: ${item.options[item.correct]}\nExplanation: ${item.explanation}`)]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'})), link = document.createElement('a')
    link.href = url; link.download = 'psykie-quiz-review.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const createFromCards = (event: React.FormEvent) => {
    event.preventDefault()
    const questions = questionsFromCards(cards, cardCategory, cardCount)
    if (!questions.length) { setError('Add at least two flashcards with different answers in this subject first.'); return }
    const item: StudyQuiz = {id:'quiz-'+crypto.randomUUID(),title:cardTitle.trim() || cardCategory+' practice',category:cardCategory,difficulty:'medium',questionsCount:questions.length,passingScore:70,questions,createdAt:new Date().toISOString(),sourceName:'Your flashcards'}
    setQuizzes(previous => [item,...previous]); setShowCards(false); setError(''); setCategory('all'); setSearch(''); setView('mine'); begin(item)
  }
  return <div className="reference-page ref-quizzes-page">
    <ReferenceHeader title="Put your knowledge into practice." subtitle="Turn your psychology notes and reading into practice, then learn from every answer." action="Create quiz" onAction={openGenerator}/>
    <div className="study-quiz-intro ref-panel"><div><strong>Your material. Your practice.</strong><p>Upload a reading, choose a saved note, or type a topic. Build psychology questions at your level.</p></div><div className="study-actions"><button className="ref-primary" onClick={openGenerator}>Generate quiz with AI</button><button className="ref-secondary" onClick={() => {setError('');setShowCards(true)}}>Practice from flashcards</button></div></div>
    <div className="ref-quiz-layout">
      <section className="ref-quiz-browser">
        <div className="ref-panel ref-quiz-list">
          <div className="ref-collection-toolbar"><ReferenceTabs items={[{id:'practice',label:'Practice'},{id:'mine',label:'My quizzes'},{id:'results',label:'Results'}]} value={view} onChange={setView}/><select aria-label="Quiz subject" value={category} onChange={e => setCategory(e.target.value)}><option value="all">All subjects</option>{[...new Set(quizzes.map(item => item.category))].map(name => <option key={name}>{name}</option>)}</select></div>
          <ReferenceSearch value={search} onChange={setSearch} placeholder="Find a quiz or source..."/>
          {view !== 'results' && <div className="ref-quiz-rows">{filtered.map((item,index) => <article key={item.id} className="ref-quiz-row"><span className={'ref-icon tint-'+index%4}>{index%2 ? <BookOpen size={27}/> : <Brain size={27}/>}</span><div><h3>{item.title}</h3><p>{item.questions.length} questions | {item.difficulty}{item.timerMinutes ? ` | ${item.timerMinutes} min` : ' | Untimed'}</p>{item.sourceName && <small className="study-source">{item.sourceName}</small>}</div><span className="ref-tag tint-2">{item.category}</span><button className="ref-primary" onClick={() => begin(item)} disabled={!item.questions.length}>Start quiz</button><details className="ref-item-menu"><summary aria-label={'Options for '+item.title}>...</summary><button onClick={() => removeQuiz(item.id)}>Delete quiz</button></details></article>)}{!filtered.length && <ReferenceEmpty>No quizzes yet. Create one from a topic, note, or uploaded file.</ReferenceEmpty>}</div>}
        </div>
        <section className="ref-panel ref-results"><div className="ref-panel-title"><h2>Recent results</h2><button className="ref-text-action" onClick={() => setView('results')}>View all results<ArrowRight size={15}/></button></div><div className="ref-results-table"><div className="ref-results-heading"><span>Quiz</span><span>Subject</span><span>Score</span><span>Date</span></div>{attempts.filter(item => (category === 'all' || item.category === category) && (item.title+' '+item.category).toLowerCase().includes(search.toLowerCase())).slice(0,view === 'results' ? undefined : 3).map(attempt => <button className="ref-result-row" key={attempt.id} onClick={() => {scrollToPractice.current=true;setResult(attempt);setReviewFilter('all')}}><span>{attempt.title}</span><span>{attempt.category}</span><span className="ref-score">{attempt.percentage}%</span><small>{dateLabel(attempt.date)}</small></button>)}{legacyResults.map(item => <div className="ref-result-row" key={item.id}><span>{item.title}</span><span>{item.category}</span><span>{item.lastAttempt?.percentage}%</span><small>{dateLabel(item.lastAttempt!.date)}</small></div>)}</div>{!attempts.length && !legacyResults.length && <ReferenceEmpty>Completed attempts and answer reviews will appear here.</ReferenceEmpty>}</section>
        <p className="ref-inline-notice">Study content and up to 30 attempts per quiz are saved in this browser for your account. AI practice is educational; board-style questions are not official exam items.</p>
      </section>
      <section ref={practiceRef} className="ref-panel ref-question-panel study-practice-panel">
        {session && question && !result ? <>
          <div className="ref-question-heading"><div><h2>{quiz?.title}</h2><p>Question {session.index+1} of {session.questions.length}</p></div><div className="ref-question-progress"><span style={{width:session.answers.filter(answer => answer !== null).length/session.questions.length*100+'%'}}/></div><small>{Math.round(session.answers.filter(answer => answer !== null).length/session.questions.length*100)}%</small></div>
          <div className="study-session-meta"><span><Clock size={16}/>{session.deadline ? timeLabel(Math.max(0,Math.ceil((session.deadline-now)/1000))) : 'Untimed'}{session.deadline ? ' remaining' : ''}</span><small>Progress saved automatically</small></div>
          <nav className="study-question-nav" aria-label="Quiz questions">{session.questions.map((_,index) => <button key={index} aria-label={'Go to question '+(index+1)} aria-current={index===session.index ? 'step' : undefined} className={index===session.index ? 'current' : session.answers[index]!==null ? 'answered' : ''} onClick={() => setSession({...session,index})}>{index+1}{session.flagged.includes(index) && <Flag size={10} weight="fill"/>}</button>)}</nav>
          <h3 className="ref-question-text">{question.question}</h3>
          <div className="ref-answer-options">{question.options.map((answer,index) => <label key={answer} className={chosen===index ? 'selected' : ''}><input type="radio" name="practice-answer" checked={chosen===index} onChange={() => setSession({...session,answers:session.answers.map((value,i) => i===session.index ? index : value)})}/><span>{answer}</span></label>)}</div>
          <div className="study-actions"><button className="ref-secondary" aria-pressed={session.flagged.includes(session.index)} onClick={() => setSession({...session,flagged:session.flagged.includes(session.index) ? session.flagged.filter(index => index!==session.index) : [...session.flagged,session.index]})}><Flag size={18}/>{session.flagged.includes(session.index) ? 'Flagged' : 'Flag for review'}</button><button className="ref-secondary" disabled={session.index===0} onClick={() => setSession({...session,index:session.index-1})}><ArrowLeft size={16}/>Previous</button><button className="ref-primary" disabled={chosen===null} onClick={() => session.index+1===session.questions.length ? finish() : setSession({...session,index:session.index+1})}>{session.index+1===session.questions.length ? 'See results' : 'Next question'}<ArrowRight size={16}/></button></div>
          <button className="ref-text-action study-finish" onClick={() => finish()}>Finish attempt ({session.answers.filter(answer => answer!==null).length}/{session.questions.length} answered)</button>
        </> : result ? <>
          <div className="ref-quiz-finished"><CheckCircle size={44} weight="duotone"/><h2>{result.title}</h2><strong>{result.score} / {result.questions.length} ({result.percentage}%)</strong><p>{result.timedOut ? 'Time is up. Your answers have been saved.' : 'Practice complete. Review the explanations below.'} | {timeLabel(result.durationSeconds)}</p><div className="study-actions">{session && <button className="ref-primary" onClick={() => {scrollToPractice.current=true;setResult(null)}}>Resume current quiz</button>}<button className="ref-primary" onClick={() => {const item=quizzes.find(q => q.id===result.quizId);if(item)begin(item)}}>Practice again</button><button className="ref-secondary" disabled={!missedQuestions(result).length} onClick={() => {const item=quizzes.find(q => q.id===result.quizId);if(item)begin(item,missedQuestions(result))}}>Retry missed questions</button><button className="ref-secondary" onClick={exportReview}><DownloadSimple size={17}/>Download review</button></div></div>
          <div className="study-answer-review"><h3>Review answers</h3><ReferenceTabs items={[{id:'all',label:'All answers'},{id:'missed',label:'Missed'},{id:'flagged',label:'Flagged'}]} value={reviewFilter} onChange={setReviewFilter}/>{result.questions.map((item,index) => ({item,index,correct:result.answers[index]===item.correct})).filter(({index,correct}) => reviewFilter==='all' || (reviewFilter==='missed' ? !correct : result.flagged.includes(index))).map(({item,index,correct}) => <article className={'study-review-item '+(correct ? 'correct' : 'incorrect')} key={index}><small>{correct ? 'Correct' : 'Needs review'}{result.flagged.includes(index) ? ' | Flagged' : ''}</small><h4>{index+1}. {item.question}</h4><p><strong>Your answer:</strong> {item.options[result.answers[index]??-1] || 'Unanswered'}</p><p><strong>Correct answer:</strong> {item.options[item.correct]}</p><div><strong>Why this answer?</strong><p>{item.explanation || 'Review this concept in your source material.'}</p></div></article>)}{reviewFilter==='flagged' && !result.flagged.length && <ReferenceEmpty>No questions were flagged.</ReferenceEmpty>}{reviewFilter==='missed' && !missedQuestions(result).length && <ReferenceEmpty>You answered every question correctly.</ReferenceEmpty>}</div>
        </> : <ReferenceEmpty>Choose Start quiz to begin, or create a quiz from your own study material.</ReferenceEmpty>}
      </section>
    </div>
    {showCards && <ViewportOverlay onDismiss={() => setShowCards(false)}><form className="glass-modal ref-form-dialog" onSubmit={createFromCards}><div className="ref-panel-title"><h2>Practice from flashcards</h2><button type="button" aria-label="Close flashcard quiz setup" onClick={() => setShowCards(false)}><X size={20}/></button></div><p>Build a practice quiz from cards you have already saved. Questions are kept with the quiz even if you edit your cards later.</p><label>Quiz title<input value={cardTitle} onChange={e => setCardTitle(e.target.value)} maxLength={200}/></label><label>Flashcard subject<select value={cardCategory} onChange={e => setCardCategory(e.target.value)}>{[...new Set([cardCategory,...cards.map(card=>card.category)])].map(name=><option key={name}>{name}</option>)}</select></label><label>Number of questions<input type="number" min={1} max={30} value={cardCount} onChange={e => setCardCount(Number(e.target.value))}/></label>{error && <p role="alert" className="ref-form-error">{error}</p>}<button className="ref-primary" disabled={!Number.isInteger(cardCount)||cardCount<1||cardCount>30}>Create from flashcards</button></form></ViewportOverlay>}
    {showAI && <AIGenerator task="quiz" initialText={handoff.studyText || ''} initialSourceName={handoff.sourceName || ''} category={handoff.category || 'General Psychology'} onClose={() => setShowAI(false)} onSave={(draft,settings) => {
      const item: StudyQuiz = {id:'quiz-'+crypto.randomUUID(),title:draft.title,category:settings.category,difficulty:settings.quizOptions.difficulty,style:settings.quizOptions.style,timerMinutes:settings.timerMinutes,sourceName:settings.sourceName,questionsCount:draft.questions.length,passingScore:70,createdAt:new Date().toISOString(),questions:draft.questions}
      setQuizzes(previous=>[item,...previous]);setShowAI(false);setView('mine');setCategory('all');setSearch('');begin(item)
    }}/>}
  </div>
}
