import { useUser } from '../store'
import { readWorkspaceList, workspaceStorage } from '../utils/workspaceStorage'
import {
  CaretLeft,
  CaretRight,
  Plus
} from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { ReferenceEmpty, ReferenceHeader, ReferenceTabs } from '../components/ReferenceUI'
import { TransitionsModal } from '../components/TransitionsModal'
import { TransitionsToast } from '../components/TransitionsToast'

interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time: string
  duration: string
  type: 'cbt_session' | 'consultation' | 'assessment' | 'supervision' | 'study' | 'personal'
  clientName: string
  clientId?: string
  location: string
  isTelehealth: boolean
  notes?: string
  status: 'confirmed' | 'upcoming' | 'completed'
}

export function CalendarPage() {
  const user = useUser()
  const clinical = user?.role === 'professional' || user?.role === 'admin'
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-CA')
  )
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastContent, setToastContent] = useState({ title: '', desc: '' })

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const [events, setEvents] = useState<CalendarEvent[]>(() => readWorkspaceList('psykie-events'))
  useEffect(() => { workspaceStorage.setItem('psykie-events', JSON.stringify(events)) }, [events])

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date().toLocaleDateString('en-CA'),
    time: '10:00',
    duration: '50 min',
    type: (clinical ? 'consultation' : 'study') as CalendarEvent['type'],
    clientName: '',
    location: '',
    isTelehealth: false,
    notes: ''
  })

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentMonth(now.getMonth())
    setCurrentYear(now.getFullYear())
    setSelectedDate(now.toLocaleDateString('en-CA'))
  }

  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr)

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title.trim()) return

    const start = new Date(newEvent.date + 'T' + newEvent.time)
    const end = new Date(start.getTime() + parseInt(newEvent.duration) * 60000)
    const timeLabel = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const created: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      time: `${timeLabel(start)} - ${timeLabel(end)}`,
      duration: newEvent.duration,
      type: newEvent.type,
      clientName: newEvent.clientName,
      location: newEvent.isTelehealth ? 'Telehealth Video Suite' : newEvent.location,
      isTelehealth: newEvent.isTelehealth,
      notes: newEvent.notes,
      status: 'confirmed'
    }

    setEvents(prev => [...prev, created])
    setShowCreateModal(false)
    setToastContent({
      title: 'Event saved',
      desc: `${created.title} on ${created.date}.`
    })
    setToastOpen(true)
    setNewEvent({
      title: '',
      date: new Date().toLocaleDateString('en-CA'),
      time: '10:00',
      duration: '50 min',
      type: clinical ? 'consultation' : 'study',
      clientName: '',
      location: '',
      isTelehealth: false,
      notes: ''
    })
  }

  const selectedDateEvents = events.filter(e => e.date === selectedDate)

  const typeConfig: Record<CalendarEvent['type'], { label: string; badgeClass: string; borderClass: string; dotColor: string }> = {
    study: { label: 'Study', badgeClass: '', borderClass: '', dotColor: '#9160ff' },
    personal: { label: 'Personal', badgeClass: '', borderClass: '', dotColor: '#49b59e' },
    cbt_session: {
      label: 'Therapy Session',
      badgeClass: 'bg-pink-100/80 text-pink-700 border-pink-200',
      borderClass: 'border-l-pink-500',
      dotColor: '#EC4899'
    },
    consultation: {
      label: 'Intake Consultation',
      badgeClass: 'bg-rose-100/80 text-rose-700 border-rose-200',
      borderClass: 'border-l-rose-500',
      dotColor: '#F43F5E'
    },
    assessment: {
      label: 'Psych Assessment',
      badgeClass: 'bg-amber-100/80 text-amber-800 border-amber-200',
      borderClass: 'border-l-amber-500',
      dotColor: '#F59E0B'
    },
    supervision: {
      label: 'Peer Supervision',
      badgeClass: 'bg-emerald-100/80 text-emerald-800 border-emerald-200',
      borderClass: 'border-l-emerald-500',
      dotColor: '#10B981'
    }
  }


  const dateKey = (date: Date) => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
  const offset = (firstDayOfMonth + 6) % 7
  const monthCells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, index) => new Date(currentYear, currentMonth, index - offset + 1))
  const activeCell = Math.max(0, monthCells.findIndex(date => dateKey(date) === selectedDate))
  const displayedCells = viewMode === 'week' ? monthCells.slice(Math.floor(activeCell / 7) * 7, Math.floor(activeCell / 7) * 7 + 7) : monthCells
  const schedule = () => { setNewEvent(previous => ({ ...previous, date: selectedDate })); setShowCreateModal(true) }
  return (
    <div className="reference-page ref-calendar-page">
      <ReferenceHeader title="Make room for progress." subtitle="Plan your study time, stay consistent, and look after your wellbeing." action="New event" onAction={schedule} />
      <div className="ref-calendar-layout"><section className="ref-panel ref-calendar-main"><div className="ref-calendar-toolbar"><div><button className="ref-square-button" aria-label="Previous month" onClick={goToPreviousMonth}><CaretLeft size={18} /></button><h2>{monthNames[currentMonth]} {currentYear}</h2><button className="ref-square-button" aria-label="Next month" onClick={goToNextMonth}><CaretRight size={18} /></button></div><div><button className="ref-secondary" onClick={goToToday}>Today</button><ReferenceTabs items={[{ id: 'month', label: 'Month' }, { id: 'week', label: 'Week' }, { id: 'agenda', label: 'Agenda' }]} value={viewMode} onChange={id => setViewMode(id as typeof viewMode)} /></div></div>{viewMode === 'agenda' ? <div className="ref-month-agenda">{events.filter(event => event.date.startsWith(currentYear + '-' + String(currentMonth + 1).padStart(2, '0'))).sort((a, b) => a.date.localeCompare(b.date)).map(event => <button key={event.id} onClick={() => setSelectedDate(event.date)}><span className="ref-date-tile">{event.date.slice(-2)}</span><span><strong>{event.title}</strong><small>{event.time}</small></span><span className="ref-tag tint-2">{typeConfig[event.type].label}</span></button>)}</div> : <><div className="ref-calendar-weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <span key={day}>{day}</span>)}</div><div className={'ref-month-grid ' + (viewMode === 'week' ? 'week' : '')}>{displayedCells.map(date => { const key = dateKey(date), dayEvents = getEventsForDate(key); return <button key={key} className={'ref-calendar-day ' + (key === selectedDate ? 'selected ' : '') + (date.getMonth() !== currentMonth ? 'outside' : '')} aria-label={date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ', ' + dayEvents.length + ' events'} aria-pressed={key === selectedDate} onClick={() => setSelectedDate(key)}><span className={key === dateKey(new Date()) ? 'today' : ''}>{date.getDate()}</span><div>{dayEvents.slice(0, 2).map(event => <span key={event.id} className={'ref-calendar-event tint-' + (['cbt_session', 'consultation', 'assessment', 'supervision', 'study', 'personal'].indexOf(event.type) % 4)}>{event.title}</span>)}{dayEvents.length > 2 && <small>+{dayEvents.length - 2} more</small>}</div>{dayEvents.length > 0 && <i className="ref-event-dot" />}</button> })}</div></>}</section>
        <aside className="ref-calendar-sidebar"><section className="ref-panel ref-day-agenda"><h2>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>{selectedDateEvents.map(event => <article className="ref-agenda-event" key={event.id}><time>{event.time.split(' - ')[0]}<small>{event.duration}</small></time><div><h3>{event.title}</h3><p>{event.location}</p><span className="ref-tag tint-0">{typeConfig[event.type].label}</span><details><summary>Session details</summary><p>{event.notes || 'No additional notes.'}</p><button className="ref-text-action" onClick={() => setEvents(previous => previous.filter(item => item.id !== event.id))}>Remove event</button></details></div></article>)}{!selectedDateEvents.length && <ReferenceEmpty>A little breathing room. Add an event when you are ready.</ReferenceEmpty>}<button className="ref-text-action" onClick={schedule}><Plus size={15} />Add an event</button></section><section className="ref-panel ref-event-categories"><h2>Event categories</h2><div><span><i className="tint-2" />Study</span><span><i className="tint-0" />Clinical</span><span><i className="tint-3" />Personal</span></div></section></aside></div>
      <TransitionsModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create event"
        maxWidth="520px"
      >
        <form onSubmit={handleCreateEventSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Event title
            </label>
            <input
              type="text"
              required
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="What are you planning?"
              className="w-full liquid-glass-input px-3.5 py-2 text-sm text-neutral-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Client or participant (optional)
              </label>
              <input
                type="text"
                value={newEvent.clientName}
                onChange={e => setNewEvent({ ...newEvent, clientName: e.target.value })}
                placeholder="e.g., Jonathan Miller"
                className="w-full liquid-glass-input px-3.5 py-2 text-sm text-neutral-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Event category
              </label>
              <select
                value={newEvent.type}
                onChange={e => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })}
                className="w-full liquid-glass-input px-3.5 py-2 text-sm text-neutral-800 focus:outline-none"
              >
                <option value="study">Study</option><option value="personal">Personal</option>{clinical && <><option value="cbt_session">Therapy session</option><option value="consultation">Consultation</option><option value="assessment">Assessment</option><option value="supervision">Supervision</option></>}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full liquid-glass-input px-3 py-2 text-sm text-neutral-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Start Time
              </label>
              <input
                type="time" required value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                placeholder="10:00 AM"
                className="w-full liquid-glass-input px-3 py-2 text-sm text-neutral-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Duration
              </label>
              <select
                value={newEvent.duration}
                onChange={e => setNewEvent({ ...newEvent, duration: e.target.value })}
                className="w-full liquid-glass-input px-3 py-2 text-sm text-neutral-800 focus:outline-none"
              >
                <option value="50 min">50 min (Standard)</option>
                <option value="60 min">60 min (Extended)</option>
                <option value="90 min">90 min (Intake)</option>
                <option value="120 min">120 min (Testing)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="telehealthCheck"
              checked={newEvent.isTelehealth}
              onChange={e => setNewEvent({ ...newEvent, isTelehealth: e.target.checked })}
              className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-pink-300"
            />
            <label htmlFor="telehealthCheck" className="text-xs font-medium text-neutral-700 cursor-pointer">
              Telehealth Session (Generate Encrypted Video Room Link)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Clinical Objectives / Notes
            </label>
            <textarea
              rows={3}
              value={newEvent.notes}
              onChange={e => setNewEvent({ ...newEvent, notes: e.target.value })}
              placeholder="Key clinical themes, assessments to administer, or agenda items..."
              className="w-full liquid-glass-input px-3.5 py-2 text-sm text-neutral-800 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-pink-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-secondary text-xs rounded-lg px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-3d btn-3d-primary text-xs rounded-lg px-5 py-2 font-semibold"
            >
              Save event
            </button>
          </div>
        </form>
      </TransitionsModal>

      {/* ── Feedback Toast ── */}
      <TransitionsToast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        title={toastContent.title}
        description={toastContent.desc}
      />
    </div>
  )
}
