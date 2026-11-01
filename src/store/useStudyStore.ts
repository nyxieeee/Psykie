import { create } from 'zustand'
import { workspaceStorage } from '../utils/workspaceStorage'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface StudyCard {
  id: string
  deckId: string
  question: string
  answer: string
  category: string
  interval: number // days
  repetition: number
  easeFactor: number
  dueDate: string // YYYY-MM-DD
  lastReviewed?: string
  status: 'learning' | 'review' | 'mastered'
}

export interface StudyDeck {
  id: string
  name: string
  category: string
  description?: string
  cardsCount?: number
  lastStudied?: string
}

export interface StudyNote {
  id: string
  title: string
  fileName: string
  fileSize: string
  category: string
  date: string
  summary: string
  keyTopics: string[]
  keyConcepts: string[]
  importantTerms: string[]
  flashcardsGenerated: boolean
}

export interface DeadlineItem {
  id: string
  month: string
  day: string
  title: string
  time: string
  color: string
  completed: boolean
}

export interface ActivityItem {
  id: string
  title: string
  meta: string
  category: 'cards' | 'quiz' | 'note' | 'mindy'
  timestamp: string
}

export interface TodayGoal {
  text: string
  current: number
  total: number
}

interface StudyStoreState {
  decks: StudyDeck[]
  cards: StudyCard[]
  notes: StudyNote[]
  deadlines: DeadlineItem[]
  activities: ActivityItem[]
  todayGoal: TodayGoal
  studyStats: {
    dayStreak: number
    studyHours: number
    lastActiveDate: string
  }

  // Decks & Cards
  createDeck: (name: string, category: string, description?: string) => string
  deleteDeck: (deckId: string) => void
  addCard: (deckId: string, question: string, answer: string, category?: string) => void
  deleteCard: (cardId: string) => void
  reviewCard: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void

  // Notes
  addNote: (note: Omit<StudyNote, 'id' | 'date' | 'flashcardsGenerated'>) => string
  deleteNote: (noteId: string) => void
  updateNoteSummary: (noteId: string, summary: string) => void
  generateFlashcardsFromNote: (noteId: string) => number

  // Goals & Deadlines
  updateGoal: (text: string, current: number, total: number) => void
  incrementGoalProgress: () => void
  addDeadline: (deadline: Omit<DeadlineItem, 'id' | 'completed'>) => void
  toggleDeadline: (deadlineId: string) => void
  deleteDeadline: (deadlineId: string) => void

  // Activities & Stats
  logActivity: (title: string, meta: string, category: ActivityItem['category']) => void
}

const INITIAL_DECKS: StudyDeck[] = []
const INITIAL_CARDS: StudyCard[] = []
const INITIAL_NOTES: StudyNote[] = []
const INITIAL_DEADLINES: DeadlineItem[] = []
const INITIAL_ACTIVITIES: ActivityItem[] = []

