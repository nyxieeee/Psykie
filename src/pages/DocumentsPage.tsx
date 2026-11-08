import { StudyFilePicker } from '../components/StudyFilePicker'
import { readLibrary, saveDocumentToLibrary } from '../utils/studyLibrary'
import { AIGenerator } from '../components/AIGenerator'
import { AITask, extractImageText } from '../utils/ai'
import { readStudyUpload } from '../utils/studyUpload'
import { useNavigate } from 'react-router-dom'
import { workspaceStorage } from '../utils/workspaceStorage'
import { deleteDocumentFile, getDocumentFile, storeDocumentFile } from '../utils/documentFiles'
import {
  Check,
  DownloadSimple as Download,
  File,
  FileDoc as FileSpreadsheet,
  FileText,
  Folder,
  FolderPlus,
  Image as ImageIcon,
  Presentation,
  Star,
  X
} from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ReferenceEmpty, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useStudyStore, useUser } from '../store'

interface DocumentFile {
  id: string
  name: string
  folderId: string | null
  type: 'pdf' | 'docx' | 'image' | 'presentation' | 'sheet' | 'other'
  size: string
  sizeBytes: number
  updatedAt: string
  isFavorite: boolean
  tags: string[]
  hasFile?: boolean
  downloadUrl?: string
}

interface DocumentFolder {
  id: string
  name: string
  color: string
  createdAt: string
}

