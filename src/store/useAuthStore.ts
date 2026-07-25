import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, User, LoginCredentials, RegisterData } from '../types'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Mock user for demo purposes
const mockUsers: Record<string, RegisterData> = {
  'student@psykie.com': {
    email: 'student@psykie.com',
    password: 'password',
    name: 'Psychology Student',
    role: 'student',
  },
  'professional@psykie.com': {
    email: 'professional@psykie.com',
    password: 'password',
    name: 'Dr. Smith',
    role: 'professional',
  },
  'admin@psykie.com': {
    email: 'admin@psykie.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin',
  },
}

export const useAuthStore = create<AuthState & {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
  setUser: (user: User | null) => void
}>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Check mock users
          const mockUser = mockUsers[credentials.email]
          
          if (mockUser && mockUser.password === credentials.password) {
            const user: User = {
              id: `user-${Math.random().toString(36).substr(2, 9)}`,
              email: mockUser.email,
              name: mockUser.name,
              role: mockUser.role,
              avatar: getAvatarForRole(mockUser.role),
              createdAt: new Date(),
            }
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
            
            return true
          }
          
          set({
            isLoading: false,
            error: 'Invalid email or password',
          })
          
          return false
          
        } catch (error) {
          set({
            isLoading: false,
            error: 'Login failed. Please try again.',
          })
          return false
        }
      },
      
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Store new mock user
          mockUsers[data.email] = data
          
          const user: User = {
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            email: data.email,
            name: data.name,
            role: data.role,
            avatar: getAvatarForRole(data.role),
            createdAt: new Date(),
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
          
          return true
          
        } catch (error) {
          set({
            isLoading: false,
            error: 'Registration failed. Please try again.',
          })
          return false
        }
      },
      
      logout: () => {
        set(initialState)
      },
      
      checkAuth: () => {
        const { isAuthenticated } = get()
        if (!isAuthenticated) {
          set({ isLoading: false })
        }
      },
      
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

function getAvatarForRole(role: string): string {
  const avatars = {
    student: '🎓',
    professional: '👨‍💼',
    admin: '👑',
    guest: '👤',
  }
  return avatars[role as keyof typeof avatars] || '👤'
}

// Selector hooks for better performance
export const useUser = () => useAuthStore(state => state.user)
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated)
export const useIsAuthLoading = () => useAuthStore(state => state.isLoading)
