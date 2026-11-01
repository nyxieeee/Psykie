import { useAuthStore } from '../store/useAuthStore'
import { requireSupabase, supabaseConfigured } from './supabase'
import { AIServiceError, aiErrorMessage } from './aiErrors'
import { AITask, AIDraft, QuizOptions, ResearchResponse, trustedSource, validateDraft } from '../../supabase/functions/_shared/contracts'
export type { AITask, AIDraft, AIQuestion, QuizOptions, ResearchResult, ResearchResponse } from '../../supabase/functions/_shared/contracts'
export { TRUSTED_SOURCES } from '../../supabase/functions/_shared/contracts'
export const aiConfigured = supabaseConfigured
async function invoke(name: string, body: Record<string, unknown>, signal?: AbortSignal) {
  if (!supabaseConfigured) throw new Error('AI is not available for this workspace yet.')
  if (useAuthStore.getState().sessionSource !== 'supabase') throw new Error('Sign in with your account to use AI. Development demo accounts do not include AI access.')
  const { data: session } = await requireSupabase().auth.getSession()
  if (!session.session) throw new Error('Your session expired. Please sign in again.')
  const { data, error, response } = await requireSupabase().functions.invoke(name, { body, signal: AbortSignal.any([AbortSignal.timeout(120000), ...(signal ? [signal] : [])]) })
  if (error) {
    throw new AIServiceError(await aiErrorMessage(error, response), response?.status || error.context?.status)
  }
  if (data?.error) throw new Error(data.error)
  return data
}
export async function chatWithMindy(messages: { role: 'user' | 'assistant'; content: string }[], signal?: AbortSignal): Promise<string> {
  const data = await invoke('psykie-ai', { action: 'chat', messages }, signal)
  if (typeof data?.answer !== 'string' || !data.answer.trim()) throw new Error('Mindy returned an empty response. Please try again.')
  return data.answer
}
export async function generateAIDraft(task: AITask, text: string, category: string, count: number, signal?: AbortSignal, quizOptions?: QuizOptions): Promise<AIDraft> {
  return validateDraft(await invoke('psykie-ai', { action: task, text, category, count, quizOptions }, signal), task)
}
export async function searchTrustedResearch(query: string, signal?: AbortSignal): Promise<ResearchResponse> {
  const data = await invoke('psykie-research', { query }, signal)
  if (!data || !Array.isArray(data.results) || typeof data.notice !== 'string') throw new Error('The search service returned an invalid response.')
  const results = data.results.filter((result: any) => result && typeof result.url === 'string' && trustedSource(result.url) && typeof result.title === 'string' && typeof result.summary === 'string' && typeof result.relevance === 'string')
  return { ...data, results }
}
