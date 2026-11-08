import { plainText } from '../../supabase/functions/_shared/plainText'
import { AIGenerator } from '../components/AIGenerator'
import { AITask, extractImageText } from '../utils/ai'
import { workspaceStorage } from '../utils/workspaceStorage'
import { HandwritingCanvas, HandwritingDrawing, handwritingImages } from '../components/HandwritingCanvas'
import {
  ArrowRight, CheckCircle, Trash, FileText, Folder, Link as LinkIcon, ListBullets,
  Plus, Star, TextB, TextItalic, TextUnderline, UploadSimple, X, Scribble, PenNib, SidebarSimple
} from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReferenceStart, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useStudyStore } from '../store'
import '../notes.css'

function sanitizeNoteHtml(html: string) {
  const source = new DOMParser().parseFromString(html, 'text/html')
  const allowed = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'BR', 'P', 'DIV'])
  const clean = (node: Node): Node => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || '')
    const element = node as Element
    if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT'].includes(element.tagName)) return document.createTextNode('')
    const target = allowed.has(element.tagName) ? document.createElement(element.tagName.toLowerCase()) : document.createDocumentFragment()
    node.childNodes.forEach(child => target.appendChild(clean(child)))
    return target
  }
  const result = document.createElement('div')
  source.body.childNodes.forEach(node => result.appendChild(clean(node)))
  return result.innerHTML
}

const EMPTY_DRAWING: HandwritingDrawing = { strokes: [], paper: 'lined', pages: 1 }

