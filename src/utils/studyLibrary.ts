import type { AIDraft } from './ai'
import { readWorkspaceList, workspaceStorage } from './workspaceStorage'

export type LibraryMaterial = {
  id: string; title: string; text: string; category: string; folderId: string | null
  tags: string[]; favorite: boolean; kind: 'upload' | 'text' | 'note' | 'document' | 'summary' | 'reviewer'
  sourceName: string; createdAt: string; updatedAt: string; summary?: string
  reviewer?:AIDraft;
  fileId?: string; ownsFile?: boolean; sourceIds?: string[]
}
export type LibraryFolder = {id: string; name: string}
export const LIBRARY_KEY = 'psykie-library-materials'
export const LIBRARY_FOLDERS_KEY = 'psykie-library-folders'
export const readLibrary = () => readWorkspaceList<LibraryMaterial>(LIBRARY_KEY)
export const saveLibrary = (items: LibraryMaterial[]) => workspaceStorage.setItem(LIBRARY_KEY, JSON.stringify(items))
export function librarySource(items: LibraryMaterial[]): string {
  if (!items.length) throw new Error('Choose a study material first.')
  if(items.some(item=>!item.text.trim()))throw new Error('One of these files has no study text yet. Open Edit material and add readable text before generating practice.')
  const text = items.map(item => `Source: ${item.title}\n${item.text}`).join('\n\n---\n\n')
  if (text.length > 25000) throw new Error('Selected materials exceed 25,000 characters. Choose fewer materials or edit them into shorter excerpts.')
  return text
}
export function saveDocumentToLibrary(file: {id: string; name: string}, text: string): LibraryMaterial {
  const items = readLibrary(), existing = items.find(item => item.fileId === file.id)
  if (existing) return existing
  const now = new Date().toISOString()
  const item: LibraryMaterial = {id:'material-'+crypto.randomUUID(),title:file.name.replace(/\.[^.]+$/, '') || file.name || 'Imported material',text,category:'General Psychology',folderId:null,tags:[],favorite:false,kind:'document',sourceName:file.name,fileId:file.id,ownsFile:false,createdAt:now,updatedAt:now}
  saveLibrary([item,...items])
  return item
}
