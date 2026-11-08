import type { StudyCard, ActivityItem } from '../store/useStudyStore'
import { readWorkspaceList, workspaceStorage } from './workspaceStorage'

export type WorkspaceNotice={id:string;title:string;description:string;path:string}
export function buildNotifications(cards:StudyCard[],activities:ActivityItem[],now=new Date()):WorkspaceNotice[] {
  let preferences:{reminders?:boolean;weekly?:boolean}={}
  try{preferences=JSON.parse(workspaceStorage.getItem('psykie-preferences')||'{}')}catch{/* defaults */}
  const notices:WorkspaceNotice[]=[]
  if(preferences.reminders){
    const day=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
    const due=cards.filter(card=>card.dueDate<=day)
    if(due.length)notices.push({id:'due-'+day,title:`${due.length} flashcards due`,description:'A short review can help you keep these concepts fresh.',path:'/flashcards'})
    const events=readWorkspaceList<{id:string;title:string;date:string;time:string}>('psykie-events').filter(event=>event.date===day)
    for(const event of events)notices.push({id:'event-'+event.id+'-'+day,title:event.title,description:`Today · ${event.time}`,path:'/calendar'})
  }
  if(preferences.weekly){
    const recent=activities.filter(item=>new Date(item.timestamp).getTime()>=now.getTime()-7*86400000)
    const start=new Date(now);start.setDate(start.getDate()-((start.getDay()+6)%7))
    notices.push({id:'week-'+start.toISOString().slice(0,10),title:'Your last 7 days',description:`${recent.length} activities in your recent history. ${recent.filter(item=>item.category==='quiz').length} quiz activities and ${recent.filter(item=>item.category==='cards').length} flashcard activities.`,path:'/dashboard'})
  }
  return notices
}
export async function requestBrowserNotifications() {
  if(!('Notification'in window))throw new Error('Browser notifications are not supported here. In-app reminders still work.')
  const permission=await Notification.requestPermission()
  if(permission!=='granted')throw new Error('Browser permission was not granted. In-app reminders still work.')
  workspaceStorage.setItem('psykie-browser-notifications','true')
}
export function deliverBrowserNotifications(notices:WorkspaceNotice[]) {
  if(!('Notification'in window)||Notification.permission!=='granted'||workspaceStorage.getItem('psykie-browser-notifications')!=='true')return
  let seen:string[]=[];try{seen=JSON.parse(workspaceStorage.getItem('psykie-notifications-delivered')||'[]')}catch{/* empty */}
  for(const notice of notices){if(seen.includes(notice.id))continue;try{new Notification(notice.title,{body:notice.description,tag:notice.id,icon:'/mindy-mascot.png'});seen.push(notice.id)}catch{/* in-app remains */}}
  workspaceStorage.setItem('psykie-notifications-delivered',JSON.stringify(seen.slice(-100)))
}
