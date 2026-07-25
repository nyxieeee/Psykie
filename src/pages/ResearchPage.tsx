import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, FlaskConical, X, Search, List, Trash2, Star } from 'lucide-react'

export function ResearchPage() {
  const user = useUser()
  const [researchPapers, setResearchPapers] = useState<{
    id: string;
    title: string;
    authors: string[];
    journal?: string;
    year?: number;
    abstract?: string;
    summary?: string;
    tags: string[];
    citation?: string;
    url?: string;
    createdAt: string;
    isFavorite: boolean;
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [newPaper, setNewPaper] = useState({ 
    title: '', 
    authors: '',
    journal: '',
    year: 2024,
    url: '',
    tags: ''
  })

  const allTags = [
    'All',
    'Cognitive Psychology',
    'Neuroscience',
    'Clinical Psychology',
    'Developmental',
    'Social Psychology',
    'Abnormal Psychology',
    'Biological Psychology',
    'Research Methods',
    'Statistics',
    'Therapy',
    'Assessment',
    'Personality',
    'Behavioral',
  ]

  useEffect(() => {
    // Simulate loading research papers
    const timer = setTimeout(() => {
      const mockPapers = [
        {
          id: '1',
          title: 'The Neural Mechanisms of Memory Consolidation',
          authors: ['Smith, J.', 'Johnson, A.', 'Williams, M.'],
          journal: 'Journal of Neuroscience',
          year: 2023,
          abstract: 'This study explores the neural pathways involved in memory consolidation during sleep, focusing on the role of the hippocampus and prefrontal cortex.',
          summary: 'Key findings: Hippocampal replay during REM sleep is crucial for memory consolidation. The prefrontal cortex helps stabilize these memories over time.',
          tags: ['Neuroscience', 'Memory', 'Biological Psychology'],
          citation: 'Smith, J., Johnson, A., & Williams, M. (2023). The neural mechanisms of memory consolidation. Journal of Neuroscience, 43(15), 1234-1256. https://doi.org/xxxx',
          url: 'https://doi.org/xxxx',
          createdAt: '2 weeks ago',
          isFavorite: true,
        },
        {
          id: '2',
          title: 'Effectiveness of Cognitive Behavioral Therapy for Anxiety Disorders: A Meta-Analysis',
          authors: ['Brown, K.', 'Davis, L.', 'Miller, R.'],
          journal: 'Journal of Clinical Psychology',
          year: 2022,
          abstract: 'Meta-analysis of 50+ studies examining CBT effectiveness for various anxiety disorders. Results show significant improvement in symptom reduction.',
          summary: 'CBT shows 60-70% success rate in treating anxiety disorders. Most effective for generalized anxiety and social anxiety.',
          tags: ['Clinical Psychology', 'Therapy', 'CBT', 'Anxiety'],
          citation: 'Brown, K., Davis, L., & Miller, R. (2022). Effectiveness of CBT for anxiety disorders...',
          createdAt: '1 month ago',
          isFavorite: true,
        },
        {
          id: '3',
          title: 'The Impact of Social Media on Adolescent Mental Health',
          authors: ['Wilson, S.', 'Taylor, P.'],
          journal: 'Developmental Psychology',
          year: 2024,
          abstract: 'Longitudinal study examining the correlation between social media use and mental health outcomes in adolescents aged 12-18.',
          summary: 'Excessive social media use (>4 hours/day) correlates with increased anxiety and depression symptoms. Social comparison is a key mediator.',
          tags: ['Developmental', 'Social Psychology', 'Mental Health'],
          citation: 'Wilson, S., & Taylor, P. (2024). The impact of social media on adolescent mental health...',
          createdAt: '3 days ago',
          isFavorite: false,
        },
        {
          id: '4',
          title: 'Advances in Neuroimaging Techniques for Psychological Research',
          authors: ['Chen, L.', 'Garcia, M.', 'Thompson, S.'],
          journal: 'Nature Reviews Neuroscience',
          year: 2023,
          abstract: 'Review of emerging neuroimaging techniques including fNIRS, high-resolution fMRI, and advanced EEG methods for psychological research.',
          summary: 'New techniques allow for better temporal and spatial resolution in studying brain function. fNIRS shows promise for portable, affordable neuroimaging.',
          tags: ['Neuroscience', 'Research Methods', 'Biological Psychology'],
          citation: 'Chen, L., Garcia, M., & Thompson, S. (2023). Advances in neuroimaging techniques...',
          createdAt: '1 week ago',
          isFavorite: false,
        },
      ]
      setResearchPapers(mockPapers)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const filteredPapers = researchPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       paper.authors.join(' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
                       paper.abstract?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       paper.tags.join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTag = selectedTag === 'all' || paper.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const handleUploadPaper = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPaper.title.trim()) return
    
    const newPaperData = {
      id: `paper-${Date.now()}`,
      title: newPaper.title,
      authors: newPaper.authors.split(',').map(a => a.trim()),
      journal: newPaper.journal,
      year: newPaper.year,
      url: newPaper.url,
      tags: newPaper.tags.split(',').map(t => t.trim()),
      createdAt: 'Just now',
      isFavorite: false,
    }
    
    setResearchPapers([newPaperData, ...researchPapers])
    setShowUploadModal(false)
    setNewPaper({ 
      title: '', 
      authors: '',
      journal: '',
      year: 2024,
      url: '',
      tags: ''
    })
  }

  const toggleFavorite = (id: string) => {
    setResearchPapers(researchPapers.map(paper => 
      paper.id === id ? { ...paper, isFavorite: !paper.isFavorite } : paper
    ))
  }

  const deletePaper = (id: string) => {
    setResearchPapers(researchPapers.filter(paper => paper.id !== id))
  }

  const generateCitation = (paperId: string) => {
    const paper = researchPapers.find(p => p.id === paperId)
    if (paper?.citation) {
      navigator.clipboard.writeText(paper.citation)
      // Show toast notification
    }
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
            Research Assistant
          </motion.h1>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Summarize papers, generate citations, and manage your research
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
            className="relative flex-1 max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              placeholder="Search research papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-pill pl-10 w-full"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          </motion.div>

          {/* Upload Button */}
          <motion.button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-lg mr-1">+</span>
            Upload
          </motion.button>

          {/* AI Generate Button */}
          <motion.button
            onClick={() => setShowGenerateModal(true)}
            className="btn-pink px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className="text-lg mr-1"><Sparkles size={18} /></span>
            AI Summarize
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Tags Filter */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {allTags.map((tag, index) => (
          <motion.button
            key={tag}
            onClick={() => setSelectedTag(tag.toLowerCase())}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedTag === tag.toLowerCase()
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
          >
            {tag}
          </motion.button>
        ))}
      </motion.div>

      {/* Quick Stats */}
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
            {filteredPapers.length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Papers
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
            {filteredPapers.filter(p => p.isFavorite).length}
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
            {new Date().getFullYear()}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Recent Year
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
            {filteredPapers.reduce((sum, p) => sum + p.authors.length, 0)}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Authors
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Research Papers List */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="card h-32 skeleton"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      ) : filteredPapers.length > 0 ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card card-3d"
              >
                <div className="p-4">
                  <motion.div
                    className="flex items-start justify-between mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                  >
                    <div className="flex-1">
                      <motion.h3
                        className="font-bold text-slate-800 text-lg mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      >
                        {paper.title}
                      </motion.h3>
                      
                      <motion.div
                        className="flex items-center gap-4 text-sm text-slate-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                      >
                        <span>{paper.authors.join(', ')}</span>
                        <span className="text-slate-300">|</span>
                        <span>{paper.journal} {paper.year && `, ${paper.year}`}</span>
                      </motion.div>
                    </div>

                    <motion.button
                      onClick={() => toggleFavorite(paper.id)}
                      className={`text-xl transition-colors ${
                        paper.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {paper.isFavorite ? <Star size={16} className="text-yellow-400 fill-yellow-400" /> : <Star size={16} className="text-slate-300" />}
                    </motion.button>
                  </motion.div>

                  {paper.abstract && (
                    <motion.p
                      className="text-sm text-slate-600 mb-4 line-clamp-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                    >
                      {paper.abstract}
                    </motion.p>
                  )}

                  <motion.div
                    className="flex items-center justify-between pt-3 border-t border-slate-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  >
                    <motion.div
                      className="flex items-center gap-2 flex-wrap"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                    >
                      {paper.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          className="px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 + 0.7 + tagIndex * 0.05 }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                    >
                      <motion.button
                        onClick={() => generateCitation(paper.id)}
                        className="text-slate-400 hover:text-purple-600 transition-colors text-sm"
                        whileHover={{ scale: 1.1 }}
                        title="Copy Citation"
                      >
                        <List size={16} />
                      </motion.button>
                      
                      {paper.url && (
                        <motion.a
                          href={paper.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 transition-colors text-sm"
                          whileHover={{ scale: 1.1 }}
                          title="Open Paper"
                        >
                          ↗️
                        </motion.a>
                      )}
                      
                      <motion.button
                        onClick={() => deletePaper(paper.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors text-sm"
                        whileHover={{ scale: 1.1 }}
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </motion.button>
                    </motion.div>
                  </motion.div>

                  {paper.summary && (
                    <motion.div
                      className="mt-4 p-3 bg-purple-50/50 rounded-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.8 }}
                    >
                      <motion.p
                        className="text-sm font-medium text-purple-700 mb-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.9 }}
                      >
                        AI Summary
                      </motion.p>
                      <motion.p
                        className="text-sm text-slate-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 1 }}
                      >
                        {paper.summary}
                      </motion.p>
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
            <FlaskConical size={32} className="text-indigo-600" />
          </motion.div>
          <motion.h3
            className="text-xl font-bold text-slate-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            No research papers found
          </motion.h3>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {searchQuery || selectedTag !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Upload your first paper or ask Mindy to help you find relevant research'}
          </motion.p>
        </motion.div>
      )}

      {/* Upload Paper Modal */}
      <AnimatePresence>
        {showUploadModal && (
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
                  Upload Research Paper
                </motion.h2>
                <motion.button
                  onClick={() => setShowUploadModal(false)}
                  className="text-2xl text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </motion.div>

              <form onSubmit={handleUploadPaper} className="space-y-4">
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
                    value={newPaper.title}
                    onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                    placeholder="Paper title..."
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
                    Authors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newPaper.authors}
                    onChange={(e) => setNewPaper({ ...newPaper, authors: e.target.value })}
                    placeholder="e.g., Smith, J., Johnson, A."
                    className="input-solid"
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
                      Journal
                    </label>
                    <input
                      type="text"
                      value={newPaper.journal}
                      onChange={(e) => setNewPaper({ ...newPaper, journal: e.target.value })}
                      placeholder="Journal name"
                      className="input-solid"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={newPaper.year}
                      onChange={(e) => setNewPaper({ ...newPaper, year: parseInt(e.target.value) || 2024 })}
                      min="1900"
                      max="2099"
                      className="input-solid"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL (optional)
                  </label>
                  <input
                    type="url"
                    value={newPaper.url}
                    onChange={(e) => setNewPaper({ ...newPaper, url: e.target.value })}
                    placeholder="https://doi.org/..."
                    className="input-solid"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newPaper.tags}
                    onChange={(e) => setNewPaper({ ...newPaper, tags: e.target.value })}
                    placeholder="e.g., Neuroscience, Memory, Cognitive"
                    className="input-solid"
                  />
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
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
                    Upload Paper
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Generate Modal */}
      <AnimatePresence>
        {showGenerateModal && (
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
                  AI Research Assistant
                </motion.h2>
                <motion.button
                  onClick={() => setShowGenerateModal(false)}
                  className="text-2xl text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.div
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Brain size={28} className="text-indigo-600" />
                  </motion.div>
                  <div>
                    <motion.h3
                      className="font-bold text-slate-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      Summarize a Research Paper
                    </motion.h3>
                    <motion.p
                      className="text-sm text-slate-500 mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      Upload a PDF or provide a URL, and I'll generate a summary, key findings, and citation.
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <BarChart3 size={18} />
                  </motion.div>
                  <div>
                    <motion.h3
                      className="font-bold text-slate-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      Generate APA Citation
                    </motion.h3>
                    <motion.p
                      className="text-sm text-slate-500 mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      Provide paper details, and I'll generate a properly formatted APA citation.
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Search size={28} className="text-indigo-600" />
                  </motion.div>
                  <div>
                    <motion.h3
                      className="font-bold text-slate-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      Find Related Research
                    </motion.h3>
                    <motion.p
                      className="text-sm text-slate-500 mt-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      Describe your research topic, and I'll help you find relevant papers from trusted sources.
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="btn-secondary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowUploadModal(true)}
        className="fab"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: 'spring', damping: 10, stiffness: 200 }}
      >
        📄
      </motion.button>
    </motion.div>
  )
}
