import { useEffect, useState } from 'react'
import { useAuthStore } from '../store'
import { exportWorkspace, loadCloudBackup, restoreCloudBackup, saveCloudBackup, type WorkspaceBackup } from '../utils/workspaceBackup'

export function WorkspaceBackupPanel() {
  const source=useAuthStore(state=>state.sessionSource)
  const [backup,setBackup]=useState<WorkspaceBackup|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState(''),[confirm,setConfirm]=useState(false)
  useEffect(()=>{let active=true;if(source==='supabase')loadCloudBackup().then(value=>{if(active)setBackup(value)}).catch(error=>{if(active)setError(error.message)});return()=>{active=false}},[source])
  const run=async(action:'save'|'restore')=>{
    setBusy(true);setError('');setMessage('Connecting to your private backup…')
    try {
      if(action==='save'){setBackup(await saveCloudBackup(setMessage));setMessage('Your workspace records and original files are backed up.')}
      else if(backup){await restoreCloudBackup(backup,setMessage);window.location.reload()}
    } catch(error){setError(error&&typeof error==='object'&&'message'in error&&typeof error.message==='string'?error.message:'Your backup could not be completed.');setMessage('')}
    finally{setBusy(false);setConfirm(false)}
  }
  return <section className="ref-panel workspace-backup"><h2>Your data & backup</h2><p>Keep your study workspace private. Save a cloud snapshot to open the same materials on another device. Changes stay in this browser until you back up again.</p>
    <dl><dt>Saved content</dt><dd>Notes, handwriting, chats, quizzes, results, decks, calendar, research, settings, and library materials.</dd><dt>Original files</dt><dd>Included in cloud backup; JSON export contains records only.</dd><dt>Cloud backup</dt><dd>{backup?new Date(backup.createdAt).toLocaleString():'No backup found for this account.'}</dd></dl>
    <div className="study-actions"><button className="ref-secondary" onClick={exportWorkspace}>Export records (JSON)</button><button className="ref-primary" disabled={busy||source!=='supabase'} onClick={()=>void run('save')}>{busy?'Working…':'Back up to cloud'}</button><button className="ref-secondary" disabled={busy||!backup} onClick={()=>setConfirm(true)}>Restore cloud backup</button></div>
    {source!=='supabase'&&<p>Cloud backup requires your signed-in Supabase account. Development workspaces can export their records.</p>}
    {confirm&&<div className="ref-inline-notice"><p>Restore the backup from {backup&&new Date(backup.createdAt).toLocaleString()}? This replaces this browser’s workspace records. A local recovery copy is kept before replacement.</p><div className="study-actions"><button className="ref-secondary" onClick={()=>setConfirm(false)}>Keep current workspace</button><button className="ref-primary" onClick={()=>void run('restore')}>Confirm restore</button></div></div>}
    {message&&<p role="status">{message}</p>}{error&&<p role="alert" className="ref-form-error">{error}</p>}
  </section>
}
