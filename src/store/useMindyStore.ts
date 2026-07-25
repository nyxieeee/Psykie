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

export const useMindyStore = create<MindyStore>((set, get) => ({
  ...initialState,
  
  createSession: () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      userId: 'current-user',
      messages: [{
        id: `msg-${Date.now()}`,
        text: "Hello! I'm Mindy, your AI psychology assistant. How can I help you today?",
        sender: 'ai',
        timestamp: new Date(),
      }],
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
}))

// Helper function to generate AI response
export const generateMindyResponse = (userMessage: string): string => {
  const responses = [
    `That's a fascinating question about ${extractTopic(userMessage)}. Let me provide some psychological insights...`,
    `Interesting! Based on cognitive psychology principles, ${extractTopic(userMessage)} can be understood as...`,
    `From a behavioral perspective, ${extractTopic(userMessage)} involves...`,
    `In clinical practice, we often see that ${extractTopic(userMessage)} relates to...`,
    `Great observation! Research shows that ${extractTopic(userMessage)} has significant implications for...`,
    `Let me help you understand ${extractTopic(userMessage)} better. According to recent studies...`,
    `That's a complex topic. In neuroscience, we find that ${extractTopic(userMessage)} is associated with...`,
    `From a developmental psychology angle, ${extractTopic(userMessage)} typically manifests as...`,
  ]
  
  const randomIndex = Math.floor(Math.random() * responses.length)
  return responses[randomIndex]
}

function extractTopic(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('memory')) return 'memory'
  if (lowerMessage.includes('cognition') || lowerMessage.includes('cognitive')) return 'cognitive processes'
  if (lowerMessage.includes('anxiety')) return 'anxiety'
  if (lowerMessage.includes('depression')) return 'depression'
  if (lowerMessage.includes('development')) return 'human development'
  if (lowerMessage.includes('personality')) return 'personality theories'
  if (lowerMessage.includes('social')) return 'social psychology'
  if (lowerMessage.includes('abnormal')) return 'abnormal psychology'
  if (lowerMessage.includes('neuro') || lowerMessage.includes('brain')) return 'neuroscience'
  if (lowerMessage.includes('behavior')) return 'behavioral psychology'
  if (lowerMessage.includes('freud')) return 'Freudian theory'
  if (lowerMessage.includes('piaget')) return "Piaget's stages"
  if (lowerMessage.includes('skinner')) return 'operant conditioning'
  if (lowerMessage.includes('learning')) return 'learning theories'
  if (lowerMessage.includes('therapy') || lowerMessage.includes('cbt')) return 'therapeutic approaches'
  if (lowerMessage.includes('research')) return 'research methods'
  if (lowerMessage.includes('statistics')) return 'statistical analysis'
  
  return 'this topic'
}

// Selector hooks
export const useSessions = () => useMindyStore(state => state.sessions)
export const useCurrentSessionId = () => useMindyStore(state => state.currentSessionId)
export const useCurrentSession = () => {
  const { sessions, currentSessionId } = useMindyStore()
  return sessions.find(s => s.id === currentSessionId) || null
}
export const useIsMindyLoading = () => useMindyStore(state => state.isLoading)
