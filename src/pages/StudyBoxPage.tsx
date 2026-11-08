import { downloadWord, printFlashcards, reviewerText } from '../utils/studyExport'
import { plainText } from '../../supabase/functions/_shared/plainText'
import { ReviewerContent } from '../components/ReviewerContent'
import { StudyFilePicker } from '../components/StudyFilePicker'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Cards, ChartBar, DownloadSimple, FileText, Folder, PencilSimple, Plus, Sparkle, Star, Trash, X } from '@phosphor-icons/react'
import { AIGenerator } from '../components/AIGenerator'
import { ReferenceEmpty, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useStudyStore } from '../store'
import { AITask, extractImageText } from '../utils/ai'
import { deleteDocumentFile, getDocumentFile, storeDocumentFile } from '../utils/documentFiles'
import { MAX_SOURCE_LENGTH, canReadStudyUpload, readStudyUpload } from '../utils/studyUpload'
import { LIBRARY_FOLDERS_KEY, LibraryFolder, LibraryMaterial, librarySource, readLibrary, saveLibrary } from '../utils/studyLibrary'
import { readWorkspaceList, workspaceStorage } from '../utils/workspaceStorage'
import '../library.css'
import '../study-workflows.css'

const subjects = ['General Psychology','Cognitive Psychology','Developmental Psychology','Abnormal Psychology','Social Psychology','Biological Psychology','Research Methods','Statistics','Psychological Assessment','Ethics']
const emptyForm = {title:'',text:'',summary:'',category:'General Psychology',folderId:'',tags:'',sourceName:''}
type Generation = {task: AITask; text: string; category: string; sourceName: string; ids: string[]}

