import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, X, Plus } from 'lucide-react'

export function NotesPage() {
  const user = useUser()
  const [notes, setNotes] = useState<{
    id: string;
    title: string;
    content: string;
    category: string;
    color: string;
    createdAt: string;
    isFavorite: boolean;
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'General Psychology' })

  const categories = [
    'All',
    'General Psychology',
    'Cognitive Psychology',
    'Developmental Psychology',
    'Abnormal Psychology',
    'Social Psychology',
    'Biological Psychology',
    'Research Methods',
    'Clinical Notes',
  ]

  const noteColors = [
    'from-purple-100 to-pink-100',
    'from-blue-100 to-cyan-100',
    'from-emerald-100 to-teal-100',
    'from-amber-100 to-orange-100',
    'from-rose-100 to-pink-100',
  ]

  useEffect(() => {
    // Simulate loading notes
    const timer = setTimeout(() => {
      const mockNotes = [
        {
          id: '1',
          title: 'Cognitive Psychology Overview',
          content: 'Cognitive psychology is the study of mental processes such as attention, memory, perception, and problem-solving. It explores how people think, learn, remember, and process information.',
          category: 'Cognitive Psychology',
          color: noteColors[0],
          createdAt: '2 days ago',
          isFavorite: true,
        },
        {
          id: '2',
          title: 'Piaget Stages of Development',
          content: 'Jean Piaget proposed four stages of cognitive development: Sensorimotor (0-2), Preoperational (2-7), Concrete Operational (7-11), and Formal Operational (12+). Each stage represents a different level of thinking.',
          category: 'Developmental Psychology',
          color: noteColors[1],
          createdAt: '1 week ago',
          isFavorite: false,
        },
        {
          id: '3',
          title: 'DSM-5-TR Anxiety Disorders',
          content: 'Anxiety disorders include generalized anxiety disorder, panic disorder, social anxiety disorder, and specific phobias. Key feature is excessive fear or anxiety that is difficult to control.',
          category: 'Abnormal Psychology',
          color: noteColors[2],
          createdAt: '3 days ago',
          isFavorite: true,
        },
        {
          id: '4',
          title: 'Classical vs Operant Conditioning',
          content: 'Classical conditioning (Pavlov) associates stimuli with responses. Operant conditioning (Skinner) uses reinforcement and punishment to shape behavior.',
          category: 'General Psychology',
          color: noteColors[3],
          createdAt: '5 days ago',
          isFavorite: false,
        },
        {
          id: '5',
          title: 'Research Ethics Principles',
          content: 'Key principles: Informed consent, confidentiality, beneficence, non-maleficence, and justice. All research must respect participants rights and well-being.',
          category: 'Research Methods',
          color: noteColors[4],
          createdAt: '1 week ago',
          isFavorite: false,
        },
      ]
      setNotes(mockNotes)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title.trim()) return
    
    const newNoteData = {
      id: `note-${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      createdAt: 'Just now',
      isFavorite: false,
    }
    
    setNotes([newNoteData, ...notes])
    setShowCreateModal(false)
    setNewNote({ title: '', content: '', category: 'General Psychology' })
  }

  const toggleFavorite = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ))
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
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
            Smart Notes
          </motion.h1>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Organize and review your psychology knowledge
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
              placeholder="Search notes..."
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
            New Note
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

      {/* Notes Grid */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="card h-40 skeleton"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      ) : filteredNotes.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card card-3d group"
              >
                {/* Note Header */}
                <motion.div
                  className={`h-2 rounded-t-2xl bg-gradient-to-r ${note.color} mb-4`}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                />

                <div className="px-4 pb-4">
                  <motion.div
                    className="flex items-start justify-between mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                  >
                    <div className="flex-1">
                      <motion.h3
                        className="font-bold text-slate-800 mb-1 group-hover:text-purple-700 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                      >
                        {note.title}
                      </motion.h3>
                      <motion.p
                        className="text-xs text-slate-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                      >
                        {note.category}
                      </motion.p>
                    </div>

                    <motion.button
                      onClick={() => toggleFavorite(note.id)}
                      className={`text-xl transition-colors ${
                        note.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {note.isFavorite ? '<Star size={16} />' : '<Star size={16} />'}
                    </motion.button>
                  </motion.div>

                  <motion.p
                    className="text-sm text-slate-600 mb-4 line-clamp-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                  >
                    {note.content}
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-between text-xs text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                  >
                    <span>{note.createdAt}</span>
                    <motion.button
                      onClick={() => deleteNote(note.id)}
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
            <FileText size={32} className="text-indigo-600" />
          </motion.div>
          <motion.h3
            className="text-xl font-bold text-slate-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            No notes found
          </motion.h3>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Start by creating your first note'}
          </motion.p>
        </motion.div>
      )}

      {/* Create Note Modal */}
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
                  Create New Note
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

              <form onSubmit={handleCreateNote} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title..."
                    className="input-solid"
                    autoFocus
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Start typing your notes..."
                    className="textarea-solid"
                    rows={5}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    className="input-solid"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                    Create Note
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