export const useStudyStore = create<StudyStoreState>()(
  persist(
    (set, get) => ({
      decks: INITIAL_DECKS,
      cards: INITIAL_CARDS,
      notes: INITIAL_NOTES,
      deadlines: INITIAL_DEADLINES,
      activities: INITIAL_ACTIVITIES,
      todayGoal: {
        text: 'Review 10 flashcards',
        current: 0,
        total: 10,
      },
      studyStats: {
        dayStreak: 0,
        studyHours: 0,
        lastActiveDate: '',
      },

      createDeck: (name, category, description) => {
        const id = `deck-${crypto.randomUUID()}`
        const newDeck: StudyDeck = {
          id,
          name,
          category,
          description,
          cardsCount: 0,
          lastStudied: 'Just created',
        }
        set((state) => ({
          decks: [...state.decks, newDeck],
        }))
        get().logActivity(`Created Deck: ${name}`, `${category} · Just now`, 'cards')
        return id
      },

      deleteDeck: (deckId) => {
        set((state) => ({
          decks: state.decks.filter((d) => d.id !== deckId),
          cards: state.cards.filter((c) => c.deckId !== deckId),
        }))
      },

      addCard: (deckId, question, answer, category = '') => {
        if (!get().decks.some(deck => deck.id === deckId)) return
        const id = `c-${crypto.randomUUID()}`
        const newCard: StudyCard = {
          id,
          deckId,
          question,
          answer,
          category: category || get().decks.find(deck => deck.id === deckId)?.category || 'General Psychology',
          interval: 1,
          repetition: 0,
          easeFactor: 2.5,
          dueDate: new Date().toISOString().split('T')[0],
          status: 'learning',
        }
        set((state) => {
          const updatedCards = [...state.cards, newCard]
          const updatedDecks = state.decks.map((d) => {
            if (d.id === deckId || d.id === 'deck-all') {
              return { ...d, cardsCount: (d.cardsCount || 0) + 1 }
            }
            return d
          })
          return { cards: updatedCards, decks: updatedDecks }
        })
      },

      deleteCard: (cardId) => {
        set((state) => {
          const cardToDelete = state.cards.find((c) => c.id === cardId)
          const updatedCards = state.cards.filter((c) => c.id !== cardId)
          if (!cardToDelete) return { cards: updatedCards }

          const updatedDecks = state.decks.map((d) => {
            if (d.id === cardToDelete.deckId || d.id === 'deck-all') {
              return { ...d, cardsCount: Math.max(0, (d.cardsCount || 1) - 1) }
            }
            return d
          })
          return { cards: updatedCards, decks: updatedDecks }
        })
      },

      reviewCard: (cardId, rating) => {
        set((state) => {
          const updatedCards = state.cards.map((card) => {
            if (card.id !== cardId) return card

            let newInterval = card.interval
            let newRepetition = card.repetition
            let newEase = card.easeFactor
            let newStatus: StudyCard['status'] = card.status

            if (rating === 'again') {
              newRepetition = 0
              newInterval = 1
              newEase = Math.max(1.3, newEase - 0.2)
              newStatus = 'learning'
            } else if (rating === 'hard') {
              newInterval = Math.max(1, Math.round(newInterval * 1.2))
              newEase = Math.max(1.3, newEase - 0.15)
              newStatus = 'learning'
            } else if (rating === 'good') {
              newRepetition += 1
              if (newRepetition === 1) newInterval = 1
              else if (newRepetition === 2) newInterval = 6
              else newInterval = Math.round(newInterval * newEase)
              newStatus = newInterval >= 6 ? 'mastered' : 'review'
            } else if (rating === 'easy') {
              newRepetition += 1
              newEase += 0.15
              if (newRepetition === 1) newInterval = 4
              else newInterval = Math.round(newInterval * newEase * 1.3)
              newStatus = 'mastered'
            }

            const nextDue = new Date()
            nextDue.setDate(nextDue.getDate() + newInterval)

            return {
              ...card,
              interval: newInterval,
              repetition: newRepetition,
              easeFactor: newEase,
              dueDate: nextDue.toISOString().split('T')[0],
              lastReviewed: new Date().toISOString(),
              status: newStatus,
            }
          })

          const today = new Date().toLocaleDateString('en-CA')
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
          const last = state.studyStats.lastActiveDate
          const dayStreak = last === today ? state.studyStats.dayStreak : last === yesterday.toLocaleDateString('en-CA') ? state.studyStats.dayStreak + 1 : 1
          return { cards: updatedCards, studyStats: { ...state.studyStats, dayStreak, lastActiveDate: today }, todayGoal: { ...state.todayGoal, current: Math.min(state.todayGoal.total, state.todayGoal.current + 1) } }
        })

        get().logActivity('Flashcard review completed', 'Active recall session · Just now', 'cards')
      },

      addNote: (noteData) => {
        const id = `note-${crypto.randomUUID()}`
        const newNote: StudyNote = {
          ...noteData,
          id,
          date: 'Today',
          flashcardsGenerated: false,
        }
        set((state) => ({
          notes: [newNote, ...state.notes],
        }))
        get().logActivity(`Created Note: ${newNote.title}`, `${newNote.category} · Just now`, 'note')
        return id
      },

      deleteNote: (noteId) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== noteId),
        }))
      },

      updateNoteSummary: (noteId, summary) => {
        set((state) => ({
          notes: state.notes.map((n) => (n.id === noteId ? { ...n, summary } : n)),
        }))
      },

      generateFlashcardsFromNote: (noteId) => {
        const note = get().notes.find((n) => n.id === noteId)
        if (!note) return 0

        const entries = note.summary.split(/\n+/).map(line => line.trim()).filter(Boolean)
        if (!entries.length) return 0
        const targetDeckId = get().decks.find(d => d.category === note.category)?.id || get().createDeck(note.title, note.category)
        let addedCount = 0
        entries.forEach((line, index) => {
          const separator = line.indexOf(':')
          const question = separator > 0 ? 'Explain ' + line.slice(0, separator).trim() : note.title + ' - recall point ' + (index + 1)
          const answer = separator > 0 ? line.slice(separator + 1).trim() : line
          if (!answer) return
          get().addCard(targetDeckId, question, answer, note.category)
          addedCount++
        })

        set((state) => ({
          notes: state.notes.map((n) => (n.id === noteId ? { ...n, flashcardsGenerated: true } : n)),
        }))

        get().logActivity(
          `Generated ${addedCount} Flashcards`,
          `From note: ${note.title} · Just now`,
          'cards'
        )

        return addedCount
      },

      updateGoal: (text, current, total) => {
        set({
          todayGoal: { text, current, total },
        })
      },

      incrementGoalProgress: () => {
        set((state) => ({
          todayGoal: {
            ...state.todayGoal,
            current: Math.min(state.todayGoal.total, state.todayGoal.current + 1),
          },
        }))
      },

      addDeadline: (deadlineData) => {
        const id = `dl-${crypto.randomUUID()}`
        const newDeadline: DeadlineItem = {
          ...deadlineData,
          id,
          completed: false,
        }
        set((state) => ({
          deadlines: [newDeadline, ...state.deadlines],
        }))
        get().logActivity(`Scheduled: ${newDeadline.title}`, `${newDeadline.month} ${newDeadline.day} · Just now`, 'quiz')
      },

      toggleDeadline: (deadlineId) => {
        set((state) => ({
          deadlines: state.deadlines.map((d) =>
            d.id === deadlineId ? { ...d, completed: !d.completed } : d
          ),
        }))
      },

      deleteDeadline: (deadlineId) => {
        set((state) => ({
          deadlines: state.deadlines.filter((d) => d.id !== deadlineId),
        }))
      },

      logActivity: (title, meta, category) => {
        const item: ActivityItem = {
          id: `act-${crypto.randomUUID()}`,
          title,
          meta,
          category,
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          activities: [item, ...state.activities.slice(0, 15)],
        }))
      },
    }),
    {
      name: 'psykie-study-store',
      storage: createJSONStorage(() => workspaceStorage),
    }
  )
)

