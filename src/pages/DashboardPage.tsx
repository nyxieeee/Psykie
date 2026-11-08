import { ArrowRight, BookOpen, CalendarCheck, Cards, ChartBar, Folder, Lightbulb, NoteBlank } from '@phosphor-icons/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudyStore, useUser } from '../store'
import { readWorkspaceList } from '../utils/workspaceStorage'
import { readLibrary } from '../utils/studyLibrary'

export function DashboardPage() {
  const navigate = useNavigate(), user = useUser()
  const { cards, notes, activities } = useStudyStore()
  const [prompt, setPrompt] = useState('')
  const materials = readLibrary(), now = new Date()
  const localDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
  const deadlines = readWorkspaceList<{id:string; title:string; date:string; time:string}>('psykie-events').filter(event => event.date >= localDate).sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time))
  const due = cards.filter(card => card.status !== 'mastered').length
  const ask = (text:string) => navigate(`/mindy?q=${encodeURIComponent(text)}`)
  return <div className="reference-page overview-page">
    <header className="overview-heading"><div><span className="eyebrow">YOUR WORKSPACE</span><h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1><p>Your materials, practice, and plans. All in one place.</p></div><time dateTime={localDate}>{now.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}</time></header>
    <div className="overview-metrics">{[
      {label:'Study materials',value:materials.length,icon:Folder,path:'/library'},
      {label:'Notes in your workspace',value:notes.length,icon:NoteBlank,path:'/notes'},
      {label:'Cards to review',value:due,icon:Cards,path:'/flashcards'},
      {label:'Upcoming events',value:deadlines.length,icon:CalendarCheck,path:'/calendar'}
    ].map(item => <button className="overview-metric" key={item.path} onClick={() => navigate(item.path)}><item.icon size={25}/><span><strong>{item.value}</strong><small>{item.label}</small></span></button>)}</div>
    <div className="overview-workflow"><div>
      <section className="study-start"><div><h2>What are you learning today?</h2><p>Bring your readings and lecture notes into Study Box. Turn them into flashcards, quizzes, or a clearer set of notes.</p><button className="ref-primary" onClick={() => navigate('/library')}>Open Study Box <ArrowRight size={17}/></button></div><BookOpen size={76} weight="duotone"/></section>
      <div className="overview-tools">{[
        {title:'Review flashcards',sub:due ? `${due} cards ready to practice` : 'Build recall, one concept at a time',icon:Cards,path:'/flashcards'},
        {title:'Take a practice quiz',sub:'Find out what needs another look',icon:ChartBar,path:'/quizzes'},
        {title:'Explore research',sub:'Find sources for your next question',icon:BookOpen,path:'/research'}
      ].map(item => <button key={item.path} className="overview-tool" onClick={() => navigate(item.path)}><item.icon size={22}/><strong>{item.title}</strong><small>{item.sub}</small></button>)}</div>
      <section className="dashboard-panel"><div className="overview-section-heading"><h2>Recent activity</h2><button onClick={() => navigate('/notes')}>Open notes <ArrowRight size={14}/></button></div>{activities.length ? activities.slice(0,4).map(activity => <button className="recent-row" key={activity.id} onClick={() => navigate(activity.category === 'cards' ? '/flashcards' : activity.category === 'quiz' ? '/quizzes' : activity.category === 'mindy' ? '/mindy' : '/notes')}><span className="pastel-icon"><NoteBlank size={22}/></span><span className="recent-copy"><strong>{activity.title}</strong><small>{activity.meta}</small></span><ArrowRight size={16}/></button>) : <p className="empty-copy">Your recent work will appear here. Add a reading to Study Box or write your first note to get started.</p>}</section>
    </div><aside>
      <section className="dashboard-panel"><div className="mindy-heading"><img src="/mindy-mascot.png" alt=""/><div><h2>A question on your mind?</h2><p>Work through it with Mindy.</p></div></div><form className="mindy-prompt" onSubmit={event => {event.preventDefault();if(prompt.trim()) ask(prompt.trim())}}><label className="sr-only" htmlFor="mindy-question">What would you like to understand?</label><textarea id="mindy-question" placeholder="Ask about a concept, theory, or reading…" value={prompt} onChange={event => setPrompt(event.target.value)}/><button aria-label="Ask Mindy" disabled={!prompt.trim()}><ArrowRight size={21}/></button></form><div className="mindy-suggestions"><button onClick={() => ask('Help me understand a psychology concept. Ask me which topic I am studying.')}><Lightbulb size={18}/>Explain a concept</button></div><div className="study-support"><p>Use AI explanations alongside your course readings and original sources.</p></div></section>
      <section className="dashboard-panel overview-agenda"><div className="overview-section-heading"><h2>On your calendar</h2><button onClick={() => navigate('/calendar')}>View all <ArrowRight size={14}/></button></div>{deadlines.slice(0,3).map(item => <button className="deadline-row" key={item.id} onClick={() => navigate('/calendar')}><span className="pastel-icon"><CalendarCheck size={22}/></span><span><strong>{item.title}</strong><small>{item.date} · {item.time}</small></span></button>)}{!deadlines.length && <><p className="empty-copy">No upcoming events. Make time for your next study session.</p><button className="ref-secondary ref-wide" onClick={() => navigate('/calendar')}>Plan your week <ArrowRight size={16}/></button></>}</section>
    </aside></div>
  </div>
}
