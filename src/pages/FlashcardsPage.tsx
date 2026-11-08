import { AIGenerator } from '../components/AIGenerator'
import {
  ArrowLeft, Brain, CaretLeft,
  CaretRight, Check, Cards as Layers,
  Plus, Shuffle, Sparkle, X, DownloadSimple, ChartBar
} from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReferenceStart, ReferenceTabs } from '../components/ReferenceUI'
import { StudyFlashcard } from '../components/StudyFlashcard'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { StudyCard, useStudyStore } from '../store'
import '../flashcards.css'

export function FlashcardsPage() {
  const { decks, cards, createDeck, deleteDeck, addCard, deleteCard, reviewCard } = useStudyStore()

  const [selectedDeckId, setSelectedDeckId] = useState<string>('')
  const location = useLocation(), navigate = useNavigate()
  const [showAI, setShowAI] = useState(false)
  const [deckError,setDeckError]=useState('')
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
    setSessionReviewedCount(0)
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
  const visibleDecks = decks.filter(deck => deck.id !== 'deck-all' && (deckView === 'all' || cards.some(card => card.deckId === deck.id && card.dueDate <= todayStr)))
  const selectedDeck = decks.find(deck => deck.id === selectedDeckId)
  return (
    <div className="reference-page ref-flashcards-page">
      <header className="ref-page-header"><div><h1>Flashcards</h1><p>{selectedDeck?'One question at a time. Reveal, recall, and rate your answer.':'Keep your concepts together. Choose a deck when you are ready to practice.'}</p></div><div className="flashcard-actions"><button className="ref-secondary" onClick={()=>setShowAI(true)}><Sparkle size={17}/>Generate with AI</button><button className="ref-primary" onClick={()=>setShowCreateDeckModal(true)}><Plus size={18}/>Create deck</button></div></header>
      <div className="ref-flashcards-layout" data-view={selectedDeck?'study':'decks'}>
        {!selectedDeck&&<section className="ref-deck-browser">
          {decks.some(deck=>deck.id!=='deck-all')?<>
            <div className="flashcard-browser-heading"><div><h2>Your decks</h2><p>{decks.filter(deck=>deck.id!=='deck-all').length} decks | {cards.filter(card=>card.dueDate<=todayStr).length} cards due today</p></div><ReferenceTabs items={[{id:'all',label:'All decks'},{id:'due',label:'Due for review'}]} value={deckView} onChange={setDeckView}/></div>
            <div className="ref-deck-grid">{visibleDecks.map((deck,index)=>{const deckCards=cards.filter(card=>card.deckId===deck.id),due=deckCards.filter(card=>card.dueDate<=todayStr).length;return <article className="ref-deck" key={deck.id}><button className="ref-deck-select" onClick={()=>{setSelectedDeckId(deck.id);setCurrentIndex(0);setIsFlipped(false);setSessionReviewedCount(0)}}><span className={'ref-icon tint-'+index%4}><Layers size={28}/></span><strong>{deck.name}</strong><small>{deck.category}</small><span className="flashcard-deck-meta"><span>{deckCards.length} cards</span><span>{due?due+' due':'Up to date'}</span></span><span className="flashcard-deck-open">{deckCards.length?'Study deck':'Add your first card'} <CaretRight size={16}/></span></button><details className="ref-item-menu"><summary aria-label={'Options for '+deck.name}>...</summary><button onClick={()=>deleteDeck(deck.id)}>Delete deck</button></details></article>})}</div>
            {!visibleDecks.length&&<ReferenceStart icon={<Check size={28}/>} title="You are caught up" action="Browse all decks" onAction={()=>setDeckView('all')}>No decks are due today. You can still practice any deck.</ReferenceStart>}
          </>:<section className="flashcard-welcome"><span className="flashcard-welcome-icon"><Layers size={38} weight="duotone"/></span><h2>Your first deck starts here</h2><p>A deck keeps related questions together. Add your own cards, or let AI draft them from a topic, a note, or an uploaded reading.</p><button className="ref-primary" onClick={()=>setShowCreateDeckModal(true)}>Create your first deck</button><ol><li><span>1</span>Create a deck</li><li><span>2</span>Add questions and answers</li><li><span>3</span>Flip, recall, repeat</li></ol></section>}
        </section>}
        {selectedDeck&&<section className="ref-panel ref-study-preview">
          {deckError&&<p role="alert" className="ref-form-error">{deckError}</p>}
          <div className="flashcard-study-navigation"><button className="ref-secondary" onClick={()=>{setSelectedDeckId('');setIsFlipped(false);setSessionReviewedCount(0)}}><ArrowLeft size={16}/>All decks</button><button className="ref-secondary" onClick={()=>setShowAddCardModal(true)}><Plus size={16}/>Add card</button></div>

          <div className="ref-panel-title"><span className="ref-icon tint-0"><Brain size={24} /></span><h2>{selectedDeck?.name || 'All decks'}</h2><span className="ref-tag tint-0">{selectedDeck?.category || 'General'}</span></div>
          <div className="ref-cloud-card">{totalCards>0&&<div className="ref-study-count"><button aria-label="Previous card" disabled={totalCards < 2} onClick={handlePrev}><CaretLeft size={17} /></button><span>{totalCards ? currentIndex % totalCards + 1 : 0} of {totalCards}</span><button aria-label="Next card" disabled={totalCards < 2} onClick={handleNext}><CaretRight size={17} /></button></div>}{currentCard ? <StudyFlashcard key={currentCard.id} question={currentCard.question} answer={currentCard.answer} category={currentCard.category} flipped={isFlipped} showHints={showHints} onFlip={() => setIsFlipped(value => !value)} onDelete={() => deleteCard(currentCard.id)} /> : <ReferenceStart icon={<Brain size={28}/>} title="Your practice space" action="Add card" onAction={()=>setShowAddCardModal(true)}>Add a question and answer to start. Reveal the answer, then rate your recall to schedule your next review.</ReferenceStart>}</div>
          {isFlipped && currentCard && <div className="ref-review-ratings">{(['again', 'hard', 'good', 'easy'] as const).map(rating => <button key={rating} className={rating} onClick={() => handleRating(rating)}>{rating}<small>{rating === 'again' ? 'Try again' : rating === 'hard' ? 'A little unsure' : rating === 'good' ? 'Got it' : 'Easy recall'}</small></button>)}</div>}
          {currentCard&&<div className="ref-study-footer"><button className="ref-secondary" disabled={totalCards < 2} onClick={() => { setCurrentIndex(Math.floor(Math.random() * Math.max(1, totalCards))); setIsFlipped(false) }}><Shuffle size={19} />Shuffle</button><button className="ref-secondary" onClick={handleEndStudySession}>Finish session</button></div>}
          {totalCards>0&&<div className="flashcard-deck-tools"><button className="ref-secondary" onClick={()=>{const text=activeDeckCards.map((card,index)=>(index+1)+'. '+card.question+'\n'+card.answer).join('\n\n');if(text.length>24500){setDeckError('This deck is too long for one quiz request. Use a smaller deck or a shorter excerpt.');return}navigate('/quizzes',{state:{studyText:text,sourceName:selectedDeck?.name||'Flashcards',category:selectedDeck?.category||'General Psychology'}})}}><ChartBar size={17}/>Quiz me on this deck</button><button className="ref-secondary" onClick={()=>{const data={version:1,name:selectedDeck?.name||'Flashcards',category:selectedDeck?.category,cards:activeDeckCards.map(({question,answer})=>({question,answer}))},url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download=(selectedDeck?.name||'flashcards').replace(/[^a-zA-Z0-9_-]/g,'_')+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}}><DownloadSimple size={17}/>Download deck</button></div>}
          {totalCards>0&&<details className="ref-study-options"><summary>Study options · {overallPercentage}% mastered</summary><label><input type="checkbox" checked={showHints} onChange={e => setShowHints(e.target.checked)} />Show hints</label><p>Your ratings automatically schedule the next review using spaced repetition.</p><p>{masteredCardsCount} mastered · {learningCardsCount} learning · {dueCardsCount} due</p></details>}
        </section>}
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
                  setSelectedDeckId('')
                }}
                className="w-full py-2.5 rounded-full text-xs font-bold text-white shadow-md shadow-pink-500/20"
                style={{ background: 'linear-gradient(135deg, #FF6EA7 0%, #FF3385 100%)' }}
              >
                Back to decks
              </button>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>
      {showAI && <AIGenerator task="flashcards" category={selectedDeck?.category || 'General Psychology'} onClose={() => setShowAI(false)} onSave={(draft,settings) => { const category = settings.category; const id = createDeck(draft.title, category); draft.cards.forEach(card => addCard(id, card.question, card.answer, category)); setSelectedDeckId(id); setSessionReviewedCount(0); setShowAI(false); setCurrentIndex(0); setIsFlipped(false) }}/>}
    </div>
  )
}
