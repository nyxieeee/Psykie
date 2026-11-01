/** Preserve server errors and distinguish HTTP failures from connection errors. */
export async function aiErrorMessage(error: unknown, response?: Response): Promise<string> {
  const failure = error as {name?: string; context?: unknown; message?: string} | null
  const http = response || failure?.context as Response | undefined
  if (http && typeof http.status === 'number' && typeof http.json === 'function') {
    let code = ''
    try {
      const body = await http.clone().json()
      if (typeof body.error === 'string' && body.error.trim()) return body.error.slice(0, 700)
      code = typeof body.code === 'string' ? body.code : ''
    } catch { /* Use the HTTP status when the response is empty or unreadable. */ }
    if (http.status === 401) return 'Your session expired. Please sign out and sign in again.'
    if (http.status === 403) return 'AI access was denied. Check that your account setup is complete.'
    if (http.status === 404) return 'AI is not set up for this workspace yet. Contact the workspace owner.'
    if (http.status === 429) return 'The AI request limit has been reached. Please try again later.'
    if (http.status === 504) return 'The AI request timed out. Please try a shorter message.'
    if (['BOOT_ERROR', 'WORKER_ERROR', 'WORKER_LIMIT'].includes(code)) return 'Mindy could not start this request. Please retry; if it continues, contact the workspace owner.'
    return `The AI request failed (HTTP ${http.status}). Please retry; if it continues, contact the workspace owner.`
  }
  if (failure?.name === 'TimeoutError' || (failure?.context as {name?: string} | undefined)?.name === 'TimeoutError') return 'The AI request timed out. Please try a shorter message.'
  return 'Could not connect to AI. Check your connection and try again.'
}

export class AIServiceError extends Error {
  status?: number
  constructor(message: string, status?: number) { super(message); this.name = 'AIServiceError'; this.status = status }
}
