import type { AIQuestion, QuizOptions } from './ai'

export type QuizAttempt = {
  id: string; quizId: string; title: string; category: string; date: string
  questions: AIQuestion[]; answers: (number | null)[]; flagged: number[]
  score: number; percentage: number; durationSeconds: number; timedOut: boolean
  writtenAnswers?:string[]
}
export type StudyQuiz = {
  id: string; title: string; category: string; difficulty: QuizOptions['difficulty']
  questionsCount: number; passingScore: number; questions: AIQuestion[]; createdAt: string
  style?: QuizOptions['style']; sourceName?: string; timerMinutes?: number; attempts?: QuizAttempt[]
  mode?: 'study' | 'exam'
  questionSeconds?:number
  shuffleQuestions?:boolean;shuffleAnswers?:boolean
  lastAttempt?: {score: number; percentage: number; date: string}
}
export type QuizSession = {
  id: string; quizId: string; questions: AIQuestion[]; index: number
  answers: (number | null)[]; flagged: number[]; startedAt: number; deadline: number | null
  mode?: 'study' | 'exam'; checkedAnswers?: number[]
  questionSeconds?:number; questionDeadline?:number; expiredQuestions?:number[]
  writtenAnswers?:string[]
}

export const normalizeWrittenAnswer=(value:string)=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim()
export function answerText(question:AIQuestion,answer:number|null|undefined,written?:string){return question.format?written||'Unanswered':question.options[answer??-1]||'Unanswered'}
function shuffled<T>(values:T[]):T[]{const copy=[...values];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}

export function createQuizSession(quiz: StudyQuiz, questions = quiz.questions, now = Date.now()): QuizSession {
  const ordered=(quiz.shuffleQuestions?shuffled(questions):questions).map(question=>{if(!quiz.shuffleAnswers||question.format||question.options.length===2)return question;const options=shuffled(question.options);return {...question,options,correct:options.indexOf(question.options[question.correct])}})
  return {id: crypto.randomUUID(), quizId: quiz.id, questions:ordered, index: 0, answers: ordered.map(() => null),writtenAnswers:ordered.map(()=>''), flagged: [], startedAt: now, deadline: quiz.timerMinutes ? now + quiz.timerMinutes * 60000 : null, mode:quiz.mode || 'exam', checkedAnswers:[],questionSeconds:quiz.questionSeconds,questionDeadline:quiz.questionSeconds?now+quiz.questionSeconds*1000:undefined,expiredQuestions:[]}
}
export function completeQuizSession(quiz: StudyQuiz, session: QuizSession, timedOut = false, now = Date.now()): QuizAttempt {
  const score = session.questions.filter((question, index) => session.answers[index] === question.correct).length
  return {id: session.id, quizId: quiz.id, title: quiz.title, category: quiz.category, date: new Date(now).toISOString(), questions: session.questions, answers: session.answers,writtenAnswers:session.writtenAnswers, flagged: session.flagged, score, percentage: session.questions.length ? Math.round(score / session.questions.length * 100) : 0, durationSeconds: Math.max(0, Math.floor((now - session.startedAt) / 1000)), timedOut}
}
export function missedQuestions(attempt: QuizAttempt): AIQuestion[] {
  return attempt.questions.filter((question, index) => attempt.answers[index] !== question.correct)
}
export function questionsFromCards(cards: {question: string; answer: string; category: string}[], category: string, count: number): AIQuestion[] {
  const source = cards.filter(card => card.category === category && card.question.trim() && card.answer.trim())
  return source.slice(0, count).flatMap(card => {
    const others = [...new Set(source.map(other => other.answer))].filter(answer => answer !== card.answer)
    if (!others.length) return []
    const options = [card.answer, ...others.slice(0, others.length >= 3 ? 3 : 1)]
    for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [options[i], options[j]] = [options[j], options[i]] }
    return [{question: card.question, options, correct: options.indexOf(card.answer), explanation: `From your flashcard: ${card.answer}`}]
  })
}
