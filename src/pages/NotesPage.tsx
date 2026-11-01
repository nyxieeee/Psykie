import { AIGenerator } from '../components/AIGenerator'
import { AITask } from '../utils/ai'
import { workspaceStorage } from '../utils/workspaceStorage'
import { ArrowRight, CheckCircle, Trash, FileText, Folder, Link as LinkIcon, ListBullets, Plus, Star, TextB, TextItalic, TextUnderline, UploadSimple, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ReferenceEmpty, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useStudyStore } from '../store'

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

export function NotesPage() {
  const { notes, addNote, deleteNote, updateNoteSummary, generateFlashcardsFromNote, createDeck, addCard } = useStudyStore()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(notes[0]?.id || '')
  const [notebook, setNotebook] = useState('all')
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [favorites, setFavorites] = useState<string[]>(() => { try { return JSON.parse(workspaceStorage.getItem('psykie-note-favorites') || '[]') } catch { return [] } })
  const [showNew, setShowNew] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General Psychology')
  const [question, setQuestion] = useState('')
  const [saved, setSaved] = useState(true)
  const [notice, setNotice] = useState('')
  const [aiTask, setAITask] = useState<AITask | null>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const active = notes.find(note => note.id === selectedId) || notes[0]
  const categories = [...new Set(notes.map(note => note.category))]
  const filtered = notes.filter(note => (notebook === 'all' || note.category === notebook) && (tab !== 'favorites' || favorites.includes(note.id)) && `${note.title} ${note.summary}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => sort === 'name' ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date))
  useEffect(() => { workspaceStorage.setItem('psykie-note-favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.dataset.noteId !== active?.id) {
      const stored = active ? workspaceStorage.getItem('psykie-note-html-' + active.id) : null
      if (stored) editor.innerHTML = sanitizeNoteHtml(stored)
      else editor.textContent = active?.summary || ''
      editor.dataset.noteId = active?.id || ''
      setSaved(true)
    }
  }, [active])
  useEffect(() => () => clearTimeout(timer.current), [])
  const toggleFavorite = (id: string) => setFavorites(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id])
  const save = () => { if (!active || !editorRef.current) return; setSaved(false); const text = editorRef.current.innerText; const html = sanitizeNoteHtml(editorRef.current.innerHTML); workspaceStorage.setItem('psykie-note-html-' + active.id, html); updateNoteSummary(active.id, text); clearTimeout(timer.current); timer.current = setTimeout(() => { setSaved(true) }, 500) }
  const format = (command: string) => { editorRef.current?.focus(); document.execCommand(command); save() }
  const create = (e: React.FormEvent) => { e.preventDefault(); const id = addNote({ title: title.trim(), fileName: `${title.trim()}.notes`, fileSize: 'Text note', category, summary: content, keyTopics: [], keyConcepts: [], importantTerms: [] }); setSelectedId(id); setShowNew(false); setTitle(''); setContent(''); setNotebook('all'); setTab('all') }
  return <div className="reference-page ref-notes-page">
    <ReferenceHeader title="Your notes" subtitle="A little clarity, one thought at a time." action="New note" onAction={() => setShowNew(true)} />
    <div className="ref-notes-layout">
      <aside className="ref-panel ref-notebooks"><div className="ref-panel-title"><h2>Notebooks</h2><button aria-label="Create a note" onClick={() => setShowNew(true)}><Plus size={20} /></button></div><button className={`ref-notebook ${notebook === 'all' ? 'selected' : ''}`} onClick={() => setNotebook('all')}><Folder size={23} weight="duotone" /><span>All notes</span><small>{notes.length}</small></button>{categories.map((name, index) => <button key={name} className={`ref-notebook tint-${index % 4} ${notebook === name ? 'selected' : ''}`} onClick={() => setNotebook(name)}><Folder size={22} weight="duotone" /><span>{name}</span><small>{notes.filter(note => note.category === name).length}</small></button>)}<button className="ref-text-action ref-upload-note" onClick={() => uploadRef.current?.click()}><UploadSimple size={17} />Import text</button><input hidden ref={uploadRef} type="file" accept=".txt,.md" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const text = await file.text(); const id = addNote({ title: file.name.replace(/\.[^.]+$/, ''), fileName: file.name, fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`, category: 'General Psychology', summary: text, keyTopics: [], keyConcepts: [], importantTerms: [] }); setSelectedId(id); setNotebook('all'); e.target.value = '' }} /></aside>
      <section className="ref-panel ref-note-list"><div className="ref-note-list-toolbar"><ReferenceTabs items={[{ id: 'all', label: 'All notes' }, { id: 'favorites', label: 'Favorites' }, { id: 'recent', label: 'Recent' }]} value={tab} onChange={setTab} /><ReferenceSearch value={search} onChange={setSearch} placeholder="Search notes…" /></div><div className="ref-list-sort"><select aria-label="Sort notes" value={sort} onChange={e => setSort(e.target.value)}><option value="recent">Last edited</option><option value="name">Name A–Z</option></select></div><div className="ref-note-results">{filtered.map((note, index) => <article key={note.id} className={`ref-note-item ${active?.id === note.id ? 'selected' : ''}`}><button className="ref-note-select" onClick={() => setSelectedId(note.id)}><span className={`ref-icon tint-${index % 4}`}><FileText size={26} /></span><span><strong>{note.title}</strong><p>{note.summary.slice(0, 88)}</p><span className="ref-note-meta"><span className={`ref-tag tint-${index % 4}`}>{note.category}</span><small>{note.date}</small></span></span></button><button className="ref-favorite" aria-label={favorites.includes(note.id) ? 'Remove favorite' : 'Favorite note'} onClick={() => toggleFavorite(note.id)}><Star size={19} weight={favorites.includes(note.id) ? 'fill' : 'regular'} /></button></article>)}{!filtered.length && <ReferenceEmpty>No notes here yet. Start with a new thought.</ReferenceEmpty>}</div></section>
      <section className="ref-panel ref-note-detail">{active ? <><div className="ref-note-title"><h2>{active.title}</h2><button aria-label="Favorite current note" onClick={() => toggleFavorite(active.id)}><Star size={20} weight={favorites.includes(active.id) ? 'fill' : 'regular'} /></button><span className="ref-save-status"><CheckCircle weight="fill" size={15} />{saved ? 'Saved' : 'Saving…'}</span><button aria-label="Delete current note" onClick={() => deleteNote(active.id)}><Trash size={17} /></button></div><div className="ref-editor-toolbar">{[{ icon: TextB, command: 'bold', label: 'Bold' }, { icon: TextItalic, command: 'italic', label: 'Italic' }, { icon: TextUnderline, command: 'underline', label: 'Underline' }, { icon: ListBullets, command: 'insertUnorderedList', label: 'Bullet list' }].map(item => <button key={item.command} aria-label={item.label} onMouseDown={e => e.preventDefault()} onClick={() => format(item.command)}><item.icon size={18} /></button>)}<LinkIcon size={17} /><span>Normal text</span><button className="ref-text-action" onClick={() => { const count = generateFlashcardsFromNote(active.id); setNotice(`${count} flashcards created`); setTimeout(() => setNotice(''), 3000) }}>Make cards</button><button className="ref-text-action" onClick={() => setAITask('summary')}>AI summary</button><button className="ref-text-action" onClick={() => setAITask('flashcards')}>AI flashcards</button></div><div className="ref-editor-content"><h3>Overview</h3><div ref={editorRef} role="textbox" aria-label="Note content" aria-multiline="true" contentEditable suppressContentEditableWarning onInput={save} />{active.keyTopics.length > 0 && <><h3>Key principles</h3><ul>{active.keyTopics.map(topic => <li key={topic}>{topic}</li>)}</ul></>}{active.keyConcepts.length > 0 && <><h3>Common concepts</h3><ul>{active.keyConcepts.map(concept => <li key={concept}>{concept}</li>)}</ul></>}{notice && <p role="status" className="ref-inline-notice">{notice}</p>}</div><form className="ref-note-ask" onSubmit={e => { e.preventDefault(); if (question.trim()) navigate(`/mindy?q=${encodeURIComponent(`About my note "${active.title}": ${question}`)}`, { state: { noteContext: active.summary.slice(0,4000) } }) }}><span><img src="/mindy-mascot.png" alt="" />Ask Mindy</span><input aria-label="Ask about this note" placeholder="Ask a question about this note…" value={question} onChange={e => setQuestion(e.target.value)} /><button className="ref-round-button" aria-label="Ask Mindy" disabled={!question.trim()}><ArrowRight size={20} /></button></form></> : <ReferenceEmpty>Choose a note, or create your first one.</ReferenceEmpty>}</section>
    </div>
    {showNew && <ViewportOverlay onDismiss={() => setShowNew(false)}><form className="glass-modal ref-form-dialog" onSubmit={create}><div className="ref-panel-title"><h2>Create Study Note</h2><button type="button" aria-label="Close" onClick={() => setShowNew(false)}><X size={20} /></button></div><label>Note title<input required value={title} onChange={e => setTitle(e.target.value)} /></label><label>Notebook<input list="note-categories" value={category} onChange={e => setCategory(e.target.value)} /><datalist id="note-categories">{categories.map(name => <option key={name}>{name}</option>)}</datalist></label><label>Your notes<textarea rows={6} value={content} onChange={e => setContent(e.target.value)} /></label><button className="ref-primary" type="submit">Save note<ArrowRight size={17} /></button></form></ViewportOverlay>}
    {aiTask && active && <AIGenerator task={aiTask} initialText={active.summary} category={active.category} onClose={() => setAITask(null)} onSave={draft => {
      if (aiTask === 'summary') { const id = addNote({ title: draft.title, fileName: draft.title + '.notes', fileSize: 'Text note', category: active.category, summary: draft.summary + '\n\n' + draft.keyPoints.join('\n'), keyTopics: draft.keyPoints, keyConcepts: [], importantTerms: [] }); setSelectedId(id) }
      else { const id = createDeck(draft.title, active.category); draft.cards.forEach(card => addCard(id, card.question, card.answer, active.category)); setNotice(draft.cards.length + ' AI flashcards saved') }
      setAITask(null)
    }}/>}
  </div>
}
