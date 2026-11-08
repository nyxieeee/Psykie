import { AIGenerator } from '../components/AIGenerator'
import {
  ArrowRight, BookOpen, Brain, CaretLeft,
  CaretRight, ChartBar, Check, Fire, Cards as Layers,
  Plus, Shuffle, Sparkle, X
} from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReferenceStart, ReferenceHeader, ReferenceTabs } from '../components/ReferenceUI'
import { StudyFlashcard } from '../components/StudyFlashcard'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { StudyCard, useStudyStore } from '../store'

export function FlashcardsPage() {
  const { decks, cards, createDeck, deleteDeck, addCard, deleteCard, reviewCard } = useStudyStore()

  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks.find(deck => deck.id !== 'deck-all')?.id || 'deck-all')
  const location = useLocation(), navigate = useNavigate()
  const [showAI, setShowAI] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const state = location.state as {deckId?: string;cardId?:string} | null
    const target = cards.find(card=>card.id===state?.cardId)
    const id = target?.deckId || state?.deckId
    if (!id || !decks.some(deck => deck.id === id)) return
    setSelectedDeckId(id); setCurrentIndex(target ? Math.max(0,cards.filter(card=>id==='deck-all'||card.deckId===id).findIndex(card=>card.id===target.id)) : 0); setIsFlipped(false)
    navigate(location.pathname, {replace:true,state:null})
  }, [location.state, location.pathname, navigate, decks, cards])

  // Deck Settings Toggles
  const [showHints, setShowHints] = useState(false)

  // Modals
  const [showCreateDeckModal, setShowCreateDeckModal] = useState(false)
  const [newDeckName, setNewDeckName] = useState('')
  const [newDeckCategory, setNewDeckCategory] = useState('Cognitive Psychology')

  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')

  // Study summary session state
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0)
  const [showSessionEndModal, setShowSessionEndModal] = useState(false)

  // Filter cards by selected deck
  const activeDeckCards: StudyCard[] =
    selectedDeckId === 'deck-all'
      ? cards
      : cards.filter((c) => c.deckId === selectedDeckId)

  const currentCard: StudyCard | undefined =
    activeDeckCards.length > 0 ? activeDeckCards[currentIndex % activeDeckCards.length] : undefined

  // Dynamic progress stats
  const totalCards = activeDeckCards.length
  const today = new Date(), todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const dueCardsCount = activeDeckCards.filter((c) => c.dueDate <= todayStr).length
  const masteredCardsCount = activeDeckCards.filter((c) => c.status === 'mastered').length
  const learningCardsCount = activeDeckCards.filter((c) => c.status !== 'mastered').length
  const overallPercentage = totalCards > 0 ? Math.round((masteredCardsCount / totalCards) * 100) : 0

  const handleNext = () => {
    setIsFlipped(false)
    if (activeDeckCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % activeDeckCards.length)
    }
  }

  const handlePrev = () => {
    setIsFlipped(false)
    if (activeDeckCards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + activeDeckCards.length) % activeDeckCards.length)
    }
  }

  const handleRating = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return
    reviewCard(currentCard.id, rating)
    setSessionReviewedCount((prev) => prev + 1)
    handleNext()
  }

  const handleCreateDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDeckName.trim()) return

    const createdId = createDeck(newDeckName.trim(), newDeckCategory)
    setSelectedDeckId(createdId)
    setCurrentIndex(0)
    setIsFlipped(false)
    setNewDeckName('')
    setShowCreateDeckModal(false)
  }

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim() || !newAnswer.trim()) return

    const targetDeck = decks.find(deck => deck.id === selectedDeckId)?.id || decks[0]?.id || createDeck('My first deck', 'General Psychology')
    setSelectedDeckId(targetDeck)
    addCard(targetDeck, newQuestion.trim(), newAnswer.trim())
    setNewQuestion('')
    setNewAnswer('')
    setShowAddCardModal(false)
  }

  const handleEndStudySession = () => {
    setShowSessionEndModal(true)
  }

  const [deckView, setDeckView] = useState('all')
  const [reviewing, setReviewing] = useState(false)
  const visibleDecks = decks.filter(deck => deck.id !== 'deck-all' && (deckView === 'all' || cards.some(card => card.deckId === deck.id && card.dueDate <= todayStr)))
  const selectedDeck = decks.find(deck => deck.id === selectedDeckId)
  return (
    <div className="reference-page ref-flashcards-page">
      <ReferenceHeader title="Flashcards" subtitle="Turn key concepts into lasting knowledge." action="Create deck" onAction={() => setShowCreateDeckModal(true)} />
      <div className="ref-ai-page-actions"><button className="ref-secondary" onClick={() => setShowAI(true)}><Sparkle size={17}/>Generate with AI</button></div><div className="ref-flashcards-layout">
        <section className="ref-deck-browser">
          <div className="ref-stat-row">
            <div className="ref-stat"><span className="ref-icon tint-0"><Layers size={27} /></span><span><strong>{cards.filter(card => card.dueDate <= todayStr).length}</strong><small>cards due for review</small></span><CaretRight size={17} /></div>
            <div className="ref-stat"><span className="ref-icon tint-1"><ChartBar size={27} /></span><span><strong>{decks.filter(deck => deck.id !== 'deck-all').length}</strong><small>flashcard decks</small></span><CaretRight size={17} /></div>
            <div className="ref-stat"><span className="ref-icon tint-3"><Fire size={27} weight="duotone" /></span><span><strong>{useStudyStore.getState().studyStats.dayStreak}</strong><small>day streak</small></span></div>
          </div>
          <ReferenceTabs items={[{ id: 'all', label: 'All decks' }, { id: 'due', label: 'Due for review' }]} value={deckView} onChange={setDeckView} />
          <div className="ref-deck-grid">{visibleDecks.map((deck, index) => { const deckCards = cards.filter(card => card.deckId === deck.id); const due = deckCards.filter(card => card.dueDate <= todayStr).length; const mastered = deckCards.filter(card => card.status === 'mastered').length; return <article key={deck.id} className={selectedDeckId === deck.id ? 'ref-deck selected' : 'ref-deck'}><button className="ref-deck-select" onClick={() => { setSelectedDeckId(deck.id); setCurrentIndex(0); setIsFlipped(false); setReviewing(false) }}><span className={'ref-icon tint-' + index % 4}>{index % 3 === 0 ? <Brain size={29} /> : index % 3 === 1 ? <Sparkle size={29} /> : <BookOpen size={29} />}</span><strong>{deck.name}</strong><small>{deckCards.length} cards</small><span className="ref-deck-progress"><span style={{ width: (deckCards.length ? mastered / deckCards.length * 100 : 0) + '%' }} /></span><span className="ref-deck-due">{due} due</span></button><details className="ref-item-menu"><summary aria-label={'Options for ' + deck.name}>···</summary><button onClick={() => { deleteDeck(deck.id); if (selectedDeckId === deck.id) setSelectedDeckId('deck-all') }}>Delete deck</button></details></article> })}</div>
          {!visibleDecks.length && <ReferenceStart icon={<Layers size={28}/>} title={deckView==='due'?'You are caught up':'Make your first connections'} action={deckView==='due'?'Browse all decks':'Create your first deck'} onAction={()=>deckView==='due'?setDeckView('all'):setShowCreateDeckModal(true)}>{deckView==='due'?'No decks are due today. You can still practice any deck.':'Start with a few concepts, or generate cards from a reading using AI.'}</ReferenceStart>}
          <button className="ref-text-action ref-browser-footer" onClick={() => setShowAddCardModal(true)}><Plus size={16} />Add a card to your collection</button>
        </section>
        <section className="ref-panel ref-study-preview">
          <div className="ref-panel-title"><span className="ref-icon tint-0"><Brain size={24} /></span><h2>{selectedDeck?.name || 'All decks'}</h2><span className="ref-tag tint-0">{selectedDeck?.category || 'General'}</span><button aria-label="Add card" onClick={() => setShowAddCardModal(true)}><Plus size={19} /></button></div>
          {!!decks.length&&<label className="ref-study-picker"><span>Studying</span><select aria-label="Study deck" value={selectedDeckId} onChange={e => { setSelectedDeckId(e.target.value); setCurrentIndex(0); setIsFlipped(false) }}>{decks.map(deck => <option key={deck.id} value={deck.id}>{deck.name}</option>)}</select></label>}
          <div className="ref-cloud-card">{totalCards>0&&<div className="ref-study-count"><button aria-label="Previous card" disabled={totalCards < 2} onClick={handlePrev}><CaretLeft size={17} /></button><span>{totalCards ? currentIndex % totalCards + 1 : 0} of {totalCards}</span><button aria-label="Next card" disabled={totalCards < 2} onClick={handleNext}><CaretRight size={17} /></button></div>}{currentCard ? <StudyFlashcard key={currentCard.id} question={currentCard.question} answer={currentCard.answer} category={currentCard.category} flipped={isFlipped} showHints={showHints} onFlip={() => setIsFlipped(value => !value)} onDelete={() => deleteCard(currentCard.id)} /> : <ReferenceStart icon={<Brain size={28}/>} title="Your practice space" action="Add card" onAction={()=>setShowAddCardModal(true)}>Add a question and answer to start. Reveal the answer, then rate your recall to schedule your next review.</ReferenceStart>}</div>
          {(reviewing || isFlipped) && currentCard && <div className="ref-review-ratings">{(['again', 'hard', 'good', 'easy'] as const).map(rating => <button key={rating} className={rating} onClick={() => handleRating(rating)}>{rating}<small>{rating === 'again' ? 'Try again' : rating === 'hard' ? 'A little unsure' : rating === 'good' ? 'Got it' : 'Easy recall'}</small></button>)}</div>}
          {currentCard&&<div className="ref-study-footer"><button className="ref-secondary" disabled={totalCards < 2} onClick={() => { setCurrentIndex(Math.floor(Math.random() * Math.max(1, totalCards))); setIsFlipped(false) }}><Shuffle size={19} />Shuffle</button><button className="ref-primary" disabled={!currentCard} onClick={() => { setReviewing(true); setIsFlipped(false) }}>Start review<ArrowRight size={18} /></button></div>}
          {totalCards>0&&<details className="ref-study-options"><summary>Study options · {overallPercentage}% mastered</summary><label><input type="checkbox" checked={showHints} onChange={e => setShowHints(e.target.checked)} />Show hints</label><p>Your ratings automatically schedule the next review using spaced repetition.</p><p>{masteredCardsCount} mastered · {learningCardsCount} learning · {dueCardsCount} due</p><button className="ref-text-action" onClick={handleEndStudySession}>End Study Session</button></details>}
        </section>
      </div>
      <AnimatePresence>
        {showCreateDeckModal && (
          <ViewportOverlay onDismiss={() => setShowCreateDeckModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-pink-100 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-neutral-800">Create New Deck</h3>
                <button onClick={() => setShowCreateDeckModal(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <form onSubmit={handleCreateDeckSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Deck Name</label>
                  <input
                    type="text"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="e.g. Biological Bases of Behavior"
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Subject Category</label>
                  <select
                    value={newDeckCategory}
                    onChange={(e) => setNewDeckCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
                  >
                    <option value="Cognitive Psychology">Cognitive Psychology</option>
                    <option value="Developmental Psychology">Developmental Psychology</option>
                    <option value="Abnormal Psychology">Abnormal Psychology</option>
                    <option value="Research Methods">Research Methods</option>
                    <option value="Social Psychology">Social Psychology</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateDeckModal(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 shadow-md shadow-pink-500/20"
                  >
                    Create Deck
                  </button>
                </div>
              </form>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>

      {/* ── Modal: Add Flashcard ── */}
      <AnimatePresence>
        {showAddCardModal && (
          <ViewportOverlay onDismiss={() => setShowAddCardModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-pink-100 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-neutral-800">Add New Flashcard</h3>
                <button onClick={() => setShowAddCardModal(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <form onSubmit={handleAddCardSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Front: Question / Prompt</label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="e.g. What is the Yerkes-Dodson Law?"
                    rows={2}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-600 block mb-1">Back: Answer / Explanation</label>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="e.g. Performance increases with physiological or mental arousal, but only up to an optimal point..."
                    rows={3}
                    className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCardModal(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95 shadow-md shadow-pink-500/20"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>

      {/* ── Modal: Session End Summary ── */}
      <AnimatePresence>
        {showSessionEndModal && (
          <ViewportOverlay onDismiss={() => setShowSessionEndModal(false)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border border-pink-100 space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 mx-auto flex items-center justify-center">
                <Check size={28} weight="bold" />
              </div>
              <h3 className="text-lg font-black text-neutral-800">Session Complete!</h3>
              <p className="text-xs font-semibold text-neutral-500">
                You reviewed <span className="text-pink-600 font-black">{sessionReviewedCount} cards</span> in this active recall session. Your memory consolidation is advancing!
              </p>
              <button
                onClick={() => {
                  setSessionReviewedCount(0)
                  setShowSessionEndModal(false)
                }}
                className="w-full py-2.5 rounded-full text-xs font-bold text-white shadow-md shadow-pink-500/20"
                style={{ background: 'linear-gradient(135deg, #FF6EA7 0%, #FF3385 100%)' }}
              >
                Back to Dashboard
              </button>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>
      {showAI && <AIGenerator task="flashcards" category={selectedDeck?.category || 'General Psychology'} onClose={() => setShowAI(false)} onSave={(draft,settings) => { const category = settings.category; const id = createDeck(draft.title, category); draft.cards.forEach(card => addCard(id, card.question, card.answer, category)); setSelectedDeckId(id); setShowAI(false); setCurrentIndex(0); setIsFlipped(false) }}/>}
    </div>
  )
}
