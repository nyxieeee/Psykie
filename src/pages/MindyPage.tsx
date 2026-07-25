import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMindyStore, useCurrentSession, useSessions, generateMindyResponse, useCurrentSessionId } from '../store/useMindyStore'
import { Brain, X, Menu, ArrowRight, User, Pencil, RefreshCw, Send, Trash2, Check, CornerDownLeft, Search, Pin, Star } from 'lucide-react'

export function MindyPage() {
  const user = useUser()
  const sessions = useSessions()
  const currentSessionId = useCurrentSessionId()
  const currentSession = useCurrentSession()
  const { createSession, switchSession, addMessage } = useMindyStore()
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSessionMenu, setShowSessionMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-create session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      const newSession = createSession()
      switchSession(newSession.id)
    } else if (!currentSessionId && sessions.length > 0) {
      switchSession(sessions[0].id)
    }
  }, [sessions, currentSessionId, createSession, switchSession])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages])

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!message.trim() || !currentSessionId || isSending) return

    setIsSending(true)
    
    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      text: message.trim(),
      sender: 'user' as const,
      timestamp: new Date(),
    }
    
    addMessage(currentSessionId, userMessage)
    setMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateMindyResponse(message.trim())
      const aiMessage = {
        id: `msg-${Date.now() + 1}`,
        text: aiResponse,
        sender: 'ai' as const,
        timestamp: new Date(),
      }
      addMessage(currentSessionId, aiMessage)
      setIsSending(false)
    }, 1000)
  }

  const handleNewChat = () => {
    const newSession = createSession()
    switchSession(newSession.id)
    setShowSessionMenu(false)
  }

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId)
    setShowSessionMenu(false)
  }

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement delete session
  }

  const suggestedPrompts = [
    "Explain cognitive behavioral therapy",
    "What are the key differences between Freud and Jung?",
    "Help me understand memory encoding",
    "Generate a quiz on developmental psychology",
    "Summarize the DSM-5 criteria for depression",
    "What are the latest research findings on neuroplasticity?",
    "Help me create a study plan for the board exam",
    "Explain the stages of Piaget's cognitive development",
  ]

  const typingAnimations = [
    "Mindy is thinking...",
    "Mindy is analyzing...",
    "Mindy is searching knowledge base...",
    "Mindy is formulating response...",
  ]
  const [typingText, setTypingText] = useState('')

  useEffect(() => {
    if (isSending) {
      let index = 0
      const interval = setInterval(() => {
        setTypingText(typingAnimations[index % typingAnimations.length])
        index++
      }, 2000)
      return () => clearInterval(interval)
    }
    setTypingText('')
  }, [isSending])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-full flex flex-col"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Mindy Avatar */}
          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl"
            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain size={32} className="text-white" />
          </motion.div>
          <div>
            <motion.h1
              className="text-2xl font-bold text-gradient"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Mindy
            </motion.h1>
            <motion.p
              className="text-sm text-slate-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {currentSession?.messages.length === 1 
                ? 'Your AI Psychology Assistant'
                : `${currentSession?.messages.length || 0} messages`}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Session Menu */}
          <motion.div className="relative">
            <motion.button
              onClick={() => setShowSessionMenu(!showSessionMenu)}
              className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentSession?.title || 'New Chat'}
              <motion.span
                className="ml-1"
                animate={{ rotate: showSessionMenu ? 180 : 0 }}
              >
                ▼
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {showSessionMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                >
                  <motion.button
                    onClick={handleNewChat}
                    className="w-full px-4 py-3 text-left text-purple-600 font-medium hover:bg-purple-50 transition-colors"
                    whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}
                  >
                    <span className="text-lg mr-2">+</span>
                    New Chat
                  </motion.button>
                  
                  <motion.div className="divider m-0" />
                  
                  <motion.div className="max-h-64 overflow-y-auto">
                    {sessions.map((session, index) => (
                      <motion.button
                        key={session.id}
                        onClick={() => handleSwitchSession(session.id)}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                          session.id === currentSessionId
                            ? 'bg-purple-50 text-purple-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{session.title || `Chat ${sessions.length - index}`}</span>
                          <motion.button
                            onClick={(e) => handleDeleteSession(session.id, e)}
                            className="text-slate-400 hover:text-red-500 text-xs"
                            whileHover={{ scale: 1.1 }}
                          >
                            <X size={14} />
                          </motion.button>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Clear Button */}
          <motion.button
            onClick={() => setMessage('')}
            disabled={!message}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-medium disabled:opacity-50 hover:bg-slate-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Clear
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Chat Messages */}
      <motion.div
        className="flex-1 overflow-y-auto pr-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {currentSession && currentSession.messages.length > 0 ? (
            <motion.div
              key={currentSession.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentSession.messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    className={`max-w-[80%] lg:max-w-[60%] rounded-2xl px-5 py-4 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                    whileHover={{ 
                      scale: msg.sender === 'user' ? 1.01 : 1.02,
                      y: -2 
                    }}
                  >
                    <motion.p
                      className="whitespace-pre-wrap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    >
                      {msg.text}
                    </motion.p>
                    <motion.div
                      className={`flex justify-end mt-2 ${
                        msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    >
                      <span className="text-xs">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isSending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex justify-start"
                >
                  <motion.div
                    className="bg-white border border-slate-200 rounded-2xl px-5 py-4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div
                        className="flex gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <motion.span
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.15 }}
                        />
                        <motion.span
                          className="w-2 h-2 bg-purple-500 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.3 }}
                        />
                      </motion.div>
                      <span className="text-sm text-slate-500 ml-2">{typingText}</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center justify-center h-full"
            >
              {/* Mindy Welcome Avatar */}
              <motion.div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl mb-6"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1] 
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Brain size={28} className="text-indigo-600" />
              </motion.div>
              
              <motion.h2
                className="text-3xl font-bold text-gradient mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Hello! I'm Mindy
              </motion.h2>
              
              <motion.p
                className="text-slate-500 text-center max-w-md mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                I'm your AI psychology assistant. I can help you learn psychology concepts, 
                summarize research, generate quizzes, create flashcards, and much more!
              </motion.p>

              {/* Suggested Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl"
              >
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setMessage(prompt)}
                    className="card p-4 text-left hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                  >
                    <motion.span
                      className="text-purple-600 text-xl mr-3"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                    >
                      ⚡
                    </motion.span>
                    <span className="text-slate-700">{prompt}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Input Area */}
      <motion.form
        onSubmit={handleSend}
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className={`flex items-end gap-4 p-4 rounded-2xl ${
            message ? 'bg-white border-2 border-purple-300 shadow-lg' : 'bg-white border border-slate-200'
          } transition-all duration-300`}
        >
          {/* Textarea */}
          <motion.textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isSending ? "Mindy is responding..." : "Type your message here..."}
            className="flex-1 resize-none bg-transparent border-none focus:ring-0 text-slate-700 placeholder-slate-400 outline-none max-h-32"
            rows={1}
            disabled={isSending}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={!message.trim() || isSending}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-300 ${
              message ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.span
              animate={{ 
                scale: message ? [1, 1.1, 1] : 1,
                rotate: message ? [0, 5, -5, 0] : 0
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight size={20} />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Voice Input Button */}
        <motion.div
          className="mt-3 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <motion.p className="text-xs text-slate-400">
            Press <motion.kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono">⌘</motion.kbd> + <motion.kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono">K</motion.kbd> for quick search
          </motion.p>
        </motion.div>
      </motion.form>

      {/* Mobile Sidebar Toggle */}
      <motion.button
        className="lg:hidden fixed top-20 right-4 z-40 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-lg shadow-lg flex items-center justify-center text-xl"
        onClick={() => setShowSidebar(!showSidebar)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        {showSidebar ? <X size={24} /> : <Menu size={24} />}
      </motion.button>
    </motion.div>
  )
}
