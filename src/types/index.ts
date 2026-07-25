// User Types
export type UserRole = 'student' | 'professional' | 'admin' | 'guest'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  lastLogin?: Date
}

// Authentication Types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  role: UserRole
}

// Message Types (for Mindy Chat)
export interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
  status?: 'sending' | 'delivered' | 'read' | 'error'
}

export interface ChatSession {
  id: string
  userId: string
  messages: Message[]
  title?: string
  type?: 'general' | 'study' | 'research' | 'clinical'
  createdAt: Date
  updatedAt: Date
}

// Psychology Content Types
export interface Flashcard {
  id: string
  question: string
  answer: string
  category: string
  tags?: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'board'
  isFavorite: boolean
  lastReviewed?: Date
  reviewCount: number
  createdAt: Date
}

export interface FlashcardDeck {
  id: string
  name: string
  description?: string
  userId: string
  flashcards: Flashcard[]
  category: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  userId: string
  category: string
  tags: string[]
  color?: string
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Quiz {
  id: string
  title: string
  userId: string
  questions: QuizQuestion[]
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'board'
  passingScore: number
  createdAt: Date
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'identification' | 'enumeration' | 'essay' | 'situational'
  options?: string[]
  correctAnswer?: number | string | string[]
  explanation?: string
  points: number
}

export interface QuizResult {
  quizId: string
  userId: string
  score: number
  total: number
  percentage: number
  timeTaken: number // in seconds
  answers: {
    questionId: string
    userAnswer: any
    isCorrect: boolean
  }[]
  completedAt: Date
}

// Research Types
export interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  journal?: string
  year?: number
  abstract?: string
  summary?: string
  url?: string
  doi?: string
  citation?: string
  tags: string[]
  userId: string
  createdAt: Date
}

export interface Citation {
  id: string
  text: string
  style: 'APA' | 'MLA' | 'Chicago' | 'Harvard'
  createdAt: Date
}

// Student Module Types
export interface StudySubject {
  id: string
  name: string
  code?: string
  description?: string
  color: string
  icon?: string
  userId: string
}

export interface Assignment {
  id: string
  subjectId: string
  title: string
  description?: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  status: 'not_started' | 'in_progress' | 'completed' | 'submitted'
  userId: string
  createdAt: Date
}

export interface StudySession {
  id: string
  subjectId: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  notes?: string
  userId: string
}

export interface StudyGoal {
  id: string
  title: string
  description?: string
  targetDate: Date
  targetAmount: number // e.g., hours to study, pages to read
  unit: string // 'hours', 'pages', 'cards', etc.
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Professional Module Types
export interface Client {
  id: string
  userId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  clientId: string
  userId: string
  title?: string
  type: string
  startTime: Date
  endTime: Date
  duration: number // in minutes
  location?: string
  notes: string
  attachments: string[]
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  createdAt: Date
}

export interface TreatmentPlan {
  id: string
  clientId: string
  userId: string
  goals: string[]
  interventions: string[]
  frequency: string
  duration: string
  progress: number
  status: 'active' | 'completed' | 'on_hold'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Assessment Types
export interface Assessment {
  id: string
  clientId: string
  userId: string
  type: string
  title?: string
  data: Record<string, unknown>
  scores?: Record<string, number>
  interpretation?: string
  recommendations?: string[]
  completedAt: Date
  createdAt: Date
}

// Appointment Types
export interface Appointment {
  id: string
  clientId?: string
  userId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  type: 'session' | 'consultation' | 'follow_up' | 'assessment' | 'other'
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  reminders: boolean
  notes?: string
  createdAt: Date
}

// Navigation Types
export interface NavItem {
  id: string
  label: string
  icon: string
  path: string
  children?: NavItem[]
  badge?: number | string
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  createdAt: Date
  read: boolean
}

// Settings Types
export interface UserSettings {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notificationPreferences: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'contacts' | 'private'
    activityStatus: boolean
  }
}
