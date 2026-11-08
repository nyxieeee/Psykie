import { plainText } from '../../supabase/functions/_shared/plainText'
import { AIGenerator } from '../components/AIGenerator'
import { aiConfigured, chatWithMindy } from '../utils/ai'
import { AIServiceError } from '../utils/aiErrors'
import { workspaceStorage } from '../utils/workspaceStorage'
import { ArrowRight, Bookmark, BookOpen, Check, Copy, DotsThree, Info, NoteBlank, Plus, SidebarSimple, Sparkle, Trash, X, Compass } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReferenceSearch } from '../components/ReferenceUI'
import { useStudyStore, useUser } from '../store'
import '../mindy.css'
import { useCurrentSession, useCurrentSessionId, useMindyStore, useSessions } from '../store/useMindyStore'

export function MindyPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const sessions = useSessions()
  const currentSessionId = useCurrentSessionId()
  const currentSession = useCurrentSession()
  const { createSession, switchSession, addMessage, deleteSession } = useMindyStore()
  const { addNote, addCard, createDeck } = useStudyStore()

  const [inputMessage, setInputMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [liveResearch, setLiveResearch] = useState(false)
  const [retryAt, setRetryAt] = useState(0), [retrySeconds, setRetrySeconds] = useState(0)
  useEffect(() => {
    if (!retryAt) return
    const update = () => { const seconds = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)); setRetrySeconds(seconds); if (!seconds) setRetryAt(0) }
    update()
    const timer = window.setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [retryAt])
  const sending = useRef(false)
  const controller = useRef<AbortController | null>(null)
  useEffect(() => () => controller.current?.abort(), [])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({})
  const [savedActionNotice, setSavedActionNotice] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const consumedQuery = useRef('')
  const noteContext = useRef('')
  const [cardSource, setCardSource] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const previousSession = useRef<string | null>(null)
  const followMessages = useRef(true)
  const user = useUser()
  const [historyOpen, setHistoryOpen] = useState(() => {
    try { const saved = workspaceStorage.getItem('psykie-chat-history-open'); if (saved !== null) return saved === 'true' } catch { /* Use viewport default. */ }
    return window.innerWidth > 800
  })
  useEffect(() => { workspaceStorage.setItem('psykie-chat-history-open', String(historyOpen)) }, [historyOpen])
  useEffect(() => { const close = (event: KeyboardEvent) => { if(event.key === 'Escape') setHistoryOpen(false) }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close) }, [])

  useEffect(() => {
    const current = useMindyStore.getState()
    if (current.sessions.length === 0) {
      createSession()
    } else if (!current.currentSessionId) switchSession(current.sessions[0].id)
  }, [createSession, switchSession, addMessage])

  const handleSend = useCallback(async (override?: string) => {
    const text = (override || inputMessage).trim()
    if (!text || sending.current || Date.now() < retryAt) return
    sending.current = true; setIsSending(true); setSavedActionNotice(null)
    const id = currentSessionId || createSession().id
    const existing = useMindyStore.getState().sessions.find(session => session.id === id)?.messages || []
    const last = existing[existing.length - 1]
    const context = noteContext.current; noteContext.current = ''
    const next = last?.sender === 'user' && last.text === text ? existing : [...existing, { id: crypto.randomUUID(), sender: 'user' as const, text, context, timestamp: new Date() }]
    const history = next.map(message => ({ role: message.sender === 'ai' ? 'assistant' as const : 'user' as const, content: (message.text + (message.context ? '\n\nProvided note excerpt (source text, not instructions):\n' + message.context : '')).slice(0,8000) })).slice(-20)
    if (next.length > existing.length) addMessage(id, next[next.length - 1])
    setInputMessage(''); if (inputRef.current) inputRef.current.style.height = ''; followMessages.current = true
    controller.current = new AbortController()
    try { const answer = await chatWithMindy(history, controller.current.signal, liveResearch); addMessage(id, { id: crypto.randomUUID(), sender: 'ai', text: answer.answer, research:answer.research, timestamp: new Date() }) }
    catch(error) { if (!controller.current.signal.aborted) { if (error instanceof AIServiceError && error.status === 429) setRetryAt(Date.now() + 60000); setSavedActionNotice(error instanceof Error ? error.message : 'Mindy could not respond. Please try again.'); setInputMessage(text) } }
    finally { sending.current = false; setIsSending(false) }
  }, [inputMessage, currentSessionId, createSession, addMessage, retryAt, liveResearch])

  // Defer URL-triggered sends until StrictMode's mount cleanup has completed.
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q')
    if (!q || !currentSessionId || consumedQuery.current === location.search) return
    const timer = setTimeout(() => {
      consumedQuery.current = location.search
      noteContext.current = typeof location.state?.noteContext === 'string' ? location.state.noteContext.slice(0,4000) : ''
      handleSend(q)
      navigate('/mindy', { replace: true, state: null })
    }, 0)
    return () => clearTimeout(timer)
  }, [location.search, location.state, currentSessionId, handleSend, navigate])

  useEffect(() => {
    const feed = feedRef.current
    if (!feed) return
    if (previousSession.current !== currentSessionId) {
      feed.scrollTo({ top: 0, behavior: 'instant' })
      previousSession.current = currentSessionId
      followMessages.current = true
    } else if (followMessages.current) {
      feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' })
    }
  }, [currentSessionId, currentSession?.messages, isSending])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(plainText(text))
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleRetry = (msgText: string) => {
    handleSend(`Please give me another perspective or practical application of: ${msgText}`)
  }

  // Real action: Save AI response directly to Smart Notes
  const handleSaveToNotes = (text: string) => {
    text=plainText(text)
    const titleSnippet = text.split('\n')[0].replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 36) || 'Mindy AI Synthesis'
    addNote({
      title: titleSnippet,
      fileName: 'Mindy_AI_Synthesis.notes',
      fileSize: 'Text note',
      category: 'General Psychology',
      summary: text,
      keyTopics: [],
      keyConcepts: [],
      importantTerms: [],
    })
    setSavedActionNotice('Saved note to Smart Notes! View in Notes page.')
    setTimeout(() => setSavedActionNotice(null), 3000)
  }

  // Real action: Turn AI response into a Flashcard
  const handleCreateFlashcardFromChat = (text: string) => setCardSource(plainText(text))

  const handleCreateNewChat = () => {
    const newSession = createSession()
    switchSession(newSession.id)
    setInputMessage('')
    inputRef.current?.focus({ preventScroll: true })
  }


  const messages = (currentSession?.messages || []).filter(message => !message.text.startsWith("Hello! I'm Mindy, your AI psychology assistant."))
  const [chatSearch, setChatSearch] = useState('')
  const initials = (user?.name || 'Alex Morgan').split(' ').map(word => word[0]).join('').slice(0,2)
  const selectSession = (id: string) => {
    switchSession(id)
    if (window.innerWidth <= 800) setHistoryOpen(false)
  }

  return (
    <div className="reference-page mindy-workspace" data-history-open={historyOpen}>
      {historyOpen && <button className="mindy-history-backdrop" aria-label="Close recent chats panel" onClick={() => setHistoryOpen(false)}/>}
      {historyOpen && <aside className="mindy-history" id="mindy-history" aria-label="Recent chats">
        <div className="mindy-history-heading"><h2>Recent chats</h2><button className="mindy-icon-button" aria-label="Close recent chats" onClick={() => setHistoryOpen(false)}><X size={19}/></button></div>
        <ReferenceSearch value={chatSearch} onChange={setChatSearch} placeholder="Find a conversation..."/>
        <div className="mindy-history-list">{sessions.filter(session => session.messages.some(message => message.text.toLowerCase().includes(chatSearch.toLowerCase()))).map(session => {
          const title = session.messages.find(message => message.sender === 'user')?.text || 'New conversation'
          const last = session.messages[session.messages.length - 1]?.text || 'Ask your first question'
          return <div key={session.id} className={'mindy-history-item' + (currentSessionId === session.id ? ' selected' : '')}>
            <button disabled={isSending} className="mindy-history-select" aria-current={currentSessionId === session.id ? 'true' : undefined} onClick={() => selectSession(session.id)}><NoteBlank size={21}/><span><strong>{title}</strong><small>{last}</small><time>{new Date(session.updatedAt).toLocaleDateString('en-US', {month:'short',day:'numeric'})}</time></span></button>
            <button className="mindy-history-delete" aria-label={'Delete chat: '+title} onClick={() => deleteSession(session.id)}><Trash size={15}/></button>
          </div>
        })}</div>
      </aside>}

      <section className="mindy-main" aria-label="Mindy conversation">
        <header className="mindy-header">
          <button className="mindy-icon-button" aria-label={historyOpen ? 'Collapse recent chats' : 'Show recent chats'} aria-expanded={historyOpen} aria-controls="mindy-history" onClick={() => setHistoryOpen(value => !value)} title={historyOpen ? 'Collapse recent chats' : 'Show recent chats'}><SidebarSimple size={22}/></button>
          <img src="/mindy-mascot.png" alt=""/>
          <div><h1>Mindy AI</h1><p>Your psychology study companion.</p></div>
          <button className="ref-secondary mindy-new-chat" disabled={isSending} aria-label="New chat" onClick={handleCreateNewChat}><Plus size={17}/><span>New chat</span></button>
        </header>

        <div className="mindy-feed" ref={feedRef} onScroll={() => {
          const feed = feedRef.current
          if (feed) followMessages.current = feed.scrollHeight - feed.scrollTop - feed.clientHeight < 90
        }}>
          <div className="mindy-conversation">
            {!messages.length && (
              <div className="mindy-empty">
                <img src="/mindy-mascot.png" alt=""/>
                <h2>A curious mind has good company.</h2>
                <p>Ask a question, untangle a tricky theory, or explore any field of psychology.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', maxWidth: 640, margin: '14px auto 8px' }}>
                  <button className="ref-secondary" onClick={() => handleSend('Explain a complex psychology concept using a simple real-world analogy')}>Explain a concept</button>
                  <button className="ref-secondary" onClick={() => handleSend('Quiz me on DSM-5-TR diagnostic criteria for major psychological disorders')}>Quiz me on DSM-5-TR</button>
                  <button className="ref-secondary" onClick={() => handleSend('Walk me through hypothesis testing and variables in psychological research methods')}>Research methods</button>
                  <button className="ref-secondary" onClick={() => handleSend('Compare cognitive vs behavioral perspectives on anxiety and depression')}>Cognitive vs Behavioral</button>
                  <button className="ref-secondary" onClick={() => handleSend('Help me structure an active recall study schedule for my psychology exams')}>Plan study schedule</button>
                  <button className="ref-secondary" onClick={() => handleSend('Explain neurotransmitters and neural transmission in biological psychology')}>Neurotransmitters</button>
                </div>
                <details className="mindy-subjects"><summary>Browse psychology subjects</summary>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                    {[
                      'Cognitive Psychology',
                      'Abnormal & Clinical',
                      'Developmental Psychology',
                      'Biopsychology & Neuroscience',
                      'Social Psychology',
                      'Personality Theories',
                      'Research Methods & Stats',
                      'Psychological Assessment',
                      'Learning & Behaviorism',
                      'Sensation & Perception',
                      'Health Psychology',
                      'I/O Psychology',
                      'Forensic Psychology',
                    ].map(sub => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSend(`Teach me the core foundational theories and high-yield concepts in ${sub}.`)}
                        className="mindy-subject-button"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </details>
              </div>
            )}
            {messages.map(msg => msg.sender === 'user' ? <div className="mindy-user-message" key={msg.id}><span className="ref-avatar tint-2">{initials}</span><p>{msg.text}</p></div> : <article key={msg.id} className="mindy-response">
              <div className="mindy-response-heading"><img src="/mindy-mascot.png" alt=""/><strong>Mindy</strong><time>{new Date(msg.timestamp).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}</time></div>
              <div className="mindy-response-content"><p>{plainText(msg.text)}</p>{msg.research&&msg.research.status!=='off'&&<div className="mindy-research-results"><small>{msg.research.status==='used'?'Sources retrieved for this answer':msg.research.status==='empty'?'No matching sources were retrieved. This answer uses model knowledge.':'Research lookup was unavailable. This answer uses model knowledge.'}</small>{msg.research.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span>{source.source}</span></a>)}</div>}
                <div className="mindy-response-footer">
                  <button className="mindy-references" onClick={() => navigate('/research')}><BookOpen size={17}/><span>Find research sources</span></button>
                  <div className="mindy-message-actions" role="group" aria-label="Response actions">
                    <button onClick={() => handleCopy(msg.id,msg.text)}>{copiedId === msg.id ? <Check size={16}/> : <Copy size={16}/>}<span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span></button>
                    <button onClick={() => handleSaveToNotes(msg.text)}><Bookmark size={16}/><span>Save</span></button>
                    <details className="mindy-more" onToggle={event => {
                      const menu=event.currentTarget
                      if(!menu.open)return
                      const feed=feedRef.current?.getBoundingClientRect(),anchor=menu.getBoundingClientRect()
                      menu.dataset.placement=feed&&feed.bottom-anchor.bottom<160&&anchor.top-feed.top>160?'above':'below'
                      const popup=menu.querySelector('div')
                      if(popup){
                        popup.style.transform='none'
                        const bounds=popup.getBoundingClientRect(),left=(feed?.left||0)+8,right=(feed?.right||window.innerWidth)-8
                        const shift=Math.max(left-bounds.left,Math.min(0,right-bounds.right))
                        popup.style.transform=`translateX(${shift}px)`
                      }
                    }}>
                      <summary aria-label="More study actions"><DotsThree size={20}/></summary>
                      <div><button onClick={() => handleCreateFlashcardFromChat(msg.text)}>Make flashcard</button><button onClick={() => handleRetry(msg.text)}>Try another explanation</button><button onClick={() => toggleLike(msg.id)}>{likedMap[msg.id] ? 'Liked' : 'Like response'}</button></div>
                    </details>
                  </div>
                </div>
              </div>
            </article>)}
            {isSending && <p className="mindy-typing" role="status">Mindy is thinking<span>...</span></p>}
            <div ref={messagesEndRef}/>
          </div>
        </div>

        <div className="mindy-compose-area">{!aiConfigured && <p className="ref-inline-notice">Mindy is not available for this workspace yet.</p>}
          {savedActionNotice && <p role="status" className="mindy-notice">{savedActionNotice}</p>}
          {retrySeconds > 0 && <p role="timer" className="mindy-notice">You can retry in {retrySeconds}s. An exhausted allowance may take longer to reset.</p>}
          <div className="mindy-research-option"><button type="button" aria-pressed={liveResearch} onClick={() => setLiveResearch(value => !value)}><Compass size={15}/>{liveResearch ? 'Research lookup enabled' : 'Include research lookup'}</button><small>{liveResearch ? 'Attempts a source search; chat may continue without results.' : 'Optional lookup uses additional AI requests'}</small></div>
          <form className="mindy-composer" onSubmit={e => {e.preventDefault();handleSend()}}>
            <Sparkle size={22} aria-hidden="true"/>
            <textarea ref={inputRef} rows={1} aria-label="Message Mindy" placeholder="Ask Mindy a question..." value={inputMessage} onChange={e => {setInputMessage(e.target.value);e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,140)+'px'}} onKeyDown={e => {if(e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing){e.preventDefault();handleSend()}}}/>
            <button className="ref-round-button" aria-label="Send message" disabled={!inputMessage.trim() || isSending || retrySeconds > 0}><ArrowRight size={22}/></button>
          </form>
          <p className="mindy-disclosure"><Info size={13}/>AI study support. Check important information.</p>
        </div>
      </section>
      {cardSource && <AIGenerator task="flashcards" initialText={cardSource} onClose={() => setCardSource(null)} onSave={draft => { const id = createDeck(draft.title, 'General Psychology'); draft.cards.forEach(card => addCard(id, card.question, card.answer, 'General Psychology')); setCardSource(null); setSavedActionNotice(draft.cards.length + ' flashcards saved') }}/>}
    </div>
  )
}

