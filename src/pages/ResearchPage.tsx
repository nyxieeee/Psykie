import { Bookmark, Copy, ArrowSquareOut, FileText, Folder, MagnifyingGlass, Plus, Spinner, X } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { ReferenceEmpty, ReferenceHeader, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { AIGenerator } from '../components/AIGenerator'
import { AIDraft, ResearchResult, TRUSTED_SOURCES, searchTrustedResearch } from '../utils/ai'
import { readWorkspaceList, workspaceStorage } from '../utils/workspaceStorage'
import { useStudyStore } from '../store'
import { trustedSource } from '../../supabase/functions/_shared/contracts'
import '../research.css'

type SavedReference = Partial<ResearchResult> & { id: string; title: string; url?: string; tags?: string[]; isFavorite?: boolean; citation?: string; journal?: string; year?: number; authors?: string[] }
const safeUrl = (url?: string) => { try { const parsed = new URL(url || ''); return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : undefined } catch { return undefined } }

function formatAPA7(item: SavedReference | ResearchResult): string {
  const retrievedDate = 'retrievedAt' in item && item.retrievedAt
    ? new Date(item.retrievedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const year = ('year' in item && item.year) ? item.year : 'n.d.'
  const url = item.url || ''
  const title = item.title || 'Untitled'
  const source = ('source' in item && item.source) ? item.source : (('journal' in item && item.journal) ? item.journal : '')
  const authors = ('authors' in item && item.authors && item.authors.length > 0) ? item.authors : null
  const kind = ('kind' in item) ? item.kind : 'resource'

  // If pre-formatted citation exists, use it
  if ('citation' in item && item.citation) return item.citation

  let authorPart = ''
  if (authors && authors.length > 0) {
    if (authors.length === 1) authorPart = authors[0] + '.'
    else if (authors.length <= 20) authorPart = authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1] + '.'
    else authorPart = authors.slice(0, 19).join(', ') + ', . . . ' + authors[authors.length - 1] + '.'
  } else if (source) {
    authorPart = source + '.'
  }

  if (kind === 'journal') {
    // APA 7 journal: Author(s). (Year). Title. Journal Name. URL
    return [
      authorPart,
      `(${year}).`,
      title + '.',
      source ? source + '.' : '',
      url ? url : ''
    ].filter(Boolean).join(' ')
  } else {
    // APA 7 web/resource: Author/Org. (Year, Month Day). Title. Site. Retrieved Month Day, Year, from URL
    return [
      authorPart,
      `(${year}).`,
      title + '.',
      source ? source + '.' : '',
      url ? `Retrieved ${retrievedDate}, from ${url}` : ''
    ].filter(Boolean).join(' ')
  }
}

export function ResearchPage() {
  const { addNote } = useStudyStore()
  const [query, setQuery] = useState(''), [searchedQuery, setSearchedQuery] = useState('')
  const [results, setResults] = useState<ResearchResult[]>([]), [loading, setLoading] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('')
  const [view, setView] = useState('search'), [kind, setKind] = useState('all'), [source, setSource] = useState('all')
  const [saved, setSaved] = useState<SavedReference[]>(() => readWorkspaceList('psykie-research'))
  const [collections, setCollections] = useState<string[]>(() => readWorkspaceList('psykie-research-collections'))
  const [collection, setCollection] = useState('all'), [newCollection, setNewCollection] = useState('')
  const [recent, setRecent] = useState<string[]>(() => readWorkspaceList('psykie-research-recent'))
  const [libraryQuery, setLibraryQuery] = useState(''), [showAdd, setShowAdd] = useState(false), [manualTitle, setManualTitle] = useState(''), [manualUrl, setManualUrl] = useState('')
  const [showSummary, setShowSummary] = useState(false), [copied, setCopied] = useState('')
  const controller = useRef<AbortController | null>(null), sequence = useRef(0)
  useEffect(() => () => controller.current?.abort(), [])
  useEffect(() => { workspaceStorage.setItem('psykie-research', JSON.stringify(saved)) }, [saved])
  useEffect(() => { workspaceStorage.setItem('psykie-research-collections', JSON.stringify(collections)) }, [collections])
  useEffect(() => { workspaceStorage.setItem('psykie-research-recent', JSON.stringify(recent)) }, [recent])
  const search = async (text = query) => {
    if (!text.trim() || text.length > 400) return
    controller.current?.abort(); controller.current = new AbortController(); const current = ++sequence.current
    setLoading(true); setError(''); setNotice(''); setResults([]); setSearchedQuery(text.trim()); setView('search')
    try { const response = await searchTrustedResearch(text.trim(), controller.current.signal); if (current !== sequence.current) return; setResults(response.results); setNotice(response.notice); setRecent(previous => [text.trim(), ...previous.filter(item => item !== text.trim())].slice(0,5)) }
    catch(error) { if (current === sequence.current && !controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'Search failed. Please try again.') }
    finally { if (current === sequence.current) setLoading(false) }
  }
  const toggleSave = (result: ResearchResult) => setSaved(previous => previous.some(item => item.url === result.url) ? previous.filter(item => item.url !== result.url) : [{ ...result, isFavorite: true, tags: [] }, ...previous])
  const matches = (item: Partial<ResearchResult>) => (kind === 'all' || item.kind === kind) && (source === 'all' || item.domain === source || trustedSource(item.url || '')?.domain === source)
  const shownResults = results.filter(matches)
  const shownSaved = saved.filter(item => matches(item) && (collection === 'all' || item.tags?.includes(collection)) && (item.title + ' ' + (item.summary || '')).toLowerCase().includes(libraryQuery.toLowerCase()))
  const citation = formatAPA7
  const copy = async (item: SavedReference | ResearchResult) => { try { await navigator.clipboard.writeText(citation(item)); setCopied(item.id); setTimeout(() => setCopied(''), 2000) } catch { setError('The citation could not be copied. Open the source and copy its link.') } }
  const saveSummary = (draft: AIDraft) => { addNote({ title: draft.title, fileName: draft.title + '.notes', fileSize: 'Text note', category: 'Research Methods', summary: draft.summary + '\n\n' + draft.keyPoints.join('\n'), keyTopics: draft.keyPoints, keyConcepts: [], importantTerms: [] }); setShowSummary(false); setNotice('Summary saved as a new note.') }
  return <div className="reference-page research-search-page"><ReferenceHeader title="Research" subtitle="Your focused search for psychology, mental health, and neuroscience."/>
    <section className="ref-panel research-search-hero"><form onSubmit={event => {event.preventDefault();search()}} className="research-query"><MagnifyingGlass size={23}/><input aria-label="Search trusted research" placeholder="Ask a question or search a psychology topic..." value={query} maxLength={400} onChange={event => setQuery(event.target.value)}/><button className="ref-primary" disabled={!query.trim() || loading}>{loading ? <><Spinner size={17} className="animate-spin"/>Searching...</> : 'Search'}</button></form><p>Source-checked search with AI relevance notes. Results are restricted to the listed institutional and publisher sources.</p>{recent.length > 0 && <div className="research-recent"><span>Recent</span>{recent.map(item => <button key={item} onClick={() => {setQuery(item);search(item)}}>{item}</button>)}</div>}<details className="research-source-policy"><summary>How sources are selected</summary><p>Only actual web-search citations from the sources below can appear. Mistral checks topic relevance after links pass the domain policy. This is a curated source policy, not a guarantee of accuracy or peer review. Journal/publisher results can include reviews and other page types; check the original article.</p><ul>{TRUSTED_SOURCES.map(item => <li key={item.domain}><strong>{item.name}</strong><span>{item.domain}</span></li>)}</ul></details></section>
    <div className="research-workspace"><section className="research-results"><div className="research-results-toolbar"><ReferenceTabs items={[{id:'search',label:'Search results'},{id:'saved',label:'Saved',count:saved.length}]} value={view} onChange={setView}/><div className="research-filters"><select aria-label="Source type" value={kind} onChange={event => setKind(event.target.value)}><option value="all">All source types</option><option value="journal">Journals / publishers</option><option value="guidance">Institutional guidance</option><option value="resource">Professional resources</option></select><select aria-label="Research source" value={source} onChange={event => setSource(event.target.value)}><option value="all">{view === 'search' ? 'All approved sources' : 'All sources'}</option>{TRUSTED_SOURCES.map(item => <option key={item.domain} value={item.domain}>{item.name}</option>)}</select></div></div>
      {error && <div className="ref-form-error research-search-error" role="alert"><p>{error}</p>{searchedQuery && <button className="ref-secondary" disabled={loading} onClick={() => search(searchedQuery)}>Try again</button>}</div>}{notice && <p className="research-results-notice" role="status">{notice}</p>}
      {view === 'search' ? <>{loading ? <div className="ref-panel research-loading" role="status"><Spinner size={28} className="animate-spin"/><h2>Finding relevant sources</h2><p>Searching the web, checking source domains, and matching your topic.</p></div> : !searchedQuery ? <div className="ref-panel research-start"><MagnifyingGlass size={35}/><h2>Start with a question.</h2><p>Search a concept, compare theories, or explore evidence for a topic. Save useful sources to build your own reading list.</p></div> : !shownResults.length && !error ? <ReferenceEmpty>{results.length ? 'No results match these source filters.' : 'No matching sources to show. Try a more specific topic.'}</ReferenceEmpty> : shownResults.map(result => <article className="ref-panel research-result" key={result.id}><div className="research-result-source"><FileText size={18}/><span>{result.source}</span><span className="ref-tag tint-2">{result.kind === 'journal' ? 'Journal / publisher' : result.kind === 'guidance' ? 'Institutional guidance' : 'Professional resource'}</span></div><a className="research-result-title" href={result.url} target="_blank" rel="noopener noreferrer">{result.title}<ArrowSquareOut size={17}/></a><small className="research-domain">{result.domain}</small><p>{result.summary}</p><details className="research-relevance"><summary>Why this matches</summary><p>{result.relevance}</p><small>AI relevance note. Check the original source; this is not a full-paper summary.</small></details><div className="research-result-actions"><button className="ref-secondary" aria-label={saved.some(item => item.url === result.url) ? 'Remove from reading list' : 'Save to reading list'} onClick={() => toggleSave(result)}><Bookmark size={17} weight={saved.some(item => item.url === result.url) ? 'fill' : 'regular'}/>{saved.some(item => item.url === result.url) ? 'Saved' : 'Save'}</button><button className="ref-text-action" onClick={() => copy(result)}><Copy size={16}/>{copied === result.id ? 'Copied' : 'Copy APA 7'}</button><small>Retrieved {new Date(result.retrievedAt).toLocaleDateString()}</small></div></article>)}</> : <><div className="research-library-toolbar"><input aria-label="Find saved research" placeholder="Find a saved reference..." value={libraryQuery} onChange={event => setLibraryQuery(event.target.value)}/><select aria-label="Collection" value={collection} onChange={event => setCollection(event.target.value)}><option value="all">All collections</option>{collections.map(name => <option key={name}>{name}</option>)}</select></div>{shownSaved.map(item => <article className="ref-panel research-result" key={item.id}><small>{item.source || item.journal || 'Personal reference'}</small><h2>{safeUrl(item.url) ? <a href={safeUrl(item.url)} target="_blank" rel="noopener noreferrer">{item.title}<ArrowSquareOut size={16}/></a> : item.title}</h2><p>{item.summary || 'Open the source to read the original material.'}</p><div className="research-result-actions"><button className="ref-text-action" onClick={() => copy(item)}><Copy size={16}/>{copied === item.id ? 'Copied' : 'Copy APA 7'}</button><select aria-label={'Collection for '+item.title} value={item.tags?.find(tag => collections.includes(tag)) || ''} onChange={event => setSaved(previous => previous.map(entry => entry.id === item.id ? {...entry,tags:event.target.value ? [event.target.value] : []} : entry))}><option value="">No collection</option>{collections.map(name => <option key={name}>{name}</option>)}</select><button className="ref-text-action" onClick={() => setSaved(previous => previous.filter(entry => entry.id !== item.id))}>Remove</button></div></article>)}{!shownSaved.length && <ReferenceEmpty>No saved references match this view.</ReferenceEmpty>}</>}
    </section><aside className="ref-panel research-library"><h2>Your research space</h2><p>{saved.length} saved references</p><button className="ref-secondary ref-wide" onClick={() => {setView('saved');setKind('all');setSource('all');setCollection('all')}}><Bookmark size={17}/>Open reading list</button><button className="ref-secondary ref-wide" onClick={() => setShowAdd(true)}><Plus size={17}/>Add personal reference</button><h3><Folder size={18}/>Collections</h3>{collections.map(name => <button className="research-collection" key={name} onClick={() => {setView('saved');setCollection(name);setSource('all');setKind('all')}}><span>{name}</span><small>{saved.filter(item => item.tags?.includes(name)).length}</small></button>)}<form className="research-collection-form" onSubmit={event => {event.preventDefault();const name=newCollection.trim();if(name && !collections.includes(name))setCollections(previous => [...previous,name]);setNewCollection('')}}><input aria-label="New collection name" value={newCollection} maxLength={80} onChange={event => setNewCollection(event.target.value)} placeholder="New collection"/><button aria-label="Add collection" className="ref-square-button" disabled={!newCollection.trim()}><Plus size={17}/></button></form><h3>Work with your source text</h3><p>Paste an abstract or excerpt to create a summary. The original is preserved.</p><button className="ref-primary ref-wide" onClick={() => setShowSummary(true)}>Summarize text with AI</button></aside></div>
    {showAdd && <ViewportOverlay onDismiss={() => setShowAdd(false)}><form className="glass-modal ref-form-dialog" onSubmit={event => {event.preventDefault();if(!manualTitle.trim() || !safeUrl(manualUrl))return;setSaved(previous => [{id:crypto.randomUUID(),title:manualTitle.trim(),url:safeUrl(manualUrl),tags:[],isFavorite:true},...previous]);setManualTitle('');setManualUrl('');setShowAdd(false);setView('saved');setSource('all');setKind('all')}}><div className="ref-panel-title"><h2>Add personal reference</h2><button type="button" aria-label="Close" onClick={() => setShowAdd(false)}><X size={20}/></button></div><p>Personal references are saved separately from verified search results.</p><label>Title<input required value={manualTitle} onChange={event => setManualTitle(event.target.value)}/></label><label>Source URL<input type="url" required value={manualUrl} onChange={event => setManualUrl(event.target.value)}/></label><button className="ref-primary" disabled={!manualTitle.trim() || !safeUrl(manualUrl)}>Save reference</button></form></ViewportOverlay>}
    {showSummary && <AIGenerator task="summary" onClose={() => setShowSummary(false)} onSave={saveSummary}/>}</div>
}
