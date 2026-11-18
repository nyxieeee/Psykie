import { CollectionWelcome } from '../components/CollectionWelcome'
import { downloadWord, printFlashcards } from '../utils/studyExport'
import { plainText } from '../../supabase/functions/_shared/plainText'
import { AIGenerator, PSYCHOLOGY_SUBJECTS } from '../components/AIGenerator'
import {
  ArrowLeft, Brain, CaretLeft,
  CaretRight, Check, Cards as Layers,
  Plus, Shuffle, Sparkle, X, DownloadSimple, ChartBar
} from '@phosphor-icons/react'
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
    <div className="reference-page ref-flashcards-page" data-focused-reader={!!selectedDeck}>
      <header className="ref-page-header"><div><h1>Flashcards</h1><p>{selectedDeck?'One question at a time. Reveal, recall, and rate your answer.':'Keep your concepts together. Choose a deck when you are ready to practice.'}</p></div><div className="flashcard-actions">{decks.some(deck=>deck.id!=='deck-all')&&<button className="ref-secondary" onClick={()=>setShowAI(true)}><Sparkle size={17}/>Generate with AI</button>}<button className="ref-primary" onClick={()=>setShowCreateDeckModal(true)}><Plus size={18}/>Create deck</button></div></header>
      <div className="ref-flashcards-layout" data-view={selectedDeck?'study':'decks'}>
        {!selectedDeck&&<section className="ref-deck-browser">
          {decks.some(deck=>deck.id!=='deck-all')?<>
            <div className="flashcard-browser-heading"><div><h2>Your decks</h2><p>{decks.filter(deck=>deck.id!=='deck-all').length} decks | {cards.filter(card=>card.dueDate<=todayStr).length} cards due today</p></div><ReferenceTabs items={[{id:'all',label:'All decks'},{id:'due',label:'Due for review'}]} value={deckView} onChange={setDeckView}/></div>
            <div className="ref-deck-grid">{visibleDecks.map((deck,index)=>{const deckCards=cards.filter(card=>card.deckId===deck.id),due=deckCards.filter(card=>card.dueDate<=todayStr).length;return <article className="ref-deck" key={deck.id}><button className="ref-deck-select" onClick={()=>{setSelectedDeckId(deck.id);setCurrentIndex(0);setIsFlipped(false);setSessionReviewedCount(0)}}><span className={'ref-icon tint-'+index%4}><Layers size={28}/></span><strong>{plainText(deck.name)}</strong><small>{deck.category}</small><span className="flashcard-deck-meta"><span>{deckCards.length} cards</span><span>{due?due+' due':'Up to date'}</span></span><span className="flashcard-deck-open">{deckCards.length?'Study deck':'Add your first card'} <CaretRight size={16}/></span></button><details className="ref-item-menu"><summary aria-label={'Options for '+deck.name}>...</summary><button onClick={()=>deleteDeck(deck.id)}>Delete deck</button></details></article>})}</div>
            {!visibleDecks.length&&<ReferenceStart icon={<Check size={28}/>} title="You are caught up" action="Browse all decks" onAction={()=>setDeckView('all')}>No decks are due today. You can still practice any deck.</ReferenceStart>}
          </>:<CollectionWelcome eyebrow="SMALL CARDS. LASTING KNOWLEDGE." title="Your first deck starts here" icon={<Layers size={44} weight="duotone"/>} action="Create your first deck" onAction={()=>setShowCreateDeckModal(true)} secondary="Generate with AI" onSecondary={()=>setShowAI(true)} steps={['Choose what to learn','Build your deck','Flip, recall, repeat']}>Keep one topic together in a deck. Write your own questions, or turn a reading or lecture note into a set with AI.</CollectionWelcome>}
        </section>}
        {selectedDeck&&<section className="ref-panel ref-study-preview">
          {deckError&&<p role="alert" className="ref-form-error">{deckError}</p>}
          <div className="flashcard-study-navigation"><button className="ref-secondary" onClick={()=>{setSelectedDeckId('');setIsFlipped(false);setSessionReviewedCount(0)}}><ArrowLeft size={16}/>All decks</button>{totalCards>0&&<button className="ref-secondary" onClick={()=>setShowAddCardModal(true)}><Plus size={16}/>Add card</button>}</div>

          <div className="ref-panel-title"><span className="ref-icon tint-0"><Brain size={24} /></span><h2>{plainText(selectedDeck?.name || 'All decks')}</h2><span className="ref-tag tint-0">{selectedDeck?.category || 'General'}</span></div>
          <div className="ref-cloud-card">{totalCards>0&&<div className="ref-study-count"><button aria-label="Previous card" disabled={totalCards < 2} onClick={handlePrev}><CaretLeft size={17} /></button><span>{totalCards ? currentIndex % totalCards + 1 : 0} of {totalCards}</span><button aria-label="Next card" disabled={totalCards < 2} onClick={handleNext}><CaretRight size={17} /></button></div>}{currentCard ? <StudyFlashcard key={currentCard.id} question={currentCard.question} answer={currentCard.answer} category={currentCard.category} flipped={isFlipped} showHints={showHints} onFlip={() => setIsFlipped(value => !value)} onDelete={() => deleteCard(currentCard.id)} /> : <ReferenceStart icon={<Brain size={28}/>} title="Your practice space" action="Add card" onAction={()=>setShowAddCardModal(true)}>Add a question and answer to start. Reveal the answer, then rate your recall to schedule your next review.</ReferenceStart>}</div>
          {isFlipped && currentCard && <div className="ref-review-ratings">{(['again', 'hard', 'good', 'easy'] as const).map(rating => <button key={rating} className={rating} onClick={() => handleRating(rating)}>{rating}<small>{rating === 'again' ? 'Try again' : rating === 'hard' ? 'A little unsure' : rating === 'good' ? 'Got it' : 'Easy recall'}</small></button>)}</div>}
          {currentCard&&<div className="ref-study-footer"><button className="ref-secondary" disabled={totalCards < 2} onClick={() => { setCurrentIndex(Math.floor(Math.random() * Math.max(1, totalCards))); setIsFlipped(false) }}><Shuffle size={19} />Shuffle</button><button className="ref-secondary" onClick={handleEndStudySession}>Finish session</button></div>}
          {totalCards>0&&<div className="flashcard-deck-tools"><button className="ref-secondary" onClick={()=>{const text=activeDeckCards.map((card,index)=>(index+1)+'. '+card.question+'\n'+card.answer).join('\n\n');if(text.length>990000){setDeckError('This deck exceeds the study material limit. Choose a smaller deck.');return}navigate('/quizzes',{state:{studyText:text,sourceName:selectedDeck?.name||'Flashcards',category:selectedDeck?.category||'General Psychology'}})}}><ChartBar size={17}/>Quiz me on this deck</button><button className="ref-secondary" onClick={()=>{try{printFlashcards(selectedDeck?.name||'Flashcards',activeDeckCards)}catch(error){setDeckError(error instanceof Error?error.message:'Print failed.')}}}><DownloadSimple size={17}/>Print flashcards</button><button className="ref-secondary" onClick={()=>void downloadWord(selectedDeck?.name||'Flashcards',activeDeckCards.map((card,index)=>(index+1)+'. '+card.question+'\n'+card.answer).join('\n\n')).catch(()=>setDeckError('Word download failed. Please try again.'))}>Download Word (.docx)</button></div>}
          {totalCards>0&&<details className="ref-study-options"><summary>Study options · {overallPercentage}% mastered</summary><label><input type="checkbox" checked={showHints} onChange={e => setShowHints(e.target.checked)} />Show hints</label><p>Your ratings automatically schedule the next review using spaced repetition.</p><p>{masteredCardsCount} mastered · {learningCardsCount} learning · {dueCardsCount} due</p></details>}
        </section>}
      </div>

      {showCreateDeckModal&&<ViewportOverlay onDismiss={()=>setShowCreateDeckModal(false)}><form className="glass-modal ref-form-dialog" onSubmit={handleCreateDeckSubmit}><div className="ref-panel-title"><h2>Create New Deck</h2><button type="button" aria-label="Close deck editor" onClick={()=>setShowCreateDeckModal(false)}><X size={21}/></button></div><p>Keep one topic together. You can add cards or generate them from your material next.</p><label>Deck Name<input required maxLength={200} value={newDeckName} onChange={event=>setNewDeckName(event.target.value)} placeholder="e.g. Biological Bases of Behavior"/></label><label>Subject Category<select value={newDeckCategory} onChange={event=>setNewDeckCategory(event.target.value)}>{[...new Set([newDeckCategory,...PSYCHOLOGY_SUBJECTS])].map(subject=><option key={subject}>{subject}</option>)}</select></label><div className="form-actions"><button type="button" className="ref-secondary" onClick={()=>setShowCreateDeckModal(false)}>Cancel</button><button className="ref-primary" disabled={!newDeckName.trim()}>Create Deck</button></div></form></ViewportOverlay>}
      {showAddCardModal&&<ViewportOverlay onDismiss={()=>setShowAddCardModal(false)}><form className="glass-modal ref-form-dialog" onSubmit={handleAddCardSubmit}><div className="ref-panel-title"><h2>Add New Flashcard</h2><button type="button" aria-label="Close card editor" onClick={()=>setShowAddCardModal(false)}><X size={21}/></button></div><p>One clear question on the front. A useful explanation on the back.</p><label>Front: Question / Prompt<textarea required rows={3} maxLength={1000} value={newQuestion} onChange={event=>setNewQuestion(event.target.value)} placeholder="e.g. What is the Yerkes-Dodson Law?"/></label><label>Back: Answer / Explanation<textarea required rows={5} maxLength={4000} value={newAnswer} onChange={event=>setNewAnswer(event.target.value)} placeholder="e.g. Performance increases with physiological or mental arousal, but only up to an optimal point..."/></label><div className="form-actions"><button type="button" className="ref-secondary" onClick={()=>setShowAddCardModal(false)}>Cancel</button><button className="ref-primary" disabled={!newQuestion.trim()||!newAnswer.trim()}>Add Card</button></div></form></ViewportOverlay>}
      {showSessionEndModal&&<ViewportOverlay onDismiss={()=>setShowSessionEndModal(false)}><section className="glass-modal ref-form-dialog study-session-complete"><span className="ref-start-icon"><Check size={30} weight="bold"/></span><h2>Session Complete!</h2><p>You reviewed <strong>{sessionReviewedCount} cards</strong>. Your next review dates have been updated.</p><button className="ref-primary ref-wide" onClick={()=>{setSessionReviewedCount(0);setShowSessionEndModal(false);setSelectedDeckId('')}}>Back to decks</button></section></ViewportOverlay>}
      {showAI && <AIGenerator task="flashcards" category={selectedDeck?.category || 'General Psychology'} onClose={() => setShowAI(false)} onSave={(draft,settings) => { const category = settings.category; const id = createDeck(draft.title, category); draft.cards.forEach(card => addCard(id, card.question, card.answer, category)); setSelectedDeckId(id); setSessionReviewedCount(0); setShowAI(false); setCurrentIndex(0); setIsFlipped(false) }}/>}
    </div>
  )
}
