import { plainText } from './plainText.ts'
export type AITask = 'summary' | 'flashcards' | 'quiz' | 'reviewer'
export type AIQuestion = { question: string; options: string[]; correct: number; explanation: string; format?: 'identification' | 'fill-blank' }
export type QuizOptions = { style: 'multiple-choice' | 'true-false' | 'scenario' | 'mixed' | 'case-study' | 'research' | 'ethics' | 'identification' | 'fill-blank'; difficulty: 'easy' | 'medium' | 'hard' | 'board' }
export type AIDraft = { title: string; summary: string; keyPoints: string[]; cards: { question: string; answer: string }[]; questions: AIQuestion[] }
export type ResearchResult = { id: string; title: string; url: string; domain: string; source: string; kind: 'journal' | 'guidance' | 'resource'; summary: string; relevance: string; retrievedAt: string }
export type ResearchResponse = { query: string; results: ResearchResult[]; notice: string }
export const TRUSTED_SOURCES = [
  { domain: 'pubmed.ncbi.nlm.nih.gov', name: 'PubMed', kind: 'journal' },
  { domain: 'pmc.ncbi.nlm.nih.gov', name: 'PubMed Central', kind: 'journal' },
  { domain: 'apa.org', name: 'American Psychological Association', kind: 'resource' },
  { domain: 'psychologicalscience.org', name: 'Association for Psychological Science', kind: 'resource' },
  { domain: 'bps.org.uk', name: 'British Psychological Society', kind: 'resource' },
  { domain: 'nimh.nih.gov', name: 'National Institute of Mental Health', kind: 'guidance' },
  { domain: 'who.int', name: 'World Health Organization', kind: 'guidance' },
  { domain: 'nice.org.uk', name: 'NICE', kind: 'guidance' },
  { domain: 'nhs.uk', name: 'NHS', kind: 'guidance' },
  { domain: 'cochranelibrary.com', name: 'Cochrane Library', kind: 'journal' },
  { domain: 'nature.com', name: 'Nature', kind: 'journal' },
  { domain: 'science.org', name: 'Science', kind: 'journal' },
] as const
export function trustedSource(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return undefined
    return TRUSTED_SOURCES.find(source => url.hostname === source.domain || url.hostname.endsWith('.' + source.domain))
  } catch { return undefined }
}
export function validateDraft(value: unknown, task: AITask, limits: {questions?:number;cards?:number;summary?:number;keyPoints?:number} = {}): AIDraft {
  const data = value as AIDraft
  const text = (v: unknown, max = 12000): v is string => typeof v === 'string' && v.length <= max
  if (!data || !text(data.title, 200) || !text(data.summary,limits.summary||12000) || !Array.isArray(data.keyPoints) || data.keyPoints.length > (limits.keyPoints||12) || data.keyPoints.some(p => !text(p, 2000)) || !Array.isArray(data.cards) || !Array.isArray(data.questions)) throw new Error('The AI returned an invalid draft. Please try again.')
  if (data.cards.length > (limits.cards||20) || data.cards.some(c => !c || !text(c.question, 1000) || !c.question.trim() || !text(c.answer, 4000) || !c.answer.trim())) throw new Error('The AI returned invalid flashcards.')
  if (data.questions.length > (limits.questions||15) || data.questions.some(q => !q || !text(q.question, 1500) || !q.question.trim() || !Array.isArray(q.options) || !(q.format?['identification','fill-blank'].includes(q.format)&&q.options.length===1&&q.correct===0:[2,4].includes(q.options.length)) || q.options.some(o => !text(o, 1000) || !o.trim()) || new Set(q.options).size !== q.options.length || !Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length || !text(q.explanation, 2500))) throw new Error('The AI returned invalid quiz questions.')
  if (((task === 'summary'||task==='reviewer') && !data.summary.trim()) || (task === 'flashcards' && !data.cards.length) || (task === 'quiz' && !data.questions.length)) throw new Error('The AI did not return the requested content.')
  if(task==='reviewer'&&(!data.keyPoints.length||!data.cards.length||!data.questions.length))throw new Error('The reviewer is incomplete. Please generate it again.')
  const clean = {...data,title:plainText(data.title),summary:plainText(data.summary),keyPoints:data.keyPoints.map(plainText),cards:data.cards.map(card=>({question:plainText(card.question),answer:plainText(card.answer)})),questions:data.questions.map(question=>({...question,question:plainText(question.question),options:question.options.map(plainText),explanation:plainText(question.explanation)}))}
  if(!clean.title||clean.cards.some(card=>!card.question||!card.answer)||clean.questions.some(question=>!question.question||question.options.some(option=>!option)||new Set(question.options).size!==question.options.length))throw new Error('The AI returned empty or duplicate content after removing formatting. Please generate again.')
  if((task==='summary'||task==='reviewer')&&!clean.summary)throw new Error('The AI returned an empty summary.')
  return clean
}
