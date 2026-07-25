// Type definitions for the Psykie application

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export type UserRole = 'guest' | 'student' | 'professional' | 'admin' | 'super_admin'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export interface ChatSession {
  id: string
  messages: Message[]
  title?: string
  createdAt: Date
}

export interface Flashcard {
  id: string
  question: string
  answer: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'board'
  isFavorite: boolean
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  type: 'multiple_choice' | 'true_false' | 'identification' | 'enumeration' | 'essay' | 'situational'
  difficulty: 'easy' | 'medium' | 'hard' | 'board'
  explanation?: string
}

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  name: string
  demographics: DemographicInfo
  intakeForms: Form[]
  consentForms: Form[]
  sessionHistory: Session[]
  treatmentGoals: TreatmentGoal[]
}

export interface DemographicInfo {
  age: number
  gender: string
  occupation: string
  education: string
  contactInfo: string
}

export interface Form {
  id: string
  type: string
  data: Record<string, unknown>
  date: Date
}

export interface Session {
  id: string
  date: Date
  duration: number // in minutes
  type: string
  notes: string
  attachments: string[]
}

export interface TreatmentGoal {
  id: string
  description: string
  progress: number // percentage
  targetDate: Date
  status: 'active' | 'completed' | 'on_hold'
}

export interface Appointment {
  id: string
  clientId: string
  startTime: Date
  endTime: Date
  type: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export interface ResearchPaper {
  id: string
  title: string
  authors: string[]
  journal: string
  date: Date
  summary: string
  keywords: string[]
  url: string
  citation: string
}

export interface FeatureCard {
  id: string
  title: string
  description: string
  icon: string
  color: string
  path?: string
}

export interface Stat {
  number: string
  label: string
  color: string
}
