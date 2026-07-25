import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket, Sparkles, Brain, HelpCircle, Layers, BookOpen, Mail, Clock,
  List, Headphones, ChevronDown, Book, Plus, ArrowRight, User, MessageCircle
} from 'lucide-react'

export function HelpPage() {
  const user = useUser()
  const [activeSection, setActiveSection] = useState('getting-started')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: <Rocket size={20} /> },
    { id: 'features', label: 'Features', icon: <Sparkles size={20} /> },
    { id: 'mindy', label: 'Mindy AI', icon: <Brain size={20} /> },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: <HelpCircle size={20} /> },
    { id: 'contact', label: 'Contact & Support', icon: <MessageCircle size={20} /> },
  ]

  const faqs = [
    {
      id: '1',
      question: 'How do I create my first study session?',
      answer: 'Navigate to the Dashboard and click on "New Study Session" or go to the Mindy chat and ask Mindy to help you create a study plan. Mindy will guide you through setting up your first session.',
      category: 'getting-started'
    },
    {
      id: '2',
      question: 'Can I import documents for Smart Notes?',
      answer: 'Yes! In the Smart Notes section, click "Upload Document" and you can import PDFs, DOCX, PPT, and images. Mindy will automatically summarize and extract key concepts for you.',
      category: 'features'
    },
    {
      id: '3',
      question: 'How does the AI Tutor work?',
      answer: 'Mindy uses advanced AI models to explain psychology concepts, compare theories, and answer academic questions. Simply type your question in the Mindy chat, and she will provide detailed, evidence-based answers.',
      category: 'mindy'
    },
    {
      id: '4',
      question: 'What is Spaced Repetition in Flashcards?',
      answer: 'Spaced Repetition is a learning technique that shows you flashcards at optimal intervals to maximize retention. The system automatically schedules cards based on your performance.',
      category: 'features'
    },
    {
      id: '5',
      question: 'How accurate is the Research Assistant?',
      answer: 'The Research Assistant uses trusted sources like APA, WHO, PubMed, and NIH. While it provides summaries and citations, always verify critical information with official sources.',
      category: 'mindy'
    },
    {
      id: '6',
      question: 'I can\'t see my client data. What should I do?',
      answer: 'Client data is only visible to Professional users. If you\'re a student, you won\'t have access to client management features. If you\'re a professional, ensure you\'re logged in with the correct account.',
      category: 'troubleshooting'
    },
    {
      id: '7',
      question: 'How do I reset my password?',
      answer: 'Go to the Login page and click "Forgot Password". Follow the instructions sent to your email. If you don\'t receive the email, check your spam folder or contact support.',
      category: 'troubleshooting'
    },
    {
      id: '8',
      question: 'Can I use Psykie offline?',
      answer: 'Currently, Psykie requires an internet connection as it uses cloud-based AI services. Offline mode is planned for Version 2.0.',
      category: 'features'
    },
  ]

  const filteredFAQs = activeSection === 'getting-started' 
    ? faqs.filter(f => f.category === 'getting-started')
    : activeSection === 'features' 
      ? faqs.filter(f => f.category === 'features')
      : activeSection === 'mindy' 
        ? faqs.filter(f => f.category === 'mindy')
        : activeSection === 'troubleshooting' 
          ? faqs.filter(f => f.category === 'troubleshooting')
          : faqs.filter(f => f.category === 'contact' || f.category === 'troubleshooting')

  const quickGuides = [
    {
      title: 'Create Your First Quiz',
      steps: ['Go to Quizzes page', 'Click "Create Quiz"', 'Select question type', 'Add questions', 'Start quiz'],
      icon: <HelpCircle size={20} />
    },
    {
      title: 'Generate Flashcards',
      steps: ['Go to Smart Notes', 'Upload a document', 'Click "Generate Flashcards"', 'Review and edit', 'Start studying'],
      icon: <Layers size={20} />
    },
    {
      title: 'Chat with Mindy',
      steps: ['Go to Mindy page', 'Type your question', 'Wait for response', 'Ask follow-ups', 'Save conversation'],
      icon: <Brain size={20} />
    },
  ]

  const contactMethods = [
    { type: 'Email', value: 'support@psykie.com', icon: <Mail size={20} /> },
    { type: 'Discord', value: 'join.psykie.discord', icon: <MessageCircle size={20} /> },
    { type: 'Response Time', value: '24-48 hours', icon: <Clock size={20} /> },
  ]

  return (
    <motion.div
      className="min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center gap-4 mb-4"
          whileHover={{ x: 4 }}
        >
          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <HelpCircle size={28} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Help Center</h1>
            <p className="text-slate-500 mt-1">How can we assist you today?</p>
          </div>
        </motion.div>
        
        <motion.p
          className="text-slate-600 max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Welcome to Psykie's Help Center! Here you'll find answers to frequently asked questions, 
          quick start guides, and contact information for support.
        </motion.p>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Left Sidebar Navigation */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="liquid-glass p-1 rounded-2xl"
            whileHover={{ scale: 1.01 }}
          >
            <div className="space-y-2">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all duration-300 text-left ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-white/50 hover:text-purple-600'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  animate={activeSection === section.id ? { 
                    scale: [1, 1.02, 1],
                    backgroundColor: ['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.1)']
                  } : {}}
                  transition={activeSection === section.id ? { duration: 2, repeat: Infinity } : {}}
                >
                  <motion.span 
                    className="text-xl"
                    animate={activeSection === section.id ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {section.icon}
                  </motion.span>
                  <span>{section.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Quick Guides Card */}
          <motion.div
            className="mt-6 liquid-glass p-1 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="p-6">
              <motion.h3
                className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <List size={20} className="text-indigo-500" /> Quick Guides
              </motion.h3>
              <div className="space-y-4">
                {quickGuides.map((guide, index) => (
                  <motion.div
                    key={guide.title}
                    className="card p-4 bg-white/50 border border-white/20 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <motion.div
                      className="flex items-start gap-3"
                    >
                      <span className="text-2xl">{guide.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">{guide.title}</h4>
                        <div className="mt-2 space-y-1">
                          {guide.steps.map((step, i) => (
                            <motion.p
                              key={i}
                              className="text-sm text-slate-500 flex items-center gap-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.7 + i * 0.05 }}
                            >
                              <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 flex-shrink-0"></span>
                              {step}
                            </motion.p>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            className="mt-6 liquid-glass p-1 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="p-6">
              <motion.h3
                className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Headphones size={20} className="text-indigo-500" /> Support
              </motion.h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={method.type}
                    className="flex items-center gap-4 p-3 bg-white/50 border border-white/20 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="text-sm text-slate-500">{method.type}</p>
                      <p className="font-semibold text-slate-800">{method.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="liquid-glass p-1 rounded-2xl min-h-[600px]"
            whileHover={{ scale: 1.005 }}
          >
            <div className="p-8">
              {/* Section Title */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.h2
                    className="text-2xl font-bold text-slate-800 mb-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {sections.find(s => s.id === activeSection)?.label}
                  </motion.h2>
                  <motion.p
                    className="text-slate-500 mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {activeSection === 'getting-started' && 'Get started with Psykie and learn the basics'}
                    {activeSection === 'features' && 'Explore all the powerful features Psykie offers'}
                    {activeSection === 'mindy' && 'Learn how to make the most of your AI assistant'}
                    {activeSection === 'troubleshooting' && 'Find solutions to common issues'}
                    {activeSection === 'contact' && 'Get in touch with our support team'}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              {/* FAQ List */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {filteredFAQs.length > 0 ? (
                      filteredFAQs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          className="border-b border-white/20 pb-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <motion.button
                            onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                            className="w-full flex items-start justify-between gap-4 text-left"
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className="flex-1">
                              <motion.h3
                                className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <HelpCircle size={18} className="text-indigo-500" />
                                {faq.question}
                              </motion.h3>
                              <AnimatePresence>
                                {expandedFAQ === faq.id && (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-slate-600 pl-7 overflow-hidden"
                                  >
                                    {faq.answer}
                                  </motion.p>
                                )}
                              </AnimatePresence>
                            </div>
                            <motion.span
                              className="text-purple-400 mt-1 flex-shrink-0"
                              animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown size={20} />
                            </motion.span>
                          </motion.button>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <Book size={32} className="text-indigo-500" />
                        </motion.div>
                        <p className="text-slate-500">No FAQs found for this section</p>
                        <p className="text-sm text-slate-400 mt-2">Try selecting a different category</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="fixed bottom-6 right-6 z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.div
          className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-100/50 to-pink-100/50 backdrop-blur-xl border border-white/20"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </motion.div>

      <motion.div
        className="fixed bottom-12 left-12 z-20"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100/50 to-cyan-100/50 backdrop-blur-xl border border-white/20"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
      </motion.div>
    </motion.div>
  )
}
