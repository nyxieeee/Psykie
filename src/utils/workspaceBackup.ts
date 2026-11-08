import { requireSupabase } from './supabase'
import { getActiveAccount, workspaceEntries, workspaceStorage } from './workspaceStorage'
import { getDocumentFile, storeDocumentFile } from './documentFiles'

type FileEntry={id:string;path:string;name:string;type:string;size:number}
export type WorkspaceBackup={version:1;account:string;createdAt:string;entries:Record<string,string>;files:FileEntry[]}
const bucket='workspace-backups'
function account() { const id=getActiveAccount();if(!id || id.startsWith('dev-'))throw new Error('Sign in with your Supabase account to use cloud backup.');return id }
function assertAccount(id:string) {if(id!==getActiveAccount())throw new Error('The signed-in account changed. Please try again.')}
export function exportWorkspace() {
  const blob=new Blob([JSON.stringify({version:1,account:getActiveAccount(),createdAt:new Date().toISOString(),entries:workspaceEntries()},null,2)],{type:'application/json'})
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='psykie-workspace-'+new Date().toISOString().slice(0,10)+'.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
}
export async function loadCloudBackup():Promise<WorkspaceBackup|null> {
  const id=account(), {data,error}=await requireSupabase().from('workspace_backups').select('snapshot').eq('user_id',id).maybeSingle()
  assertAccount(id);if(error)throw error
  if(!data)return null
  const backup=data.snapshot as WorkspaceBackup
  if(backup.version!==1||backup.account!==id||!backup.entries||!Array.isArray(backup.files))throw new Error('This backup format could not be read.')
  return backup
}
export async function saveCloudBackup(onProgress:(message:string)=>void):Promise<WorkspaceBackup> {
  const id=account(),client=requireSupabase(),previous=await loadCloudBackup(),entries=workspaceEntries(),fileIds=new Set<string>()
  for(const [key,value] of Object.entries(entries)) {
    if(key==='psykie-library-materials') {for(const item of JSON.parse(value))if(typeof item.fileId==='string')fileIds.add(item.fileId)}
    if(key.startsWith('psykie_vault_files_')) {for(const item of JSON.parse(value))if(typeof item.id==='string')fileIds.add(item.id)}
  }
  const backup:WorkspaceBackup={version:1,account:id,createdAt:new Date().toISOString(),entries,files:[]}
  const generation=crypto.randomUUID(),uploaded:string[]=[]
  try {
    for(const fileId of fileIds) {
      assertAccount(id);onProgress(`Backing up file ${backup.files.length+1} of ${fileIds.size}…`)
      const file=await getDocumentFile(fileId)
      if(!file)throw new Error('An original uploaded file is missing from this browser. Restore it or remove its document entry before backing up.')
      const path=`${id}/${generation}/${encodeURIComponent(fileId)}`
      const {error}=await client.storage.from(bucket).upload(path,file,{contentType:file.type||'application/octet-stream',upsert:false})
      if(error)throw error
      uploaded.push(path);backup.files.push({id:fileId,path,name:file.name,type:file.type,size:file.size})
    }
    assertAccount(id);onProgress('Saving workspace records…')
    const {error}=await client.from('workspace_backups').upsert({user_id:id,snapshot:backup,updated_at:backup.createdAt},{onConflict:'user_id'})
    if(error)throw error
  } catch(error) {if(uploaded.length)await client.storage.from(bucket).remove(uploaded);throw error}
  // Only remove the previous generation after the new snapshot is durable.
  if(previous?.files.length)await client.storage.from(bucket).remove(previous.files.map(file=>file.path))
  return backup
}
export async function restoreCloudBackup(backup:WorkspaceBackup,onProgress:(message:string)=>void) {
  const id=account();if(backup.account!==id)throw new Error('This backup belongs to a different account.')
  const downloaded:{id:string;file:File}[]=[]
  for(const entry of backup.files) {
    assertAccount(id);if(!entry.path.startsWith(id+'/'))throw new Error('Invalid backup file path.')
    onProgress(`Restoring file ${downloaded.length+1} of ${backup.files.length}…`)
    const {data,error}=await requireSupabase().storage.from(bucket).download(entry.path)
    if(error||!data)throw error||new Error('A backup file could not be downloaded.')
    downloaded.push({id:entry.id,file:new File([data],entry.name,{type:entry.type})})
  }
  assertAccount(id)
  // Preserve a recovery snapshot before replacing any records.
  const before=workspaceEntries()
  const recoveryKey=`psykie-recovery:${id}:${Date.now()}`
  localStorage.setItem(recoveryKey,JSON.stringify(before))
  try {
    for(const item of downloaded)await storeDocumentFile(item.id,item.file)
    assertAccount(id)
    for(const key of Object.keys(before))if(!(key in backup.entries))workspaceStorage.removeItem(key)
    for(const [key,value] of Object.entries(backup.entries)) {if(typeof value!=='string')throw new Error('Invalid workspace record.');workspaceStorage.setItem(key,value)}
  } catch(error) {
    for(const key of Object.keys(workspaceEntries()))if(!(key in before))workspaceStorage.removeItem(key)
    for(const [key,value]of Object.entries(before))workspaceStorage.setItem(key,value)
    throw error
  }
}
