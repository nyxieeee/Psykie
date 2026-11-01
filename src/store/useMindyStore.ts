import { persist, createJSONStorage } from 'zustand/middleware'
import { workspaceStorage } from '../utils/workspaceStorage'
import { create } from 'zustand'
import { Message, ChatSession } from '../types'

interface MindyState {
  sessions: ChatSession[]
  currentSessionId: string | null
  isLoading: boolean
  error: string | null
}

interface MindyActions {
  createSession: () => ChatSession
  switchSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  addMessage: (sessionId: string, message: Message) => void
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  clearSessions: () => void
}

type MindyStore = MindyState & MindyActions

const initialState: MindyState = {
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  error: null,
}

export const useMindyStore = create<MindyStore>()(persist((set) => ({
  ...initialState,
  
  createSession: () => {
    const newSession: ChatSession = {
      id: `session-${crypto.randomUUID()}`,
      userId: 'current-user',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    set((state) => ({
      sessions: [...state.sessions, newSession],
      currentSessionId: newSession.id,
    }))
    
    return newSession
  },
  
  switchSession: (sessionId: string) => {
    set({ currentSessionId: sessionId })
  },
  
  deleteSession: (sessionId: string) => {
    set((state) => ({
      sessions: state.sessions.filter(s => s.id !== sessionId),
      currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
    }))
  },
  
  addMessage: (sessionId: string, message: Message) => {
    set((state) => {
      const updatedSessions = state.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, message],
            updatedAt: new Date(),
          }
        }
        return session
      })
      
      return { sessions: updatedSessions }
    })
  },
  
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => {
    set((state) => {
      const updatedSessions = state.sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            messages: session.messages.map(msg =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          }
        }
        return session
      })
      
      return { sessions: updatedSessions }
    })
  },
  
  clearSessions: () => {
    set(initialState)
  },
}), { name: 'psykie-mindy', storage: createJSONStorage(() => workspaceStorage), partialize: state => ({ sessions: state.sessions, currentSessionId: state.currentSessionId }) }))

// Selector hooks
export const useSessions = () => useMindyStore(state => state.sessions)
export const useCurrentSessionId = () => useMindyStore(state => state.currentSessionId)
export const useCurrentSession = () => {
  const { sessions, currentSessionId } = useMindyStore()
  return sessions.find(s => s.id === currentSessionId) || null
}
export const useIsMindyLoading = () => useMindyStore(state => state.isLoading)