export function StudyBoxPage() {
  const navigate = useNavigate(), location = useLocation()
  const {notes, addNote, createDeck, addCard} = useStudyStore()
  const [items,setItems] = useState<LibraryMaterial[]>(readLibrary)
  const [folders,setFolders] = useState<LibraryFolder[]>(() => readWorkspaceList(LIBRARY_FOLDERS_KEY))
  const [folder,setFolder] = useState('all'), [view,setView] = useState('all'), [search,setSearch] = useState(''), [sort,setSort] = useState('recent')
  const [params,setParams] = useSearchParams()
  const activeId = params.get('material') || ''
  const setActiveId = (id:string) => setParams(previous=>{const next=new URLSearchParams(previous);if(id)next.set('material',id);else next.delete('material');return next})
  const [selected,setSelected] = useState<string[]>([]), [previewTab,setPreviewTab] = useState('source')
  const [modal,setModal] = useState<'material'|'folder'|'delete'|null>(null), [editId,setEditId] = useState(''), [folderEdit,setFolderEdit] = useState(''), [folderName,setFolderName] = useState('')
  const [deletion,setDeletion] = useState<{kind:'material'|'folder';id:string}|null>(null)
  const [form,setForm] = useState(emptyForm), [sourceMode,setSourceMode] = useState('file'), [incomingFile,setIncomingFile] = useState<File|null>(null), [noteId,setNoteId] = useState('')
  const [ocr,setOCR] = useState(false), [reading,setReading] = useState(false), [progress,setProgress] = useState('')
  const [error,setError] = useState(''), [notice,setNotice] = useState(''), [generation,setGeneration] = useState<Generation|null>(null)
  const [savingReviewer,setSavingReviewer]=useState(false)
  const controller = useRef<AbortController|null>(null), previewRef = useRef<HTMLElement>(null)
  useEffect(() => () => controller.current?.abort(), [])
  const visible = items.filter(item => (folder==='all' || item.folderId===folder) && (view!=='favorites' || item.favorite) && [item.title,item.category,item.sourceName,...item.tags].join(' ').toLowerCase().includes(search.toLowerCase())).sort((a,b) => sort==='name' ? a.title.localeCompare(b.title) : b.updatedAt.localeCompare(a.updatedAt))
  const active = items.find(item=>item.id===activeId)
  const commit = (next: LibraryMaterial[]) => {
    try { saveLibrary(next);setItems(next);return true } catch { setError('Your browser could not save the library. Free some site storage or download a copy of your material first.');return false }
  }
  const commitFolders = (next: LibraryFolder[]) => {
    try { workspaceStorage.setItem(LIBRARY_FOLDERS_KEY,JSON.stringify(next));setFolders(next);return true } catch {setError('Your browser could not save this folder. Check available site storage.');return false}
  }
  useEffect(() => {
    const id=(location.state as {materialId?:string}|null)?.materialId
    if (!id) return
    setItems(readLibrary());setSelected([]);setFolder('all');setView('all');setSearch('')
    navigate(location.pathname+'?material='+encodeURIComponent(id),{replace:true,state:null})
  },[location.state,location.pathname,navigate])
  const choose = (id: string) => {
    setSelected([]);setActiveId(id);setPreviewTab('source')
    if (window.innerWidth<980) requestAnimationFrame(()=>previewRef.current?.scrollIntoView({block:'start',behavior:'instant'}))
  }
  const toggleFavorite = (item: LibraryMaterial) => {setError('');commit(items.map(value=>value.id===item.id?{...value,favorite:!value.favorite}:value))}
  const openMaterial = (item?: LibraryMaterial) => {
    setError('');setNotice('');setEditId(item?.id||'');setSourceMode(item?'text':'file');setIncomingFile(null);setNoteId('');setOCR(false)
    setForm(item?{title:item.title,text:item.text,summary:item.summary||'',category:item.category,folderId:item.folderId||'',tags:item.tags.join(', '),sourceName:item.sourceName}:{...emptyForm,folderId:folder==='all'?'':folder})
    setModal('material')
  }
  const dismiss = () => {controller.current?.abort();setModal(null);setError('')}
  const upload = async (file?: File) => {
    if (!file) return
    if(file.size>10*1024*1024){setIncomingFile(null);setForm(previous=>({...previous,text:'',sourceName:''}));setError('Choose a file smaller than 10 MB.');return}
    setIncomingFile(file);setForm(previous=>({...previous,title:previous.title||file.name.replace(/\.[^.]+$/,''),text:'',sourceName:file.name}));setError('');setNotice('')
    if(!canReadStudyUpload(file)){setNotice('This file can be saved as an original. Add readable text to use it for quizzes or flashcards.');return}
    controller.current=new AbortController();setReading(true)
    try {
      const text=await readStudyUpload(file,{ocr:ocr?extractImageText:undefined,signal:controller.current.signal,onProgress:setProgress})
      setIncomingFile(file);setForm(previous=>({...previous,title:previous.title||file.name.replace(/\.[^.]+$/,''),text,sourceName:file.name}))
    } catch(error) {if(!controller.current.signal.aborted)setError((error instanceof Error?error.message:'Could not read this material.')+' You can still save the original file, or paste its text below.')}
    finally {setReading(false);setProgress('')}
  }
  const saveMaterial = async (event: React.FormEvent) => {
    event.preventDefault();setError('')
    const tags=[...new Set(form.tags.split(',').map(tag=>tag.trim()).filter(Boolean))]
    if(tags.length>10||tags.some(tag=>tag.length>30)){setError('Use up to 10 tags, with 30 characters or fewer per tag.');return}
    if(!form.title.trim()||(!form.text.trim()&&!incomingFile&&!items.find(item=>item.id===editId)?.fileId)||form.text.length>MAX_SOURCE_LENGTH){setError('Enter a title, then choose a file or add up to 25,000 characters of study text.');return}
    const existing=items.find(item=>item.id===editId), now=new Date().toISOString()
    const item:LibraryMaterial={id:existing?.id||'material-'+crypto.randomUUID(),title:form.title.trim(),text:form.text.trim(),summary:form.summary.trim()||undefined,category:form.category,folderId:form.folderId||null,tags,favorite:existing?.favorite||false,kind:existing?.kind||(incomingFile?'upload':sourceMode==='note'?'note':'text'),sourceName:form.sourceName||form.title.trim(),createdAt:existing?.createdAt||now,updatedAt:now,fileId:existing?.fileId,ownsFile:existing?.ownsFile}
    let storedId=''
    if(incomingFile){setReading(true);controller.current=new AbortController();try{storedId='library-file-'+crypto.randomUUID();await storeDocumentFile(storedId,incomingFile);controller.current.signal.throwIfAborted();item.fileId=storedId;item.ownsFile=true}catch(error){if(storedId)await deleteDocumentFile(storedId).catch(()=>{});setReading(false);if(!controller.current.signal.aborted)setError('The original file could not be saved. Try again.');return}setReading(false)}
    if(!commit(existing?items.map(value=>value.id===existing.id?item:value):[item,...items])){if(storedId)await deleteDocumentFile(storedId).catch(()=>{});return}
    setModal(null);setSelected([]);setFolder('all');setView('all');setSearch('');setActiveId(item.id);setPreviewTab('source');setNotice('Material saved to your library.')
  }
  const study = (task: AITask) => {
    setError('');setNotice('')
    if(active?.reviewer&&!selected.length&&(task==='quiz'||task==='flashcards')) {
      const draft=active.reviewer
      if(task==='flashcards'){const existing=useStudyStore.getState().decks.find(deck=>deck.description==='reviewer:'+active.id);const id=existing?.id||createDeck(active.title,active.category,'reviewer:'+active.id);if(!existing)draft.cards.forEach(card=>addCard(id,card.question,card.answer,active.category));navigate('/flashcards',{state:{deckId:id}})}
      else {const id='quiz-'+active.id,existing=readWorkspaceList<{id:string}>('psykie-quizzes'),quiz={id,title:active.title+' - self-test',category:active.category,difficulty:'medium',questionsCount:draft.questions.length,passingScore:70,questions:draft.questions,createdAt:new Date().toISOString(),sourceName:active.title,mode:'study'};if(!existing.some(item=>item.id===id))workspaceStorage.setItem('psykie-quizzes',JSON.stringify([quiz,...existing]));navigate('/quizzes',{state:{startQuizId:id}})}
      return
    }
    const sources=active?[active]:selected.length?items.filter(item=>selected.includes(item.id)):[]
    try {
      const text=librarySource(sources), category=sources.every(item=>item.category===sources[0].category)?sources[0].category:'General Psychology', sourceName=sources.length===1?sources[0].title:`${sources.length} Library materials`
      if(task==='quiz')navigate('/quizzes',{state:{studyText:text,sourceName,category}})
      else setGeneration({task,text,category,sourceName,ids:sources.map(item=>item.id)})
    } catch(error){setError(error instanceof Error?error.message:'Choose a readable material.')}
  }
  const saveToNotes = () => {
    if(!active)return
    if(!active.text.trim()){setError('Add study text using Edit material before saving this file to Notes.');return}
    const content=previewTab==='summary'&&active.summary?active.summary:active.text
    const id=addNote({title:active.title+(previewTab==='summary'?' - summary':''),fileName:active.sourceName,fileSize:'Library text',category:active.category,summary:content,keyTopics:[],keyConcepts:[],importantTerms:[]})
    navigate('/notes',{state:{noteId:id}})
  }
  const download = async (original: boolean) => {
    if(!active)return
    setError('')
    try {
      if(!original){await downloadWord(active.title,active.reviewer?reviewerText(active.reviewer):previewTab==='summary'?active.summary||'':active.text);return}
      const file=active.fileId?await getDocumentFile(active.fileId):null
      if(!file)throw Error('The original file is unavailable in this browser. Your saved study text is still available.')
      const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download=original?active.sourceName:(active.title.replace(/[^a-zA-Z0-9 _-]/g,'').slice(0,80)||'study-material')+'.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
    }catch(error){setError(error instanceof Error?error.message:'Download failed. Please try again.')}
  }
  const remove = async () => {
    if(!deletion)return
    setError('')
    if(deletion.kind==='folder'){
      if(!commit(items.map(item=>item.folderId===deletion.id?{...item,folderId:null}:item)))return
      if(!commitFolders(folders.filter(value=>value.id!==deletion.id)))return
      setFolder('all');setNotice('Folder removed. Its materials are now unfiled.')
    }else{
      const item=items.find(value=>value.id===deletion.id)
      if(!commit(items.filter(value=>value.id!==deletion.id)))return
      setSelected(previous=>previous.filter(id=>id!==deletion.id))
      if(item?.ownsFile&&item.fileId){try{await deleteDocumentFile(item.fileId)}catch{setNotice('Material removed. Its original file could not be cleared from browser storage.');setModal(null);return}}
      setNotice('Material removed from your library.')
    }
    setDeletion(null);setModal(null)
  }
  return <div className="reference-page study-library-page" data-focused-reader={!!active}>
    <ReferenceHeader title="Library" subtitle="Your readings and notes, ready to turn into practice." action="Add material" onAction={()=>openMaterial()} actions={<button className="ref-secondary" onClick={()=>{setError('');setGeneration({task:'reviewer',text:'',category:'General Psychology',sourceName:'',ids:[]})}}><Sparkle size={17}/>Create reviewer</button>}/>
    {!active&&<div className="library-intro"><p><BookOpen size={18}/>{items.length} materials <span>|</span> {folders.length} folders <span>|</span> {items.filter(item=>item.favorite).length} favorites</p><button className="ref-secondary" onClick={()=>navigate('/documents')}>Open document vault</button></div>}
    {error&&!modal&&!generation&&<p role="alert" className="ref-form-error">{error}</p>}{notice&&<p role="status" className="ref-inline-notice">{notice}</p>}
    <div className="library-layout" data-view={active?'reader':'browse'}>
      {!active&&<>
      <aside className="ref-panel library-folders"><div className="ref-panel-title"><h2>Folders</h2><button aria-label="New library folder" onClick={()=>{setFolderEdit('');setFolderName('');setError('');setModal('folder')}}><Plus size={19}/></button></div>
        <button className={folder==='all'&&view==='all'?'selected':''} onClick={()=>{setFolder('all');setView('all')}}><BookOpen size={19}/>All materials<small>{items.length}</small></button>
        <button className={view==='favorites'?'selected':''} onClick={()=>{setFolder('all');setView('favorites')}}><Star size={19}/>Favorites<small>{items.filter(item=>item.favorite).length}</small></button>
        {folders.map(item=><div className="library-folder-row" key={item.id}><button className={folder===item.id?'selected':''} onClick={()=>{setFolder(item.id);setView('all')}}><Folder size={19}/><span>{item.name}</span><small>{items.filter(value=>value.folderId===item.id).length}</small></button><button aria-label={'Rename folder '+item.name} onClick={()=>{setFolderEdit(item.id);setFolderName(item.name);setError('');setModal('folder')}}><PencilSimple size={14}/></button><button aria-label={'Remove folder '+item.name} onClick={()=>{setDeletion({kind:'folder',id:item.id});setModal('delete')}}><Trash size={14}/></button></div>)}
        <p className="library-storage-note">Saved in this browser for your account. OCR and AI generation use your AI allowance.</p>
      </aside>
      <section className="ref-panel library-collection"><div className="library-collection-heading"><h2>{view==='favorites'?'Favorites':folders.find(item=>item.id===folder)?.name||'Your materials'}</h2><select aria-label="Sort library" value={sort} onChange={e=>setSort(e.target.value)}><option value="recent">Recently updated</option><option value="name">Name A-Z</option></select></div><ReferenceSearch value={search} onChange={setSearch} placeholder="Search materials, subjects, or tags..."/>
        {!!visible.length&&<div className="library-select-row"><label><input type="checkbox" aria-label="Select visible materials" checked={visible.every(item=>selected.includes(item.id))} onChange={e=>setSelected(e.target.checked?[...new Set([...selected,...visible.map(item=>item.id)])]:selected.filter(id=>!visible.some(item=>item.id===id)))}/>Select visible</label><small>{visible.length} materials</small></div>}
        {!!selected.length&&<div className="library-selection" aria-label="Selected study materials"><strong>{selected.length} selected</strong><button className="ref-text-action" onClick={()=>{setSelected([]);setError('')}}>Clear selection</button><div className="study-actions"><button className="ref-secondary" onClick={()=>study('reviewer')}>Create reviewer</button><button className="ref-secondary" onClick={()=>study('quiz')}><ChartBar size={16}/>Quiz selected</button><button className="ref-secondary" onClick={()=>study('flashcards')}><Cards size={16}/>Cards from selected</button><button className="ref-secondary" onClick={()=>study('summary')}><Sparkle size={16}/>Summarize selected</button></div></div>}
        <div className="library-material-list">{visible.map(item=><article key={item.id} className={'library-material'+(selected.includes(item.id)?' selected':'')}><input type="checkbox" aria-label={'Select material '+item.title} checked={selected.includes(item.id)} onChange={()=>setSelected(previous=>previous.includes(item.id)?previous.filter(id=>id!==item.id):[...previous,item.id])}/><button className="library-material-open" aria-label={'Open material '+item.title} onClick={()=>choose(item.id)}><span className="material-paper-preview" aria-hidden="true"><FileText size={24}/><strong>{plainText(item.title)}</strong><span>{item.text.replace(/[#*_`>]/g,'').slice(0,180)}</span></span><span><strong>{plainText(item.title)}</strong><small>{item.category} | {item.kind==='reviewer'?'Study reviewer':item.kind==='summary'?'AI summary':item.kind==='upload'?'Uploaded file':item.kind==='document'?'Document vault':item.kind==='note'?'Saved note':'Text material'}</small><p>{item.text.slice(0,110)}</p><span className="library-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</span></span></button><button className="library-favorite" aria-label={(item.favorite?'Unfavorite ':'Favorite ')+item.title} onClick={()=>toggleFavorite(item)}><Star size={18} weight={item.favorite?'fill':'regular'}/></button></article>)}</div>
        {!visible.length&&<div className="library-empty"><BookOpen size={40}/><h3>{items.length?'No matching materials':'Build your library'}</h3><p>{items.length?'Try another folder or search.':'Add a reading, a photo of your notes, or text you want to understand. Keep the extracted text and study it whenever you need.'}</p><button className="ref-primary" onClick={()=>openMaterial()}>{items.length?'Add another material':'Add your first material'}</button></div>}
      </section>
      </>}
      {active&&<section ref={previewRef} className="ref-panel library-reader" aria-label="Material reader">{active?<>
        <div className="workflow-back"><button className="ref-secondary" onClick={()=>{setActiveId('');setSelected([])}}><ArrowLeft size={16}/>Back to Library</button></div>
        <div className="ref-panel-title"><div><small>{active.category}</small><h2>{plainText(active.title)}</h2></div><button aria-label="Edit material" onClick={()=>openMaterial(active)}><PencilSimple size={18}/></button><button aria-label="Delete material" onClick={()=>{setDeletion({kind:'material',id:active.id});setModal('delete')}}><Trash size={18}/></button></div>
        <div className="library-study-actions"><p>{active.reviewer?'Practice with the included cards and questions. No extra AI request is needed.':selected.length?`Study actions use the ${selected.length} selected materials.`:'Create practice from this saved source.'}</p><div className="study-actions">{active.reviewer?<><button className="ref-primary" onClick={()=>study('quiz')}><ChartBar size={17}/>Start self-test</button><button className="ref-secondary" onClick={()=>study('flashcards')}><Cards size={17}/>Study flashcards</button></>:<><button className="ref-primary" disabled={!active.text.trim()} onClick={()=>study('reviewer')}><Sparkle size={17}/>Generate reviewer</button><button className="ref-secondary" disabled={!active.text.trim()} onClick={()=>study('quiz')}><ChartBar size={17}/>Quiz me on this</button><button className="ref-secondary" disabled={!active.text.trim()} onClick={()=>study('flashcards')}><Cards size={17}/>Make flashcards</button><button className="ref-secondary" disabled={!active.text.trim()} onClick={()=>study('summary')}><Sparkle size={17}/>Summarize</button></>}</div></div>
        {active.reviewer?<><p className="library-source-name">Based on: {active.sourceName}</p><div className="reviewer-source-links">{active.sourceIds?.map(id=>{const source=items.find(item=>item.id===id);return source?<button key={id} className="ref-secondary" onClick={()=>choose(id)}><FileText size={15}/>{source.title}</button>:null})}</div><ReviewerContent key={active.id} draft={active.reviewer} category={active.category}/></>:<>        <p className="library-source-name">{!active.text.trim()&&<span>Original file saved. Use Edit material to add text before creating AI practice. </span>}{active.sourceName} | Updated {new Date(active.updatedAt).toLocaleDateString()}</p><ReferenceTabs items={[{id:'source',label:'Source text'},{id:'summary',label:'AI summary'}]} value={previewTab} onChange={setPreviewTab}/>
        {previewTab==='summary'&&!active.summary?<div className="library-empty"><Sparkle size={30}/><p>Build a study summary from this material. Your original text stays intact.</p><button className="ref-secondary" onClick={()=>{setSelected([]);try{setGeneration({task:'summary',text:librarySource([active]),category:active.category,sourceName:active.title,ids:[active.id]});setError('')}catch(error){setError(error instanceof Error?error.message:'Source is too long.')}}}>Generate material summary</button></div>:<div className="library-reading" tabIndex={0} aria-label={previewTab==='summary'?'Saved material summary':'Saved material text'}>{plainText(previewTab==='summary'?active.summary||'':active.text)}</div>}
        {(previewTab==='summary'&&active.summary||active.kind==='summary')&&<p className="ref-inline-notice">AI-generated summary. Check it against your original source.</p>}
</>}
        <div className="library-reader-footer"><button className="ref-text-action" disabled={!active.text.trim()||previewTab==='summary'&&!active.summary} onClick={saveToNotes}>Save {previewTab==='summary'?'summary':'text'} to Notes</button><button className="ref-text-action" disabled={!active.text.trim()||previewTab==='summary'&&!active.summary} onClick={()=>void download(false)}><DownloadSimple size={15}/>Download Word (.docx)</button>{!!active.reviewer?.cards.length&&<button className="ref-text-action" onClick={()=>{try{printFlashcards(active.title,active.reviewer!.cards)}catch(error){setError(error instanceof Error?error.message:'Print failed.')}}}>Print flashcards</button>}{active.fileId&&<button className="ref-text-action" onClick={()=>void download(true)}>Download original</button>}</div>
      </>:<ReferenceEmpty>Select a material to read, organize, and study it.</ReferenceEmpty>}</section>}
    </div>
    {modal==='material'&&<ViewportOverlay onDismiss={dismiss}><form className="glass-modal ref-form-dialog library-material-dialog" onSubmit={saveMaterial}><div className="ref-panel-title"><h2>{editId?'Edit material':'Add study material'}</h2><button type="button" aria-label="Close material editor" onClick={dismiss}><X size={20}/></button></div>
      {!editId&&<><label>Material source<select aria-label="Material source" disabled={reading} value={sourceMode} onChange={e=>{setSourceMode(e.target.value);setIncomingFile(null);setNoteId('');setForm(previous=>({...previous,text:'',sourceName:''}));setError('')}}><option value="file">Upload a file</option><option value="text">Paste or write text</option><option value="note">Import a saved note</option></select></label>
        {sourceMode==='file'&&<><label className="study-ocr-toggle"><input type="checkbox" aria-label="Use AI OCR" checked={ocr} disabled={reading} onChange={e=>setOCR(e.target.checked)}/><span>Use AI OCR for photos and scanned pages<small>Sends images to Mistral when selected and uses your AI allowance. Up to 5 scanned pages per PDF.</small></span></label><StudyFilePicker disabled={reading} onSelect={file=>void upload(file)} hint="Any file up to 10 MB. PDF, Word, slides and text can be read for study. Photos and scans need AI OCR."/>{incomingFile&&<p>Original: {incomingFile.name}</p>}{incomingFile&&!form.text.trim()&&!reading&&<p role="status" className="ref-inline-notice">The original file is ready to save. Add readable text below to use it for quizzes or flashcards.</p>}</>}
        {sourceMode==='note'&&<label>Saved note<select aria-label="Saved note to import" value={noteId} onChange={e=>{const note=notes.find(item=>item.id===e.target.value);setNoteId(e.target.value);if(note)setForm(previous=>({...previous,title:note.title,text:note.summary,category:note.category,sourceName:note.title}))}}><option value="">Choose a note</option>{notes.map(note=><option key={note.id} value={note.id}>{note.title}</option>)}</select>{!notes.length&&<small>No saved notes yet. Create one in Notes, or choose another material source.</small>}</label>}
      </>}
      {reading&&<div><p role="status">{progress||'Saving original file...'}</p><button type="button" className="ref-text-action" onClick={()=>controller.current?.abort()}>Cancel reading</button></div>}
      <label>Material title<input aria-label="Material title" required maxLength={200} value={form.title} disabled={reading} onChange={e=>setForm({...form,title:e.target.value})}/></label>
      <div className="study-setup-grid"><label>Subject<select aria-label="Material subject" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{[...new Set([...subjects,form.category])].map(name=><option key={name}>{name}</option>)}</select></label><label>Folder<select aria-label="Material folder" value={form.folderId} onChange={e=>setForm({...form,folderId:e.target.value})}><option value="">Unfiled</option>{folders.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
      <label>Tags<input aria-label="Material tags" value={form.tags} placeholder="e.g. memory, exam prep, theories" onChange={e=>setForm({...form,tags:e.target.value})}/><small>Separate tags with commas, up to 10.</small></label>
      <label>Review and edit study text<textarea aria-label="Material text" rows={9} maxLength={MAX_SOURCE_LENGTH} disabled={reading} value={form.text} onChange={e=>setForm({...form,text:e.target.value})}/></label><small>{form.text.length.toLocaleString()} / 25,000 characters. Saved text is reused without another OCR request.</small>
      {editId&&form.summary&&<label>Saved summary<textarea aria-label="Edit saved summary" rows={5} maxLength={MAX_SOURCE_LENGTH} value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})}/></label>}
      {error&&<p role="alert" className="ref-form-error">{error}</p>}<button className="ref-primary" disabled={reading||!form.title.trim()||(!form.text.trim()&&!incomingFile&&!items.find(item=>item.id===editId)?.fileId)||form.text.length>MAX_SOURCE_LENGTH}>Save material</button>
    </form></ViewportOverlay>}
    {modal==='folder'&&<ViewportOverlay onDismiss={dismiss}><form className="glass-modal ref-form-dialog" onSubmit={e=>{e.preventDefault();const name=folderName.trim();if(!name)return;if(folders.some(item=>item.id!==folderEdit&&item.name.toLowerCase()===name.toLowerCase())){setError('A folder with this name already exists.');return}if(commitFolders(folderEdit?folders.map(item=>item.id===folderEdit?{...item,name}:item):[...folders,{id:'folder-'+crypto.randomUUID(),name}]))setModal(null)}}><div className="ref-panel-title"><h2>{folderEdit?'Rename folder':'New library folder'}</h2><button type="button" aria-label="Close folder editor" onClick={dismiss}><X size={20}/></button></div><label>Folder name<input aria-label="Folder name" required maxLength={80} value={folderName} onChange={e=>setFolderName(e.target.value)}/></label>{error&&<p role="alert" className="ref-form-error">{error}</p>}<button className="ref-primary">Save folder</button></form></ViewportOverlay>}
    {modal==='delete'&&deletion&&<ViewportOverlay onDismiss={dismiss}><section className="glass-modal ref-form-dialog"><h2>Remove {deletion.kind==='folder'?'folder':'material'}?</h2><p>{deletion.kind==='folder'?'Materials will stay in your library as unfiled items.':'This removes the library text and any original file uploaded here. Documents referenced from the vault and saved notes stay in their original pages.'}</p>{error&&<p role="alert" className="ref-form-error">{error}</p>}<div className="study-actions"><button className="ref-secondary" onClick={dismiss}>Cancel</button><button className="ref-primary" onClick={()=>void remove()}>Remove {deletion.kind}</button></div></section></ViewportOverlay>}
    {generation&&<AIGenerator task={generation.task} saving={savingReviewer} initialText={generation.text} initialSourceName={generation.sourceName} category={generation.category} saveError={error} saveLabel={generation.task==='reviewer'?'Save reviewer':generation.task==='summary'?'Save summary to library':undefined} onClose={()=>{setGeneration(null);setError('')}} onSave={async(draft,settings)=>{
      if(generation.task==='reviewer') {
        setSavingReviewer(true);setError('');let stored=''
        try {
          const now=new Date().toISOString(),sourceIds=[...generation.ids],originals:LibraryMaterial[]=[]
          if(!sourceIds.length&&settings.sourceText.trim()) {
            const id='material-'+crypto.randomUUID()
            if(settings.sourceFile){stored='library-file-'+crypto.randomUUID();await storeDocumentFile(stored,settings.sourceFile)}
            originals.push({id,title:settings.sourceName||'Reviewer source',text:settings.sourceText,category:settings.category,folderId:null,tags:[],favorite:false,kind:stored?'upload':'text',sourceName:settings.sourceName,createdAt:now,updatedAt:now,fileId:stored||undefined,ownsFile:!!stored});sourceIds.push(id)
          }
          const item:LibraryMaterial={id:'reviewer-'+crypto.randomUUID(),title:draft.title,text:draft.summary+'\n\n'+draft.keyPoints.join('\n'),category:settings.category,folderId:null,tags:['Reviewer'],favorite:false,kind:'reviewer',sourceName:generation.sourceName||settings.sourceName,sourceIds,reviewer:draft,createdAt:now,updatedAt:now}
          if(!commit([item,...originals,...items])){if(stored)await deleteDocumentFile(stored);return}
          setSelected([]);setFolder('all');setView('all');setSearch('');setActiveId(item.id);setPreviewTab('source');setGeneration(null);setNotice('Reviewer saved in Library. Your source materials are kept separately.')
        }catch(error){if(stored)await deleteDocumentFile(stored).catch(()=>{});setError(error instanceof Error?error.message:'Reviewer could not be saved.')}finally{setSavingReviewer(false)}
        return
      }

      if(generation.task==='summary'){
        const summary=draft.summary+'\n\n'+draft.keyPoints.join('\n'),now=new Date().toISOString()
        if(summary.length>MAX_SOURCE_LENGTH){setError('This summary exceeds 25,000 characters. Generate a shorter draft before saving.');return}
        if(generation.ids.length===1){if(!commit(items.map(item=>item.id===generation.ids[0]?{...item,summary,updatedAt:now}:item)))return;setActiveId(generation.ids[0]);setPreviewTab('summary')}
        else {const item:LibraryMaterial={id:'material-'+crypto.randomUUID(),title:draft.title.trim()||'Study summary',text:summary,category:settings.category,folderId:null,tags:[],favorite:false,kind:'summary',sourceName:generation.sourceName,sourceIds:generation.ids,createdAt:now,updatedAt:now};if(!commit([item,...items]))return;setActiveId(item.id);setPreviewTab('source')}
        setSelected([]);setFolder('all');setView('all');setSearch('');setNotice('Summary saved. Your original materials are unchanged.')
      }else{const id=createDeck(draft.title,settings.category);draft.cards.forEach(card=>addCard(id,card.question,card.answer,settings.category));navigate('/flashcards',{state:{deckId:id}})}
      setGeneration(null);setError('')
    }}/>}
  </div>
}
