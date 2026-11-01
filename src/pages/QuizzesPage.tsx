import { AIGenerator } from '../components/AIGenerator'
import { AIQuestion } from '../utils/ai'
import { readWorkspaceList } from '../utils/workspaceStorage'
import { workspaceStorage } from '../utils/workspaceStorage'
import { useStudyStore } from '../store'
import { ArrowRight, BookOpen, Brain, CheckCircle, Flag, X } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ReferenceEmpty, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'


export function QuizzesPage() {
  const cards = useStudyStore(state => state.cards)
  const [showAI, setShowAI] = useState(false)
  const [creationError, setCreationError] = useState('')
  const buildQuestions = (category: string, count: number) => {
    const source = cards.filter(card => card.category.toLowerCase() === category.toLowerCase())
    return source.filter(card => source.some(other => other.answer !== card.answer)).slice(0, count).map(card => {
      const answers = [card.answer, ...source.filter(other => other.answer !== card.answer).map(other => other.answer)]
      const options = [...new Set(answers)].slice(0, 4).sort((a, b) => a.localeCompare(b))
      return { id: card.id, category: card.category, question: card.question, options, correct: options.indexOf(card.answer) }
    })
  }
  const [quizzes, setQuizzes] = useState<{
    id: string
    title: string
    category: string
    difficulty: 'easy' | 'medium' | 'hard' | 'board'
    questionsCount: number
    passingScore: number
    questions?: AIQuestion[]
    createdAt: string
    lastAttempt?: { score: number; percentage: number; date: string }
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>('5')
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    category: 'General Psychology',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'board',
    questionsCount: 10,
    passingScore: 70
  })

  const categories = [
    'All',
    'General Psychology',
    'Cognitive Psychology',
    'Developmental Psychology',
    'Abnormal Psychology',
    'Social Psychology',
    'Biological Psychology',
    'Research Methods',
    'Statistics',
    'Board Exam',
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'bg-emerald-100', text: 'text-emerald-700' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-100', text: 'text-amber-700' },
    { value: 'hard', label: 'Hard', color: 'bg-rose-100', text: 'text-rose-700' },
    { value: 'board', label: 'Board Exam', color: 'bg-pink-100', text: 'text-pink-700' },
  ]

  useEffect(() => {
    setQuizzes(readWorkspaceList('psykie-quizzes'))
    setIsLoading(false)
  }, [])
  const filteredQuizzes = quizzes.filter(quiz => (quiz.title + ' ' + quiz.category).toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCategory === 'all' || quiz.category.toLowerCase() === selectedCategory))
  const handleCreateQuiz = (e: React.FormEvent) => { e.preventDefault(); if (!newQuiz.title.trim()) return; const count = buildQuestions(newQuiz.category, newQuiz.questionsCount).length; if (!count) { setCreationError('Add at least two flashcards with different answers in this category first.'); return } setCreationError(''); setQuizzes(previous => [{ ...newQuiz, questionsCount: count, id: 'quiz-' + Date.now(), createdAt: 'Just now' }, ...previous]); setShowCreateModal(false); setNewQuiz({ title: '', category: 'General Psychology', difficulty: 'medium', questionsCount: 10, passingScore: 70 }) }
  const deleteQuiz = (id: string) => setQuizzes(previous => previous.filter(quiz => quiz.id !== id))
  const [view, setView] = useState('practice')
  const [showAllQuizzes, setShowAllQuizzes] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [flagged, setFlagged] = useState<string[]>([])
  const quiz = quizzes.find(item => item.id === selectedQuiz) || filteredQuizzes[0]
  const questions = quiz?.questions?.map((question, index) => ({ ...question, id: quiz.id + '-' + index })) || (quiz ? buildQuestions(quiz.category, quiz.questionsCount) : [])
  const question = questions[questionIndex % Math.max(1, questions.length)]
  const options = question?.options || []
  const correctIndex = question?.correct ?? 0
  const begin = (id: string) => { setSelectedQuiz(id); setQuestionIndex(0); setChosenAnswer(null); setScore(0); setFinished(false) }
  const next = () => { if (chosenAnswer === null || !question) return; const updated = score + (chosenAnswer === correctIndex ? 1 : 0); setScore(updated); setChosenAnswer(null); if (questionIndex + 1 >= questions.length) { setFinished(true); setQuizzes(previous => previous.map(item => item.id === quiz?.id ? { ...item, lastAttempt: { score: updated, percentage: Math.round(updated / questions.length * 100), date: 'Just now' } } : item)) } else setQuestionIndex(value => value + 1) }
  useEffect(() => { if (!isLoading) workspaceStorage.setItem('psykie-quizzes', JSON.stringify(quizzes)) }, [quizzes, isLoading])
  return (
    <div className="reference-page ref-quizzes-page">
      <ReferenceHeader title="Put your knowledge into practice." subtitle="Choose a quiz, test yourself, and see your progress." action="Create quiz" onAction={() => setShowCreateModal(true)} />
      <div className="ref-quiz-layout">
        <section className="ref-quiz-browser"><div className="ref-panel ref-quiz-list"><div className="ref-collection-toolbar"><ReferenceTabs items={[{ id: 'practice', label: 'Practice' }, { id: 'mine', label: 'My quizzes' }, { id: 'results', label: 'Results' }]} value={view} onChange={setView} /><select aria-label="Quiz subject" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>{categories.map(category => <option key={category} value={category.toLowerCase()}>{category === 'All' ? 'All subjects' : category}</option>)}</select></div><ReferenceSearch value={searchQuery} onChange={setSearchQuery} placeholder="Find a quiz…" />{view !== 'results' && <div className="ref-quiz-rows">{filteredQuizzes.filter(item => view !== 'mine' || item.id.startsWith('quiz-')).slice(0, showAllQuizzes || view === 'mine' ? undefined : 3).map((item, index) => <article key={item.id} className="ref-quiz-row"><span className={'ref-icon tint-' + index % 4}>{index % 2 ? <BookOpen size={27} /> : <Brain size={27} />}</span><div><h3>{item.title}</h3><p>{(item.questions?.length || buildQuestions(item.category, item.questionsCount).length)} study questions · {item.difficulty}</p></div><span className="ref-tag tint-2">{item.category}</span><button className="ref-primary" onClick={() => begin(item.id)}>Start quiz</button><details className="ref-item-menu"><summary aria-label={'Options for ' + item.title}>···</summary><button onClick={() => deleteQuiz(item.id)}>Delete quiz</button></details></article>)}{view === 'practice' && filteredQuizzes.length > 3 && <button className="ref-text-action ref-see-all" onClick={() => setShowAllQuizzes(!showAllQuizzes)}>{showAllQuizzes ? 'Show less' : 'View all ' + filteredQuizzes.length + ' quizzes'}</button>}{!filteredQuizzes.length && <ReferenceEmpty>No quizzes match this subject.</ReferenceEmpty>}{view === 'mine' && !filteredQuizzes.some(item => item.id.startsWith('quiz-')) && <ReferenceEmpty>Create a quiz to make practice your own.</ReferenceEmpty>}</div>}</div><section className="ref-panel ref-results"><div className="ref-panel-title"><h2>Recent results</h2><button className="ref-text-action" onClick={() => setView('results')}>View all results<ArrowRight size={15} /></button></div><div className="ref-results-table"><div className="ref-results-heading"><span>Quiz</span><span>Subject</span><span>Score</span><span>Date</span></div>{quizzes.filter(item => item.lastAttempt).slice(0, view === 'results' ? undefined : 3).map(item => <button className="ref-result-row" key={item.id} onClick={() => begin(item.id)}><span>{item.title}</span><span>{item.category}</span><span className="ref-score">{item.lastAttempt?.percentage}%</span><small>{item.lastAttempt?.date}</small></button>)}</div></section><div className="ref-quiz-tools"><button className="ref-secondary" onClick={() => setShowAI(true)}>Generate quiz with AI</button><span>Practice at your own pace. Every attempt helps.</span></div></section>
        <section className="ref-panel ref-question-panel">{question ? <><div className="ref-question-heading"><div><h2>{quiz?.title || 'Practice psychology'}</h2><p>{finished ? 'Practice complete' : 'Question ' + (questionIndex + 1) + ' of ' + questions.length}</p></div><div className="ref-question-progress"><span style={{ width: (finished ? 100 : questionIndex / questions.length * 100) + '%' }} /></div><small>{finished ? '100' : Math.round(questionIndex / questions.length * 100)}%</small></div>{finished ? <div className="ref-quiz-finished"><CheckCircle size={50} weight="duotone" /><h2>A little more confident.</h2><strong>{score} / {questions.length}</strong><p>You have completed this practice session.</p><button className="ref-primary" onClick={() => begin(quiz?.id || '')}>Practice again</button></div> : <><h3 className="ref-question-text">{question.question}</h3><div className="ref-answer-options">{options.map((answer, index) => <label key={answer} className={chosenAnswer === index ? 'selected' : ''}><input type="radio" name="practice-answer" checked={chosenAnswer === index} onChange={() => setChosenAnswer(index)} /><span>{answer}</span></label>)}</div><div className="ref-question-footer"><button className="ref-secondary" aria-pressed={flagged.includes(question.id)} onClick={() => setFlagged(previous => previous.includes(question.id) ? previous.filter(id => id !== question.id) : [...previous, question.id])}><Flag size={18} />{flagged.includes(question.id) ? 'Flagged' : 'Flag for review'}</button><button className="ref-primary" disabled={chosenAnswer === null} onClick={next}>{questionIndex + 1 === questions.length ? 'See results' : 'Next question'}<ArrowRight size={18} /></button></div></>}</> : <ReferenceEmpty>{isLoading ? 'Preparing your practice space…' : 'Add flashcards to build your practice question bank.'}</ReferenceEmpty>}</section>
      </div>
      <AnimatePresence>
        {showCreateModal && (
          <ViewportOverlay onDismiss={() => setShowCreateModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-[99999] p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-modal quiz-create-dialog"
            >
              <motion.div
                className="quiz-dialog-heading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.h2
                  id="create-quiz-heading" className="quiz-dialog-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Create New Quiz
                </motion.h2>
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  className="quiz-dialog-close" aria-label="Close create quiz"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              </motion.div>

              <form onSubmit={handleCreateQuiz} className="quiz-create-form"><p className="ref-inline-notice">Practice uses your own flashcards. Add at least two distinct answers in the selected category. The quiz uses up to the requested number of available cards.</p>{creationError && <p role="alert" className="ref-form-error">{creationError}</p>}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label htmlFor="quiz-title" className="block text-sm font-medium text-slate-700 mb-2">
                    Quiz Title
                  </label>
                  <input id="quiz-title" required
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="e.g., Cognitive Psychology Basics"
                    className="input-solid"
                    autoFocus
                  />
                </motion.div>

                <motion.div
                  className="quiz-form-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div>
                    <label htmlFor="quiz-category" className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select id="quiz-category"
                      value={newQuiz.category}
                      onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                      className="input-solid"
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quiz-difficulty" className="block text-sm font-medium text-slate-700 mb-2">
                      Difficulty
                    </label>
                    <select id="quiz-difficulty"
                      value={newQuiz.difficulty}
                      onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value as 'easy' | 'medium' | 'hard' | 'board' })}
                      className="input-solid"
                    >
                      {difficulties.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div
                  className="quiz-form-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div>
                    <label htmlFor="quiz-count" className="block text-sm font-medium text-slate-700 mb-2">
                      Number of Questions
                    </label>
                    <input id="quiz-count"
                      type="number"
                      value={newQuiz.questionsCount}
                      onChange={(e) => setNewQuiz({ ...newQuiz, questionsCount: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="100"
                      className="input-solid"
                    />
                  </div>

                  <div>
                    <label htmlFor="quiz-passing-score" className="block text-sm font-medium text-slate-700 mb-2">
                      Passing Score (%)
                    </label>
                    <input id="quiz-passing-score"
                      type="number"
                      value={newQuiz.passingScore}
                      onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) || 0 })}
                      min="50"
                      max="100"
                      className="input-solid"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="quiz-dialog-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="ref-secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="ref-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-1" aria-hidden="true">+</span>
                    Create Quiz
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}


      {/* ── GENERATE QUIZ WITH AI MODAL ── */}
      
      {showAI && <AIGenerator task="quiz" category={newQuiz.category} onClose={() => setShowAI(false)} onSave={draft => { const id = 'quiz-' + crypto.randomUUID(); setQuizzes(previous => [{ id, title: draft.title, category: newQuiz.category, difficulty: 'medium', questionsCount: draft.questions.length, passingScore: 70, createdAt: new Date().toISOString(), questions: draft.questions }, ...previous]); begin(id); setShowAI(false); setView('mine') }}/>}
    </div>
  )
}
