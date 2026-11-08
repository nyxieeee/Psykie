import { useEffect, useState } from 'react'
import { useStudyStore } from '../store'
import { buildNotifications, deliverBrowserNotifications } from '../utils/notifications'

export function useWorkspaceNotices() {
  const cards=useStudyStore(state=>state.cards),activities=useStudyStore(state=>state.activities)
  const [revision,setRevision]=useState(0)
  useEffect(()=>{
    const update=()=>setRevision(value=>value+1)
    const change=(event:Event)=>{if(['psykie-preferences','psykie-events'].includes((event as CustomEvent).detail?.key))update()}
    window.addEventListener('psykie-workspace-change',change);window.addEventListener('focus',update)
    const timer=setInterval(update,60000)
    return()=>{clearInterval(timer);window.removeEventListener('psykie-workspace-change',change);window.removeEventListener('focus',update)}
  },[])
  const notices=buildNotifications(cards,activities)
  useEffect(()=>{deliverBrowserNotifications(buildNotifications(cards,activities))},[cards,activities,revision])
  return notices
}
