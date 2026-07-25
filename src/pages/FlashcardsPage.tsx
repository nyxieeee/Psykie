import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, Layers, Plus } from 'lucide-react'

export function FlashcardsPage() {
  const user = useUser()
  const [flashcards, setFlashcards] = useState<{
    id: string;
    question: string;
    answer: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'board';
    isFavorite: boolean;
    lastReviewed: string;
    reviewCount: number;
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newFlashcard, setNewFlashcard] = useState({ 
    question: '', 
    answer: '', 
    category: 'General Psychology',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'board'
  })
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState(false)

  const categories = [
    'All',
    'General Psychology',
    'Cognitive Psychology',
    'Developmental Psychology',
    'Abnormal Psychology',
    'Social Psychology',
    'Biological Psychology',
    'Research Methods',
    'Clinical Psychology',
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
    // Simulate loading flashcards
    const timer = setTimeout(() => {
      const mockFlashcards = [
        {
          id: '1',
          question: 'What is cognitive psychology?',
          answer: 'Cognitive psychology is the study of mental processes such as attention, memory, perception, problem-solving, and thinking.',
          category: 'Cognitive Psychology',
          difficulty: 'easy',
          isFavorite: true,
          lastReviewed: '1 day ago',
          reviewCount: 5,
        },
        {
          id: '2',
          question: 'What are Piaget\'s four stages of cognitive development?',
          answer: '1) Sensorimotor (0-2 years), 2) Preoperational (2-7 years), 3) Concrete Operational (7-11 years), 4) Formal Operational (12+ years).',
          category: 'Developmental Psychology',
          difficulty: 'medium',
          isFavorite: false,
          lastReviewed: '3 days ago',
          reviewCount: 3,
        },
        {
          id: '3',
          question: 'What is the difference between classical and operant conditioning?',
          answer: 'Classical conditioning (Pavlov) associates stimuli with involuntary responses. Operant conditioning (Skinner) uses reinforcement/punishment to shape voluntary behavior.',
          category: 'General Psychology',
          difficulty: 'medium',
          isFavorite: true,
          lastReviewed: '2 days ago',
          reviewCount: 8,
        },
        {
          id: '4',
          question: 'What are the DSM-5-TR criteria for Major Depressive Disorder?',
          answer: 'Five or more of the following symptoms present for 2+ weeks: depressed mood, loss of interest, significant weight change, insomnia/hypersomnia, psychomotor agitation/retardation, fatigue, feelings of worthlessness, diminished concentration, or suicidal ideation.',
          category: 'Abnormal Psychology',
          difficulty: 'board',
          isFavorite: false,
          lastReviewed: '1 week ago',
          reviewCount: 2,
        },
        {
          id: '5',
          question: 'What is the biological basis of memory?',
          answer: 'Memory involves synaptic plasticity, particularly long-term potentiation (LTP) in the hippocampus. Neurotransmitters like glutamate and acetylcholine play key roles.',
          category: 'Biological Psychology',
          difficulty: 'hard',
          isFavorite: false,
          lastReviewed: '5 days ago',
          reviewCount: 4,
        },
        {
          id: '6',
          question: 'What is social facilitation?',
          answer: 'Social facilitation is the tendency to perform better on simple or well-learned tasks when others are present. It is a concept in social psychology.',
          category: 'Social Psychology',
          difficulty: 'easy',
          isFavorite: true,
          lastReviewed: 'Today',
          reviewCount: 6,
        },
      ]
      setFlashcards(mockFlashcards)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const filteredFlashcards = flashcards.filter(flashcard => {
    const matchesSearch = flashcard.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       flashcard.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || flashcard.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateFlashcard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFlashcard.question.trim() || !newFlashcard.answer.trim()) return
    
    const newFlashcardData = {
      id: `flashcard-${Date.now()}`,
      question: newFlashcard.question,
      answer: newFlashcard.answer,
      category: newFlashcard.category,
      difficulty: newFlashcard.difficulty,
      isFavorite: false,
      lastReviewed: 'Just now',
      reviewCount: 0,
    }
    
    setFlashcards([newFlashcardData, ...flashcards])
    setShowCreateModal(false)
    setNewFlashcard({ 
      question: '', 
      answer: '', 
      category: 'General Psychology',
      difficulty: 'medium'
    })
  }

  const toggleFavorite = (id: string) => {
    setFlashcards(flashcards.map(flashcard => 
      flashcard.id === id ? { ...flashcard, isFavorite: !flashcard.isFavorite } : flashcard
    ))
  }

  const deleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter(flashcard => flashcard.id !== id))
  }

  const nextCard = () => {
    if (!studyMode || filteredFlashcards.length === 0) return
    setCurrentCardIndex((prev) => (prev + 1) % filteredFlashcards.length)
    setIsFlipped(false)
  }

  const previousCard = () => {
    if (!studyMode || filteredFlashcards.length === 0) return
    setCurrentCardIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length)
    setIsFlipped(false)
  }

  const currentCard = studyMode ? filteredFlashcards[currentCardIndex] : null

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
            Flashcards
          </motion.h1>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Master psychology concepts with spaced repetition
          </motion.p>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Toggle Study Mode */}
          <motion.button
            onClick={() => setStudyMode(!studyMode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              studyMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {studyMode ? 'Exit Study Mode' : 'Enter Study Mode'}
          </motion.button>

          {/* Search */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              placeholder="Search flashcards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-pill pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          </motion.div>

          {/* Create Button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-lg mr-1">+</span>
            New Card
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
            {filteredFlashcards.length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Total Cards
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
            {filteredFlashcards.filter(f => f.isFavorite).length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Favorites
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
            {filteredFlashcards.filter(f => f.difficulty === 'board').length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Board Exam
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
            {filteredFlashcards.reduce((sum, f) => sum + f.reviewCount, 0)}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Total Reviews
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Study Mode View */}
      {studyMode ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {currentCard && (
              <motion.div
                key={currentCard.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative w-full max-w-2xl mx-auto"
              >
                <motion.div
                  className={`card card-3d p-8 min-h-[300px] cursor-pointer relative preserve-3d ${
                    isFlipped ? 'bg-gradient-to-br from-purple-100 to-pink-100' : 'bg-white'
                  }`}
                  onClick={() => setIsFlipped(!isFlipped)}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Front Side (Question) */}
                  <AnimatePresence mode="wait">
                    {!isFlipped ? (
                      <motion.div
                        key="front"
                        initial={{ opacity: 0, rotateY: -90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: 90 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="absolute inset-0 p-8 flex flex-col justify-between"
                      >
                        <div>
                          <motion.div
                            className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <motion.span
                              className="text-2xl"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                            >
                              <HelpCircle size={18} />
                            </motion.span>
                            <motion.span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                difficulties.find(d => d.value === currentCard.difficulty)?.color || 'bg-slate-100'
                              } ${
                                difficulties.find(d => d.value === currentCard.difficulty)?.text || 'text-slate-700'
                              }`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                            >
                              {difficulties.find(d => d.value === currentCard.difficulty)?.label || 'Medium'}
                            </motion.span>
                          </motion.div>
                          
                          <motion.h3
                            className="text-2xl font-bold text-slate-800"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                          >
                            {currentCard.question}
                          </motion.h3>
                        </div>

                        <motion.div
                          className="flex items-center justify-between text-sm text-slate-400"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          <span>{currentCard.category}</span>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(currentCard.id)
                            }}
                            className={`text-xl ${
                              currentCard.isFavorite ? 'text-amber-500' : 'text-slate-300'
                            }`}
                            whileHover={{ scale: 1.2 }}
                          >
                            {currentCard.isFavorite ? '<Star size={16} />' : '<Star size={16} />'}
                          </motion.button>
                        </motion.div>

                        <motion.p
                          className="text-center text-slate-400 mt-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                          Click to reveal answer
                        </motion.p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="back"
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: -90 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="absolute inset-0 p-8 flex flex-col justify-between"
                      >
                        <div>
                          <motion.div
                            className="flex items-center gap-3 mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <motion.span
                              className="text-2xl"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: 0.3 }}
                            >
                              <Check size={18} />
                            </motion.span>
                            <motion.span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                difficulties.find(d => d.value === currentCard.difficulty)?.color || 'bg-slate-100'
                              } ${
                                difficulties.find(d => d.value === currentCard.difficulty)?.text || 'text-slate-700'
                              }`}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                            >
                              {difficulties.find(d => d.value === currentCard.difficulty)?.label || 'Medium'}
                            </motion.span>
                          </motion.div>
                          
                          <motion.h3
                            className="text-xl font-bold text-slate-800 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                          >
                            Answer
                          </motion.h3>
                          
                          <motion.p
                            className="text-slate-700 whitespace-pre-wrap"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            {currentCard.answer}
                          </motion.p>
                        </div>

                        <motion.div
                          className="flex items-center justify-between text-sm text-slate-400"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          <span>Reviewed {currentCard.reviewCount} times</span>
                          <span>Last: {currentCard.lastReviewed}</span>
                        </motion.div>

                        <motion.p
                          className="text-center text-slate-400 mt-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                          Click to flip back
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            className="flex justify-center gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <motion.button
              onClick={previousCard}
              className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl hover:bg-slate-50 transition-colors"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              ←
            </motion.button>
            
            <motion.div
              className="flex-1 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.span
                className="text-slate-500 text-sm"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {currentCardIndex + 1} / {filteredFlashcards.length}
              </motion.span>
            </motion.div>
            
            <motion.button
              onClick={nextCard}
              className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl hover:bg-slate-50 transition-colors"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        /* List View */
        isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="card h-32 skeleton"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        ) : filteredFlashcards.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredFlashcards.map((flashcard, index) => (
                <motion.div
                  key={flashcard.id}
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
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-xl flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Layers size={32} className="text-indigo-600" />
                      </motion.div>
                      
                      <motion.button
                        onClick={() => toggleFavorite(flashcard.id)}
                        className={`text-xl transition-colors ${
                          flashcard.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {flashcard.isFavorite ? '<Star size={16} />' : '<Star size={16} />'}
                      </motion.button>
                    </motion.div>

                    <motion.h3
                      className="font-bold text-slate-800 mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.2 }}
                    >
                      {flashcard.question}
                    </motion.h3>

                    <motion.div
                      className="flex items-center gap-2 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
                    >
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        difficulties.find(d => d.value === flashcard.difficulty)?.color || 'bg-slate-100'
                      } ${
                        difficulties.find(d => d.value === flashcard.difficulty)?.text || 'text-slate-700'
                      }`}>
                        {difficulties.find(d => d.value === flashcard.difficulty)?.label || 'Medium'}
                      </span>
                      <span className="text-xs text-slate-400">{flashcard.category}</span>
                    </motion.div>

                    <motion.p
                      className="text-sm text-slate-600 line-clamp-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.4 }}
                    >
                      {flashcard.answer}
                    </motion.p>

                    <motion.div
                      className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.5 }}
                    >
                      <span>Reviewed {flashcard.reviewCount} times</span>
                      <motion.button
                        onClick={() => deleteFlashcard(flashcard.id)}
                        className="hover:text-red-500 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </motion.div>
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
              <Layers size={32} className="text-indigo-600" />
            </motion.div>
            <motion.h3
              className="text-xl font-bold text-slate-800 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              No flashcards found
            </motion.h3>
            <motion.p
              className="text-slate-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Start by creating your first flashcard'}
            </motion.p>
          </motion.div>
        )
      )}

      {/* Create Flashcard Modal */}
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
                  Create New Flashcard
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

              <form onSubmit={handleCreateFlashcard} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Question
                  </label>
                  <textarea
                    value={newFlashcard.question}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
                    placeholder="Enter the question..."
                    className="textarea-solid"
                    rows={3}
                    autoFocus
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={newFlashcard.answer}
                    onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
                    placeholder="Enter the answer..."
                    className="textarea-solid"
                    rows={4}
                  />
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newFlashcard.category}
                      onChange={(e) => setNewFlashcard({ ...newFlashcard, category: e.target.value })}
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
                      value={newFlashcard.difficulty}
                      onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value as 'easy' | 'medium' | 'hard' | 'board' })}
                      className="input-solid"
                    >
                      {difficulties.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
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
                    Create Card
                  </motion.button>
                </motion.div>
              </form>
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
        <Plus size={28} className="text-white" />
      </motion.button>
    </motion.div>
  )
}
