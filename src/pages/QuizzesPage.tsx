import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Plus } from 'lucide-react'

export function QuizzesPage() {
  const user = useUser()
  const [quizzes, setQuizzes] = useState<{
    id: string;
    title: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'board';
    questionsCount: number;
    passingScore: number;
    createdAt: string;
    lastAttempt?: { score: number; percentage: number; date: string };
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAttemptModal, setShowAttemptModal] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [newQuiz, setNewQuiz] = useState({ 
    title: '', 
    category: 'General Psychology',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'board',
    questionsCount: 10,
    passingScore: 70
  })

  const categories = [
    'All',
    'General Psychology',
    'Cognitive Psychology',
    'Developmental Psychology',
    'Abnormal Psychology',
    'Social Psychology',
    'Biological Psychology',
    'Research Methods',
    'Statistics',
    'Board Exam',
  ]

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'bg-emerald-100', text: 'text-emerald-700' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-100', text: 'text-amber-700' },
    { value: 'hard', label: 'Hard', color: 'bg-rose-100', text: 'text-rose-700' },
    { value: 'board', label: 'Board Exam', color: 'bg-purple-100', text: 'text-purple-700' },
  ]

  useEffect(() => {
    // Simulate loading quizzes
    const timer = setTimeout(() => {
      const mockQuizzes = [
        {
          id: '1',
          title: 'Cognitive Psychology Basics',
          category: 'Cognitive Psychology',
          difficulty: 'easy',
          questionsCount: 15,
          passingScore: 70,
          createdAt: '2 weeks ago',
          lastAttempt: { score: 12, percentage: 80, date: '1 day ago' },
        },
        {
          id: '2',
          title: 'Developmental Stages',
          category: 'Developmental Psychology',
          difficulty: 'medium',
          questionsCount: 20,
          passingScore: 75,
          createdAt: '1 month ago',
          lastAttempt: { score: 16, percentage: 80, date: '3 days ago' },
        },
        {
          id: '3',
          title: 'DSM-5-TR Disorders',
          category: 'Abnormal Psychology',
          difficulty: 'board',
          questionsCount: 25,
          passingScore: 80,
          createdAt: '3 weeks ago',
          lastAttempt: { score: 18, percentage: 72, date: '1 week ago' },
        },
        {
          id: '4',
          title: 'Biological Basis of Behavior',
          category: 'Biological Psychology',
          difficulty: 'hard',
          questionsCount: 10,
          passingScore: 65,
          createdAt: '1 week ago',
        },
        {
          id: '5',
          title: 'Research Methods',
          category: 'Research Methods',
          difficulty: 'medium',
          questionsCount: 12,
          passingScore: 70,
          createdAt: '2 months ago',
          lastAttempt: { score: 10, percentage: 83, date: '2 weeks ago' },
        },
        {
          id: '6',
          title: 'Board Exam Practice #1',
          category: 'Board Exam',
          difficulty: 'board',
          questionsCount: 50,
          passingScore: 75,
          createdAt: '1 month ago',
          lastAttempt: { score: 38, percentage: 76, date: '5 days ago' },
        },
      ]
      setQuizzes(mockQuizzes)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       quiz.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuiz.title.trim()) return
    
    const newQuizData = {
      id: `quiz-${Date.now()}`,
      title: newQuiz.title,
      category: newQuiz.category,
      difficulty: newQuiz.difficulty,
      questionsCount: newQuiz.questionsCount,
      passingScore: newQuiz.passingScore,
      createdAt: 'Just now',
    }
    
    setQuizzes([newQuizData, ...quizzes])
    setShowCreateModal(false)
    setNewQuiz({ 
      title: '', 
      category: 'General Psychology',
      difficulty: 'medium',
      questionsCount: 10,
      passingScore: 70
    })
  }

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter(quiz => quiz.id !== id))
  }

  const startQuiz = (quizId: string) => {
    setSelectedQuiz(quizId)
    setShowAttemptModal(true)
  }

  const handleStartAttempt = () => {
    // Navigate to quiz attempt page
    console.log('Starting quiz:', selectedQuiz)
    setShowAttemptModal(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1
            className="text-3xl font-bold text-gradient mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Quizzes
          </motion.h1>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Test your knowledge and track your progress
          </motion.p>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Search */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-pill pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          </motion.div>

          {/* Generate with AI Button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="btn-pink px-6 py-3 hidden md:flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span><Sparkles size={18} /></span>
            Generate with AI
          </motion.button>

          {/* Create Button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className="text-lg mr-1">+</span>
            New Quiz
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Categories Filter */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.toLowerCase()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="text-2xl font-bold text-purple-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredQuizzes.length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Total Quizzes
          </motion.p>
        </motion.div>

        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.p
            className="text-2xl font-bold text-pink-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredQuizzes.filter(q => q.lastAttempt).length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Attempted
          </motion.p>
        </motion.div>

        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.p
            className="text-2xl font-bold text-amber-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredQuizzes.filter(q => q.difficulty === 'board').length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Board Level
          </motion.p>
        </motion.div>

        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.p
            className="text-2xl font-bold text-emerald-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredQuizzes.reduce((sum, q) => sum + q.questionsCount, 0)}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Total Questions
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Quizzes List */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="card h-36 skeleton"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      ) : filteredQuizzes.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card card-3d group"
              >
                <div className="p-4">
                  <motion.div
                    className="flex items-start justify-between mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 + 0.1 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-2xl flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      <HelpCircle size={18} />
                    </motion.div>
                    
                    <motion.button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="text-xl text-slate-300 hover:text-red-500 transition-colors"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={18} />
                    </motion.button>
                  </motion.div>

                  <motion.h3
                    className="font-bold text-slate-800 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 + 0.2 }}
                  >
                    {quiz.title}
                  </motion.h3>

                  <motion.div
                    className="flex items-center gap-2 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
                  >
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      difficulties.find(d => d.value === quiz.difficulty)?.color || 'bg-slate-100'
                    } ${
                      difficulties.find(d => d.value === quiz.difficulty)?.text || 'text-slate-700'
                    }`}>
                      {difficulties.find(d => d.value === quiz.difficulty)?.label || 'Medium'}
                    </span>
                    <span className="text-xs text-slate-400">{quiz.category}</span>
                  </motion.div>

                  <motion.p
                    className="text-sm text-slate-500 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 + 0.4 }}
                  >
                    {quiz.questionsCount} questions • Pass: {quiz.passingScore}%
                  </motion.p>

                  {quiz.lastAttempt ? (
                    <motion.div
                      className="flex items-center justify-between pt-3 border-t border-slate-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.5 }}
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 + 0.6 }}
                      >
                        <motion.span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            quiz.lastAttempt.percentage >= quiz.passingScore 
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {quiz.lastAttempt.percentage >= quiz.passingScore ? '<Check size={16} />' : '<X size={16} />'}
                        </motion.span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Last Score: {quiz.lastAttempt.score}/{quiz.questionsCount}
                          </p>
                          <p className="text-xs text-slate-400">
                            {quiz.lastAttempt.percentage}% • {quiz.lastAttempt.date}
                          </p>
                        </div>
                      </motion.div>

                      <motion.button
                        onClick={() => startQuiz(quiz.id)}
                        className="btn-primary px-4 py-2 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Retake
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex justify-end pt-3 border-t border-slate-100"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.5 }}
                    >
                      <motion.button
                        onClick={() => startQuiz(quiz.id)}
                        className="btn-primary px-4 py-2 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Start Quiz
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="empty-state-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <HelpCircle size={18} />
          </motion.div>
          <motion.h3
            className="text-xl font-bold text-slate-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            No quizzes found
          </motion.h3>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Create your first quiz or ask Mindy to generate one!'}
          </motion.p>
        </motion.div>
      )}

      {/* Create Quiz Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-modal w-full max-w-lg p-6"
            >
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.h2
                  className="text-2xl font-bold text-gradient"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Create New Quiz
                </motion.h2>
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  className="text-2xl text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              </motion.div>

              <form onSubmit={handleCreateQuiz} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    placeholder="e.g., Cognitive Psychology Basics"
                    className="input-solid"
                    autoFocus
                  />
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newQuiz.category}
                      onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                      className="input-solid"
                    >
                      {categories.slice(1).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={newQuiz.difficulty}
                      onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value as 'easy' | 'medium' | 'hard' | 'board' })}
                      className="input-solid"
                    >
                      {difficulties.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      value={newQuiz.questionsCount}
                      onChange={(e) => setNewQuiz({ ...newQuiz, questionsCount: parseInt(e.target.value) || 0 })}
                      min="1"
                      max="100"
                      className="input-solid"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Passing Score (%)<input type="hidden" />
                    </label>
                    <input
                      type="number"
                      value={newQuiz.passingScore}
                      onChange={(e) => setNewQuiz({ ...newQuiz, passingScore: parseInt(e.target.value) || 0 })}
                      min="50"
                      max="100"
                      className="input-solid"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-secondary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn-primary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-1">+</span>
                    Create Quiz
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Quiz Modal */}
      <AnimatePresence>
        {showAttemptModal && selectedQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-modal w-full max-w-md p-6"
            >
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl mx-auto mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <HelpCircle size={18} />
                </motion.div>
                
                <motion.h2
                  className="text-2xl font-bold text-gradient"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Start Quiz
                </motion.h2>
                
                <motion.p
                  className="text-slate-500 mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {quizzes.find(q => q.id === selectedQuiz)?.title}
                </motion.p>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.div
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <motion.span
                      className="text-2xl"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <BarChart3 size={18} />
                    </motion.span>
                    <div>
                      <p className="font-semibold text-slate-800">Questions</p>
                      <p className="text-sm text-slate-500">
                        {quizzes.find(q => q.id === selectedQuiz)?.questionsCount || 0}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <motion.span
                      className="text-2xl"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <Target size={18} />
                    </motion.span>
                    <div>
                      <p className="font-semibold text-slate-800">Passing Score</p>
                      <p className="text-sm text-slate-500">
                        {quizzes.find(q => q.id === selectedQuiz)?.passingScore || 70}%
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <motion.span
                      className="text-2xl"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      ⏱️
                    </motion.span>
                    <div>
                      <p className="font-semibold text-slate-800">Time Limit</p>
                      <p className="text-sm text-slate-500">No limit</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-end gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <motion.button
                  type="button"
                  onClick={() => setShowAttemptModal(false)}
                  className="btn-secondary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleStartAttempt}
                  className="btn-primary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Now
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowCreateModal(true)}
        className="fab"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: 'spring', damping: 10, stiffness: 200 }}
      >
        <HelpCircle size={18} />
      </motion.button>
    </motion.div>
  )
}