export function NotesPage() {
  const { notes, addNote, deleteNote, updateNoteSummary, createDeck, addCard } = useStudyStore()
  const navigate = useNavigate(), location = useLocation()
  const [selectedId, setSelectedId] = useState('')
  const [browserOpen,setBrowserOpen] = useState(() => window.innerWidth > 900)
  const [notebook, setNotebook] = useState('all')
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(workspaceStorage.getItem('psykie-note-favorites') || '[]') } catch { return [] } })
  const [showNew, setShowNew] = useState(false)
  const [newKind, setNewKind] = useState<'text' | 'handwriting'>('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General Psychology')
  const [question, setQuestion] = useState('')
  const [saved, setSaved] = useState(true)
  const [aiTask, setAITask] = useState<AITask | null>(null)
  const [readingInk,setReadingInk] = useState(false),[inkProgress,setInkProgress] = useState(''),[inkError,setInkError] = useState('')
  const inkController = useRef<AbortController|null>(null)
  useEffect(()=>()=>inkController.current?.abort(),[])
  const uploadRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const active = notes.find(note => note.id === selectedId)

  // Handwriting state stored per note in workspaceStorage
  const getDrawing = (id: string): HandwritingDrawing => {
    try {
      const stored = workspaceStorage.getItem('psykie-hw-' + id)
      return stored ? JSON.parse(stored) : { ...EMPTY_DRAWING }
    } catch { return { ...EMPTY_DRAWING } }
  }
  const [ink,setInk] = useState(() => ({id:active?.id || '',drawing:active ? getDrawing(active.id) : {...EMPTY_DRAWING}}))
  const drawing = ink.id === active?.id ? ink.drawing : active ? getDrawing(active.id) : {...EMPTY_DRAWING}
  const [isHandwriting, setIsHandwriting] = useState(() => {
    if (!active) return false
    try { return workspaceStorage.getItem('psykie-note-hw-mode-' + active.id) === 'true' } catch { return false }
  })

  const categories = [...new Set(notes.map(note => note.category))]
  const filtered = notes.filter(note =>
    (notebook === 'all' || note.category === notebook) &&
    (tab !== 'favorites' || favorites.includes(note.id)) &&
    `${plainText(note.title)} ${note.summary}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => sort === 'name' ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date))

  useEffect(() => { workspaceStorage.setItem('psykie-note-favorites', JSON.stringify(favorites)) }, [favorites])

  // Switch drawing state when active note changes
  useEffect(() => {
    if (!active) return
    setInk({id:active.id,drawing:getDrawing(active.id)})
    try { setIsHandwriting(workspaceStorage.getItem('psykie-note-hw-mode-' + active.id) === 'true') } catch { setIsHandwriting(false) }
  }, [active])

  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.dataset.noteId !== active?.id) {
      const stored = active ? workspaceStorage.getItem('psykie-note-html-' + active.id) : null
      if (stored) editor.innerHTML = sanitizeNoteHtml(plainText(stored))
      else editor.textContent = plainText(active?.summary || '')
      editor.dataset.noteId = active?.id || ''
      setSaved(true)
    }
  }, [active])

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const id = (location.state as {noteId?: string} | null)?.noteId
    if (!id || !notes.some(note => note.id === id)) return
    setSelectedId(id); setNotebook('all'); setTab('all'); if(window.innerWidth<=900)setBrowserOpen(false)
    navigate(location.pathname, {replace:true,state:null})
  }, [location.state, location.pathname, navigate, notes])

  const toggleFavorite = (id: string) => setFavorites(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id])

  const saveText = () => {
    if (!active || !editorRef.current) return
    setSaved(false)
    const text = editorRef.current.innerText
    const html = sanitizeNoteHtml(editorRef.current.innerHTML)
    workspaceStorage.setItem('psykie-note-html-' + active.id, html)
    updateNoteSummary(active.id, text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { setSaved(true) }, 500)
  }

  const saveDrawing = (d: HandwritingDrawing) => {
    if (!active) return
    setInk({id:active.id,drawing:d})
    workspaceStorage.setItem('psykie-hw-' + active.id, JSON.stringify(d))
    setSaved(false)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSaved(true), 800)
  }

  const toggleHandwriting = () => {
    if (!active) return
    const next = !isHandwriting
    setIsHandwriting(next)
    workspaceStorage.setItem('psykie-note-hw-mode-' + active.id, String(next))
  }

  const format = (command: string) => { editorRef.current?.focus(); document.execCommand(command); saveText() }

  const create = (e: React.FormEvent) => {
    e.preventDefault()
    const id = addNote({
      title: title.trim(),
      fileName: `${title.trim()}.notes`,
      fileSize: newKind === 'handwriting' ? 'Handwritten note' : 'Text note',
      category,
      summary: content,
      keyTopics: [], keyConcepts: [], importantTerms: []
    })
    if (newKind === 'handwriting') {
      workspaceStorage.setItem('psykie-note-hw-mode-' + id, 'true')
      workspaceStorage.setItem('psykie-hw-' + id, JSON.stringify({ ...EMPTY_DRAWING }))
    }
    setSelectedId(id); setShowNew(false); setTitle(''); setContent(''); setNotebook('all'); setTab('all'); if(window.innerWidth<=900)setBrowserOpen(false)
  }

  return <div className="reference-page ref-notes-page" data-browser-open={browserOpen || !active}>
    <ReferenceHeader
      title="Notes"
      actions={<button className="ref-secondary" onClick={()=>{setNewKind('handwriting');setShowNew(true)}}><Scribble size={18}/>Handwritten note</button>}
      subtitle="A little clarity, one thought at a time."
      action="New note"
      onAction={() => { setNewKind('text'); setShowNew(true) }}
    />
    <div className="notes-viewbar"><p>{active ? <><strong>{plainText(active.title)}</strong><span>{isHandwriting?'Handwritten note':'Text note'}</span></> : 'Your notebooks and writing space'}</p>{active&&<button className="ref-secondary" aria-controls="notes-browser" aria-expanded={browserOpen} onClick={()=>setBrowserOpen(value=>!value)}><SidebarSimple size={18}/>{browserOpen?'Focus editor':'Show notes'}</button>}</div>
    <div className="ref-notes-layout"><div className="notes-browser" id="notes-browser">
      <aside className="ref-panel ref-notebooks">
        <div className="ref-panel-title">
          <h2>Notebooks</h2>
          <div style={{ display: 'flex', gap: 4 }}>
            <button aria-label="Handwritten note" title="New handwritten note" onClick={() => { setNewKind('handwriting'); setShowNew(true) }}>
              <Scribble size={20} />
            </button>
            <button aria-label="Create a note" onClick={() => { setNewKind('text'); setShowNew(true) }}>
              <Plus size={20} />
            </button>
          </div>
        </div>
        <label className="notes-notebook-filter"><span className="sr-only">Filter notebooks</span><Folder size={18}/><select aria-label="Filter notebooks" value={notebook} onChange={event=>setNotebook(event.target.value)}><option value="all">All notes ({notes.length})</option>{categories.map(name=><option key={name} value={name}>{name} ({notes.filter(note=>note.category===name).length})</option>)}</select></label>
        <button className="ref-text-action ref-upload-note" onClick={() => uploadRef.current?.click()}>
          <UploadSimple size={17} />Import text
        </button>
        <input hidden ref={uploadRef} type="file" accept=".txt,.md" onChange={async e => {
          const file = e.target.files?.[0]; if (!file) return
          const text = await file.text()
          const id = addNote({ title: file.name.replace(/\.[^.]+$/, ''), fileName: file.name, fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`, category: 'General Psychology', summary: text, keyTopics: [], keyConcepts: [], importantTerms: [] })
          setSelectedId(id); setNotebook('all'); if(window.innerWidth<=900)setBrowserOpen(false); e.target.value = ''
        }} />
      </aside>

      <section className="ref-panel ref-note-list">
        <div className="ref-note-list-toolbar">
          <ReferenceTabs items={[{ id: 'all', label: 'All notes' }, { id: 'favorites', label: 'Favorites' }, { id: 'recent', label: 'Recent' }]} value={tab} onChange={setTab} />
          <ReferenceSearch value={search} onChange={setSearch} placeholder="Search notes…" />
        </div>
        <div className="ref-list-sort">
          <select aria-label="Sort notes" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="recent">Last edited</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
        <div className="ref-note-results">
          {filtered.map((note, index) => (
            <article key={note.id} className={`ref-note-item ${active?.id === note.id ? 'selected' : ''}`}>
              <button className="ref-note-select" onClick={() => {setSelectedId(note.id);if(window.innerWidth<=900)setBrowserOpen(false)}}>
                <span className={`ref-icon tint-${index % 4}`}>
                  {note.fileSize === 'Handwritten note' ? <Scribble size={26} /> : <FileText size={26} />}
                </span>
                <span>
                  <strong>{plainText(note.title)}</strong>
                  <p>{note.summary.slice(0, 88)}</p>
                  <span className="ref-note-meta">
                    <span className={`ref-tag tint-${index % 4}`}>{note.category}</span>
                    <small>{note.date}</small>
                  </span>
                </span>
              </button>
              <button className="ref-favorite" aria-label={favorites.includes(note.id) ? 'Remove favorite' : 'Favorite note'} onClick={() => toggleFavorite(note.id)}>
                <Star size={19} weight={favorites.includes(note.id) ? 'fill' : 'regular'} />
              </button>
            </article>
          ))}
          {!filtered.length && <ReferenceStart icon={<FileText size={28}/>} title={notes.length?'No matching notes':'A little clarity starts here'} action={notes.length?'Reset filters':'Write your first note'} onAction={()=>{if(notes.length){setSearch('');setNotebook('all');setTab('all')}else{setNewKind('text');setShowNew(true)}}}>{notes.length?'Try another word or view all your notebooks.':'Capture a thought, type your lecture notes, or write by hand.'}</ReferenceStart>}
        </div>
      </section>

      </div><section className="ref-panel ref-note-detail">
        {active ? (
          <>
            <div className="ref-note-title">
              <h2>{plainText(active.title)}</h2>
              <button aria-label="Favorite current note" onClick={() => toggleFavorite(active.id)}>
                <Star size={20} weight={favorites.includes(active.id) ? 'fill' : 'regular'} />
              </button>
              <span className="ref-save-status">
                <CheckCircle weight="fill" size={15} />{saved ? 'Saved' : 'Saving…'}
              </span>
              {/* Toggle handwriting/text mode */}
              <button
                title={isHandwriting ? 'Switch to text' : 'Switch to handwriting'}
                aria-label={isHandwriting ? 'Switch to text mode' : 'Switch to handwriting mode'}
                onClick={toggleHandwriting}
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--ref-border)', color: isHandwriting ? 'var(--ref-accent)' : 'var(--ref-muted)', background: isHandwriting ? 'var(--ref-soft)' : 'transparent', cursor: 'pointer' }}
              >
                {isHandwriting ? <PenNib size={15} weight="fill" /> : <Scribble size={15} />}
                {isHandwriting ? 'Handwriting' : 'Text'}
              </button>
              <button aria-label="Delete current note" onClick={() => { const id = active.id; setSelectedId(''); workspaceStorage.removeItem('psykie-hw-' + id); deleteNote(id) }}>
                <Trash size={17} />
              </button>
            </div>

            {!isHandwriting && (
              <div className="ref-editor-toolbar">
                {[
                  { icon: TextB, command: 'bold', label: 'Bold' },
                  { icon: TextItalic, command: 'italic', label: 'Italic' },
                  { icon: TextUnderline, command: 'underline', label: 'Underline' },
                  { icon: ListBullets, command: 'insertUnorderedList', label: 'Bullet list' },
                ].map(item => (
                  <button key={item.command} aria-label={item.label} onMouseDown={e => e.preventDefault()} onClick={() => format(item.command)}>
                    <item.icon size={18} />
                  </button>
                ))}
                <LinkIcon size={17} /><span>Normal text</span>
                <button className="ref-text-action" onClick={() => setAITask('summary')}>AI summary</button>
                <button className="ref-text-action" onClick={() => navigate('/quizzes', {state:{studyText:editorRef.current?.innerText || active.summary,sourceName:active.title,category:active.category}})}>Quiz me on this</button>
                <button className="ref-text-action" onClick={() => setAITask('flashcards')}>AI flashcards</button>
              </div>
            )}

            {isHandwriting&&<div className="note-ink-ai"><button className="ref-secondary" disabled={readingInk} onClick={async()=>{
              setReadingInk(true);setInkError('');const controller=new AbortController();inkController.current=controller
              try {
                const sourceId=active.id,images=handwritingImages(drawing),pages:string[]=[]
                for(let index=0;index<images.length;index++){setInkProgress('Reading page '+(index+1)+' of '+images.length);pages.push(await extractImageText(images[index],controller.signal))}
                if(controller.signal.aborted)return
                const text=pages.join('\n\n').trim();if(!text)throw new Error('No readable handwriting was found. Try clearer, larger writing.');if(text.length>25000)throw new Error('The extracted text is too long. Read fewer pages.')
                const source=notes.find(note=>note.id===sourceId);if(!source)throw new Error('The source note is no longer available.')
                const id=addNote({title:source.title+' - transcript',fileName:source.title+'.txt',fileSize:'AI handwriting transcript',category:source.category,summary:text,keyTopics:[],keyConcepts:[],importantTerms:[]});setSelectedId(id);setNotebook('all');setTab('all');if(window.innerWidth<=900)setBrowserOpen(false)
              }catch(error){if(!controller.signal.aborted)setInkError(error instanceof Error?error.message:'Handwriting could not be read.')}finally{setReadingInk(false);setInkProgress('')}
            }}>Read handwriting with AI</button><small>Sends up to 5 page images to Mistral. Your original ink is kept.</small>{readingInk&&<><p role="status">{inkProgress}</p><button className="ref-text-action" onClick={()=>inkController.current?.abort()}>Cancel reading</button></>}{inkError&&<p role="alert" className="ref-form-error">{inkError}</p>}</div>}
            <div className="ref-editor-content">
              {isHandwriting ? (
                <HandwritingCanvas key={active.id} drawing={drawing} onChange={saveDrawing} />
              ) : (
                <>
                  <h3>Overview</h3>
                  <div ref={editorRef} role="textbox" aria-label="Note content" aria-multiline="true" contentEditable suppressContentEditableWarning onInput={saveText} />
                  {active.keyTopics.length > 0 && <><h3>Key principles</h3><ul>{active.keyTopics.map(topic => <li key={topic}>{topic}</li>)}</ul></>}
                  {active.keyConcepts.length > 0 && <><h3>Common concepts</h3><ul>{active.keyConcepts.map(concept => <li key={concept}>{concept}</li>)}</ul></>}
                </>
              )}
            </div>

            {!isHandwriting && (
              <form className="ref-note-ask" onSubmit={e => {
                e.preventDefault()
                if (question.trim()) navigate(`/mindy?q=${encodeURIComponent(`About my note "${plainText(active.title)}": ${question}`)}`, { state: { noteContext: active.summary.slice(0,4000) } })
              }}>
                <span><img src="/mindy-mascot.png" alt="" />Ask Mindy</span>
                <input aria-label="Ask about this note" placeholder="Ask a question about this note…" value={question} onChange={e => setQuestion(e.target.value)} />
                <button className="ref-round-button" aria-label="Ask Mindy" disabled={!question.trim()}><ArrowRight size={20} /></button>
              </form>
            )}
          </>
        ) : (
          <ReferenceStart icon={<FileText size={30}/>} title="Your space to think" action="Write a note" onAction={()=>{setNewKind('text');setShowNew(true)}}>Open a note from the list, or start with a blank page. Your writing saves automatically.</ReferenceStart>
        )}
      </section>
    </div>

    {showNew && (
      <ViewportOverlay onDismiss={() => setShowNew(false)}>
        <form className="glass-modal ref-form-dialog" onSubmit={create}>
          <div className="ref-panel-title">
            <h2>Create {newKind === 'handwriting' ? 'Handwritten' : 'Study'} Note</h2>
            <button type="button" aria-label="Close" onClick={() => setShowNew(false)}><X size={20} /></button>
          </div>
          {/* Kind toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button type="button" onClick={() => setNewKind('text')} className="ref-secondary note-kind-option" aria-pressed={newKind === 'text'}>
              <FileText size={16} />Text note
            </button>
            <button type="button" onClick={() => setNewKind('handwriting')} className="ref-secondary note-kind-option" aria-pressed={newKind === 'handwriting'}>
              <Scribble size={16} />Handwritten
            </button>
          </div>
          <label>Note title<input required value={title} onChange={e => setTitle(e.target.value)} /></label>
          <label>Notebook<input list="note-categories" value={category} onChange={e => setCategory(e.target.value)} /><datalist id="note-categories">{categories.map(name => <option key={name}>{name}</option>)}</datalist></label>
          {newKind === 'text' && <label>Your notes<textarea rows={6} value={content} onChange={e => setContent(e.target.value)} /></label>}
          {newKind === 'handwriting' && <p style={{ fontSize: 12, color: '#6b7280', margin: '8px 0 4px' }}>The handwriting canvas will open after saving. Use an Apple Pencil, stylus, or mouse to draw.</p>}
          <button className="ref-primary" type="submit">Save note<ArrowRight size={17} /></button>
        </form>
      </ViewportOverlay>
    )}

    {aiTask && active && (
      <AIGenerator task={aiTask} initialText={active.summary} category={active.category} onClose={() => setAITask(null)} onSave={(draft, settings) => {
        if (aiTask === 'summary') {
          const id = addNote({ title: draft.title, fileName: draft.title + '.notes', fileSize: 'Text note', category: settings.category, summary: draft.summary + '\n\n' + draft.keyPoints.join('\n'), keyTopics: draft.keyPoints, keyConcepts: [], importantTerms: [] })
          setSelectedId(id)
        } else {
          const id = createDeck(draft.title, settings.category)
          draft.cards.forEach(card => addCard(id, card.question, card.answer, settings.category))
          navigate('/flashcards',{state:{deckId:id}})
        }
        setAITask(null)
      }} />
    )}
  </div>
}