export function DocumentsPage() {
  const user = useUser()
  const navigate = useNavigate()
  const { addNote, createDeck, addCard } = useStudyStore()
  const [studyTask, setStudyTask] = useState<AITask | null>(null), [studyText, setStudyText] = useState(''), [studyName, setStudyName] = useState('')
  const [studyReading, setStudyReading] = useState(false), [studyError, setStudyError] = useState('')
  const [studyProgress, setStudyProgress] = useState('')
  const studyController = useRef<AbortController | null>(null)
  useEffect(() => () => studyController.current?.abort(), [])
  const role = user?.role || 'student'
  const isProfessional = role === 'professional'
  const isAdmin = role === 'admin'

  const [folders, setFolders] = useState<DocumentFolder[]>([])
  const [files, setFiles] = useState<DocumentFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  // Modals
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [previewFile, setPreviewFile] = useState<DocumentFile | null>(null)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('#FF6EB4')

  // Upload Form State
  const [uploadFileName, setUploadFileName] = useState('')
  const [uploadBlob, setUploadBlob] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [activeFileUrl, setActiveFileUrl] = useState('')
  const [uploadFileType, setUploadFileType] = useState<DocumentFile['type']>('pdf')
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string | null>(null)

  const folderColorOptions = [
    '#FF6EB4', // Pink
    '#E91E8C', // Magenta
    '#9C27B0', // Purple
    '#3F51B5', // Indigo
    '#00BCD4', // Cyan
    '#4CAF50', // Emerald
    '#FF9800', // Amber
  ]

  // Storage Keys per Role to guarantee zero cross-role data leaks
  const FOLDERS_KEY = `psykie_vault_folders_${role}`
  const FILES_KEY = `psykie_vault_files_${role}`

  // Load isolated role data
  useEffect(() => {
    setIsLoading(true)
    setSelectedFolderId(null)
    setPreviewFile(null)

    {
      // Load Folders
      const storedFolders = workspaceStorage.getItem(FOLDERS_KEY)
      let initialFolders: DocumentFolder[] = []
      if (storedFolders) {
        try { initialFolders = JSON.parse(storedFolders) } catch (err) { void err }
      }

      // Load Files
      const storedFiles = workspaceStorage.getItem(FILES_KEY)
      let initialFiles: DocumentFile[] = []
      if (storedFiles) {
        try { initialFiles = JSON.parse(storedFiles) } catch (err) { void err }
      }

      setFolders(initialFolders)
      setFiles(initialFiles)
      setIsLoading(false)
    }
  }, [role, FOLDERS_KEY, FILES_KEY, isAdmin, isProfessional])

  // Helper to persist changes strictly to current role's storage key
  const saveFolders = (newFolders: DocumentFolder[]) => {
    setFolders(newFolders)
    workspaceStorage.setItem(FOLDERS_KEY, JSON.stringify(newFolders))
  }

  const saveFiles = (newFiles: DocumentFile[]) => {
    setFiles(newFiles)
    workspaceStorage.setItem(FILES_KEY, JSON.stringify(newFiles))
  }

  // Filtered files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFolder = selectedFolderId === null ? true : file.folderId === selectedFolderId
    const matchesType = filterType === 'all' || file.type === filterType
    return matchesSearch && matchesFolder && matchesType
  })

  // Folder helper
  const selectedFolder = folders.find(f => f.id === selectedFolderId)

  // Handlers
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return
    const folder: DocumentFolder = {
      id: `f-${crypto.randomUUID()}`,
      name: newFolderName.trim(),
      color: newFolderColor,
      createdAt: 'Just now',
    }
    saveFolders([...folders, folder])
    setNewFolderName('')
    setShowCreateFolderModal(false)
  }

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName.trim() || !uploadBlob) { setUploadError('Choose a file to upload.'); return }
    const id = 'doc-' + Date.now()
    if (uploadBlob) { try { await storeDocumentFile(id, uploadBlob) } catch { setUploadError('The file could not be saved in this browser. Try a smaller file.'); return } }
    const file: DocumentFile = {
      id,
      name: uploadFileName.trim(),
      folderId: uploadTargetFolder || selectedFolderId,
      type: uploadFileType,
      size: uploadBlob ? (uploadBlob.size / 1024).toFixed(1) + ' KB' : '0 KB',
      sizeBytes: uploadBlob?.size || 0,
      hasFile: !!uploadBlob,
      updatedAt: 'Just now',
      isFavorite: false,
      tags: [isProfessional ? 'Clinical' : isAdmin ? 'Admin' : 'Uploaded'],
    }
    saveFiles([file, ...files])
    setUploadFileName('')
    setUploadBlob(null)
    setUploadError('')
    setSelectedFileId(file.id)
    setShowUploadModal(false)
  }

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const updated = files.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)
    saveFiles(updated)
  }

  const handleDeleteFile = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try { await deleteDocumentFile(id) } catch { setUploadError('The file could not be deleted. Try again.'); setShowUploadModal(true); return }
    const updated = files.filter(f => f.id !== id)
    saveFiles(updated)
    if (previewFile?.id === id) setPreviewFile(null)
  }

  // File type icon renderer
  const renderFileTypeIcon = (type: DocumentFile['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText size={18} className="workspace-page page-documents text-pink-600" />
      case 'docx':
        return <File size={18} className="text-blue-600" />
      case 'image':
        return <ImageIcon size={18} className="text-emerald-600" />
      case 'presentation':
        return <Presentation size={18} className="text-amber-600" />
      case 'sheet':
        return <FileSpreadsheet size={18} className="text-teal-600" />
      default:
        return <File size={18} className="text-slate-600" />
    }
  }

  // Calculate total storage
  const totalSizeBytes = files.reduce((acc, f) => acc + f.sizeBytes, 0)
  const totalSizeMB = (totalSizeBytes / 1000000).toFixed(1)


  const [fileView, setFileView] = useState('all')
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [previewTab, setPreviewTab] = useState('preview')
  const activeFile = files.find(file => file.id === selectedFileId) || filteredFiles[0]
  const studyDocument = async (task: AITask | 'library') => {
    if (!activeFile || studyReading) return
    if (task === 'library') { const cached=readLibrary().find(item=>item.fileId===activeFile.id); if(cached){navigate('/library',{state:{materialId:cached.id}});return} }
    setStudyReading(true); setStudyError(''); studyController.current = new AbortController()
    try {
      const file = await getDocumentFile(activeFile.id)
      if (!file) throw new Error('This file is unavailable in this browser. Upload it again to study it.')
      const text = await readStudyUpload(file, {ocr:extractImageText, signal:studyController.current.signal, onProgress:setStudyProgress})
      if (task === 'library') { const item=saveDocumentToLibrary(activeFile,text);navigate('/library',{state:{materialId:item.id}}) }
      else if (task === 'quiz') navigate('/quizzes', {state:{studyText:text,sourceName:activeFile.name}})
      else { setStudyText(text); setStudyName(activeFile.name); setStudyTask(task) }
    } catch(error) { if (!studyController.current.signal.aborted) setStudyError(error instanceof Error ? error.message : 'Could not read this document.') }
    finally { setStudyReading(false); setStudyProgress('') }
  }
  const visibleFiles = filteredFiles.filter(file => fileView !== 'saved' || file.isFavorite)
  useEffect(() => {
    let disposed = false
    let url = ''
    setActiveFileUrl('')
    if (activeFile?.hasFile) getDocumentFile(activeFile.id).then(file => { if (file && !disposed) { url = URL.createObjectURL(file); setActiveFileUrl(url) } }).catch(() => setActiveFileUrl(''))
    return () => { disposed = true; if (url) URL.revokeObjectURL(url) }
  }, [activeFile?.id, activeFile?.hasFile])
  const downloadFile = async (file: DocumentFile) => {
    if (file.hasFile) { const data = await getDocumentFile(file.id); if (!data) return; const url = URL.createObjectURL(data); const link = document.createElement('a'); link.href = url; link.download = file.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) }
    else if (file.downloadUrl) { const link = document.createElement('a'); link.href = file.downloadUrl; link.download = file.name; link.click() }
    else { setUploadError('This file is unavailable. Upload it again.'); setShowUploadModal(true) }
  }

  return (
    <div className="reference-page ref-documents-page">
      <ReferenceHeader title="Documents" subtitle="Store, organize, and access your forms, assessments, and resources." action="Upload document" onAction={() => { setUploadTargetFolder(selectedFolderId); setShowUploadModal(true) }} />
      <div className="ref-documents-layout"><section className="ref-document-library"><div className="ref-document-toolbar"><ReferenceTabs items={[{ id: 'all', label: 'All files', count: files.length }, { id: 'saved', label: 'Saved', count: files.filter(file => file.isFavorite).length }]} value={fileView} onChange={setFileView} /><button className="ref-secondary" onClick={() => setShowCreateFolderModal(true)}><FolderPlus size={16} />New folder</button></div><ReferenceSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search documents by name or keyword…" /><div className="ref-folder-grid">{folders.map((folder, index) => <button className={selectedFolderId === folder.id ? 'ref-folder-card selected' : 'ref-folder-card'} key={folder.id} onClick={() => setSelectedFolderId(selectedFolderId === folder.id ? null : folder.id)}><Folder size={30} weight="duotone" className={'tint-icon-' + index % 4} /><strong>{folder.name}</strong><small>{files.filter(file => file.folderId === folder.id).length} files</small></button>)}</div><div className="ref-document-filter"><button className="ref-text-action" onClick={() => setSelectedFolderId(null)}>{selectedFolder ? 'All files / ' + selectedFolder.name : 'All files'}</button><select aria-label="File type" value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All types</option><option value="pdf">PDF</option><option value="docx">Documents</option><option value="image">Images</option><option value="presentation">Presentations</option></select></div><div className="ref-panel ref-file-table"><div className="ref-file-heading"><span>Name ↕</span><span>Type ↕</span><span>Updated ↕</span><span>Size ↕</span><span /></div>{visibleFiles.map(file => <div key={file.id} className={activeFile?.id === file.id ? 'ref-file-row selected' : 'ref-file-row'}><button className="ref-file-name" onClick={() => setSelectedFileId(file.id)}>{renderFileTypeIcon(file.type)}<span>{file.name.replace(/_/g, ' ')}</span></button><span>{file.type.toUpperCase()}</span><span>{file.updatedAt}</span><span>{file.size}</span><details className="ref-item-menu"><summary aria-label={'Options for ' + file.name}>···</summary><button onClick={() => setPreviewFile(file)}>Details</button><button onClick={() => toggleFavorite(file.id)}>{file.isFavorite ? 'Unsave' : 'Save'}</button><button onClick={() => handleDeleteFile(file.id)}>Delete</button></details></div>)}{!visibleFiles.length && <ReferenceEmpty>{isLoading ? 'Opening your document library…' : 'No documents in this folder.'}</ReferenceEmpty>}</div><p className="ref-demo-caption">{totalSizeMB} MB used · {files.length} files</p></section>
        <aside className="ref-panel ref-document-preview">{activeFile ? <><div className="ref-panel-title">{renderFileTypeIcon(activeFile.type)}<div><h2>{activeFile.name.replace(/_/g, ' ')}</h2><small>{activeFile.type.toUpperCase()} document</small></div><button aria-label="Save document" onClick={() => toggleFavorite(activeFile.id)}><Star size={18} weight={activeFile.isFavorite ? 'fill' : 'regular'} /></button></div><ReferenceTabs items={[{ id: 'preview', label: 'Preview' }, { id: 'details', label: 'Details' }]} value={previewTab} onChange={setPreviewTab} />{previewTab === 'preview' && activeFileUrl ? <div className="ref-uploaded-preview">{activeFile.type === 'image' ? <img src={activeFileUrl} alt={activeFile.name} /> : activeFile.type === 'pdf' ? <iframe title={'Preview ' + activeFile.name} src={activeFileUrl} /> : <p>Your file is saved. Download it to open it in its original application.</p>}</div> : previewTab === 'preview' ? <ReferenceEmpty>Loading your file preview. If it is unavailable, try downloading the file.</ReferenceEmpty> : <div className="ref-detail-section"><h3>File details</h3><dl><dt>File name</dt><dd>{activeFile.name}</dd><dt>Size</dt><dd>{activeFile.size}</dd><dt>Updated</dt><dd>{activeFile.updatedAt}</dd><dt>Folder</dt><dd>{folders.find(folder => folder.id === activeFile.folderId)?.name || 'All documents'}</dd></dl><div className="ref-chip-group">{activeFile.tags.map(tag => <span className="ref-tag tint-2" key={tag}>{tag}</span>)}</div><button className="ref-text-action" onClick={() => setPreviewFile(activeFile)}>More details</button></div>}<div className="study-document-actions"><strong>Study this document</strong><p>Text is read automatically. Photos and scanned pages use AI OCR and your AI allowance (up to 50 scanned pages per PDF).</p><p>Create practice material from the readable text in this file.</p><div className="study-actions"><button className="ref-secondary" disabled={studyReading} onClick={() => void studyDocument('library')}>Save to Library</button><button className="ref-primary" disabled={studyReading} onClick={() => void studyDocument('quiz')}>Quiz me on this</button><button className="ref-secondary" disabled={studyReading} onClick={() => void studyDocument('flashcards')}>Make flashcards</button><button className="ref-secondary" disabled={studyReading} onClick={() => void studyDocument('summary')}>Summarize</button></div>{studyReading && <div><p role="status">{studyProgress || 'Reading study material...'}</p><button className="ref-text-action" onClick={() => studyController.current?.abort()}>Cancel reading</button></div>}{studyError && <p role="alert" className="ref-form-error">{studyError}</p>}</div><button className="ref-download" onClick={() => downloadFile(activeFile)}><Download size={19} />Download</button></> : <ReferenceEmpty>Select a document to preview it.</ReferenceEmpty>}</aside></div>
      <AnimatePresence>
        {showCreateFolderModal && (
          <ViewportOverlay onDismiss={() => setShowCreateFolderModal(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-[99999] p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-modal w-full max-w-md p-5 space-y-3 my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gradient" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Create New Folder
                </h3>
                <button onClick={() => setShowCreateFolderModal(false)} className="p-1 hover:text-red-500">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#8B1A4A' }}>
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    placeholder={isProfessional ? 'e.g. Client Intake Forms, Treatment Plans...' : 'e.g. Cognitive Psych Lectures, DSM-5 Notes...'}
                    className="input-solid text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8B1A4A' }}>
                    Folder Accent Color
                  </label>
                  <div className="flex items-center gap-2">
                    {folderColorOptions.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewFolderColor(color)}
                        className="w-7 h-7 rounded-full transition-transform flex items-center justify-center cursor-pointer"
                        style={{ background: color, transform: newFolderColor === color ? 'scale(1.2)' : 'scale(1)' }}
                      >
                        {newFolderColor === color && <Check size={14} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateFolderModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-5 py-2 text-xs font-black">
                    Create Folder
                  </button>
                </div>
              </form>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>

      {/* ── UPLOAD FILE MODAL ── */}
      <AnimatePresence>
        {showUploadModal && (
          <ViewportOverlay onDismiss={() => setShowUploadModal(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-[99999] p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-modal w-full max-w-md p-5 space-y-3 my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gradient" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Upload Document to Vault
                </h3>
                <button onClick={() => setShowUploadModal(false)} className="p-1 hover:text-red-500">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUploadFile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#8B1A4A' }}>
                    Document Title / File Name
                  </label>
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={e => setUploadFileName(e.target.value)}
                    placeholder={isProfessional ? 'e.g. Client_Intake_Consent_Template.pdf' : 'e.g. Neuroscience_Chapter3_Notes.pdf'}
                    className="input-solid text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#8B1A4A' }}>
                      File Type
                    </label>
                    <select
                      value={uploadFileType}
                      onChange={e => setUploadFileType(e.target.value as any)}
                      className="input-solid text-xs font-bold"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="docx">Word Document (.docx)</option>
                      <option value="presentation">PowerPoint Slides (.pptx)</option>
                      <option value="image">Image / Scan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#8B1A4A' }}>
                      Destination Folder
                    </label>
                    <select
                      value={uploadTargetFolder || ''}
                      onChange={e => setUploadTargetFolder(e.target.value || null)}
                      className="input-solid text-xs font-bold"
                    >
                      <option value="">(Root Directory)</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <StudyFilePicker label="Document file" hint="Any file up to 10 MB. Originals are saved in this browser." onSelect={file=>{setUploadBlob(file);setUploadFileName(file.name);const extension=file.name.split('.').pop()?.toLowerCase();setUploadFileType(file.type.startsWith('image/')?'image':extension==='pdf'?'pdf':extension==='docx'?'docx':extension==='pptx'?'presentation':'other');setUploadError('')}}/>{uploadError && <p role="alert" className="ref-form-error">{uploadError}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-5 py-2 text-xs font-black">
                    Upload to Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>

      {/* ── FILE PREVIEW MODAL ── */}
      <AnimatePresence>
        {previewFile && (
          <ViewportOverlay onDismiss={() => setPreviewFile(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-[99999] p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="glass-modal w-full max-w-md p-5 space-y-3 my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderFileTypeIcon(previewFile.type)}
                  <h3 className="text-sm font-black text-slate-800 truncate max-w-xs">
                    {previewFile.name}
                  </h3>
                </div>
                <button onClick={() => setPreviewFile(null)} className="p-1 hover:text-red-500">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-pink-50/50 p-4 rounded-2xl space-y-2 text-xs font-semibold text-slate-700 border border-pink-100">
                <p><span className="font-bold text-pink-800">Domain Role:</span> <span className="uppercase font-black text-pink-900">{role}</span></p>
                <p><span className="font-bold text-pink-800">Size:</span> {previewFile.size}</p>
                <p><span className="font-bold text-pink-800">Last Modified:</span> {previewFile.updatedAt}</p>
                <p><span className="font-bold text-pink-800">Folder:</span> {folders.find(f => f.id === previewFile.folderId)?.name || 'Root'}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="font-bold text-pink-800">Tags:</span>
                  {previewFile.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-pink-700 border border-pink-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Close
                </button>
                <button
                  onClick={() => downloadFile(previewFile)}
                  className="btn-primary px-5 py-2 text-xs font-black flex items-center gap-1.5"
                >
                  <Download size={14} /> Download File
                </button>
              </div>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>
    {studyTask && <AIGenerator task={studyTask} initialText={studyText} initialSourceName={studyName} onClose={() => setStudyTask(null)} onSave={(draft,settings) => {
      if (studyTask === 'summary') { const id=addNote({title:draft.title,fileName:studyName,fileSize:'Text note',category:settings.category,summary:draft.summary+'\n\n'+draft.keyPoints.join('\n'),keyTopics:draft.keyPoints,keyConcepts:[],importantTerms:[]}); navigate('/notes',{state:{noteId:id}}) }
      else { const id=createDeck(draft.title,settings.category);draft.cards.forEach(card=>addCard(id,card.question,card.answer,settings.category));navigate('/flashcards',{state:{deckId:id}}) }
      setStudyTask(null)
    }}/>}
    </div>
  )
}
