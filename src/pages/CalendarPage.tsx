import { useState, useEffect } from 'react'
import { ArrowRight, MessageCircle, List, BarChart3, Calendar, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../store'

export function CalendarPage() {
  const user = useUser()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [events, setEvents] = useState<{
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'session' | 'consultation' | 'follow_up' | 'assessment' | 'other';
    clientId?: string;
    clientName?: string;
    location?: string;
    notes?: string;
    color: string;
    reminders: boolean;
  }[]>([])

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const eventTypes = [
    { value: 'session', label: 'Therapy Session', color: 'bg-purple-100', text: 'text-purple-700' },
    { value: 'consultation', label: 'Consultation', color: 'bg-blue-100', text: 'text-blue-700' },
    { value: 'follow_up', label: 'Follow-up', color: 'bg-emerald-100', text: 'text-emerald-700' },
    { value: 'assessment', label: 'Assessment', color: 'bg-amber-100', text: 'text-amber-700' },
    { value: 'other', label: 'Other', color: 'bg-rose-100', text: 'text-rose-700' },
  ]

  const clients = [
    { id: '1', name: 'John Smith', email: 'john@email.com' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@email.com' },
    { id: '3', name: 'Michael Brown', email: 'michael@email.com' },
    { id: '4', name: 'Emily Davis', email: 'emily@email.com' },
  ]

  useEffect(() => {
    // Simulate loading events
    const mockEvents = [
      {
        id: '1',
        title: 'Therapy Session - John Smith',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM - 11:00 AM',
        type: 'session',
        clientId: '1',
        clientName: 'John Smith',
        location: 'Office',
        notes: 'Follow-up on anxiety management techniques',
        color: 'bg-purple-100',
        reminders: true,
      },
      {
        id: '2',
        title: 'Initial Consultation',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '2:00 PM - 3:00 PM',
        type: 'consultation',
        clientId: '2',
        clientName: 'Sarah Johnson',
        location: 'Video Call',
        notes: 'New client intake',
        color: 'bg-blue-100',
        reminders: true,
      },
      {
        id: '3',
        title: 'Follow-up Session',
        date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        time: '11:00 AM - 12:00 PM',
        type: 'follow_up',
        clientId: '3',
        clientName: 'Michael Brown',
        location: 'Office',
        notes: 'Review progress on depression treatment',
        color: 'bg-emerald-100',
        reminders: true,
      },
      {
        id: '4',
        title: 'Assessment Session',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        time: '9:00 AM - 10:30 AM',
        type: 'assessment',
        clientId: '4',
        clientName: 'Emily Davis',
        location: 'Assessment Room',
        notes: 'Cognitive assessment battery',
        color: 'bg-amber-100',
        reminders: true,
      },
    ]
    setEvents(mockEvents)
  }, [])

  useEffect(() => {
    setCurrentDate(new Date(currentYear, currentMonth))
  }, [currentMonth, currentYear])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

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
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(null)
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    const dateStr = date.toISOString().split('T')[0]
    return dateStr === selectedDate
  }

  const hasEvents = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return getEventsForDate(dateStr).length > 0
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    type: 'session' as 'session' | 'consultation' | 'follow_up' | 'assessment' | 'other',
    clientId: '',
    location: '',
    notes: '',
    reminders: true,
  })

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEvent.title.trim() || !newEvent.date) return
    
    const client = clients.find(c => c.id === newEvent.clientId)
    
    const newEventData = {
      id: `event-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      clientId: newEvent.clientId,
      clientName: client?.name,
      location: newEvent.location,
      notes: newEvent.notes,
      color: eventTypes.find(et => et.value === newEvent.type)?.color || 'bg-rose-100',
      reminders: newEvent.reminders,
    }
    
    setEvents([...events, newEventData])
    setShowCreateEventModal(false)
    setNewEvent({
      title: '',
      date: '',
      time: '',
      type: 'session',
      clientId: '',
      location: '',
      notes: '',
      reminders: true,
    })
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  // Get current day events
  const todayEvents = events.filter(e => {
    const eventDate = new Date(e.date)
    const today = new Date()
    return eventDate.toDateString() === today.toDateString()
  })

  // Get upcoming events
  const upcomingEvents = events
    .filter(e => {
      const eventDate = new Date(e.date)
      const today = new Date()
      eventDate.setHours(0, 0, 0, 0)
      return eventDate > today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1
            className="text-3xl font-bold text-gradient mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Calendar
          </motion.h1>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Schedule and manage your appointments and sessions
          </motion.p>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Today Button */}
          <motion.button
            onClick={goToToday}
            className="px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            Today
          </motion.button>

          {/* Create Event Button */}
          <motion.button
            onClick={() => setShowCreateEventModal(true)}
            className="btn-primary px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-lg mr-1">+</span>
            New Event
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Calendar Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          className="text-xl font-bold text-slate-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {monthNames[currentMonth]} {currentYear}
        </motion.h2>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.button
            onClick={goToPreviousMonth}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ←
          </motion.button>
          <motion.button
            onClick={goToNextMonth}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        className="grid grid-cols-7 gap-1 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Day Names */}
        {dayNames.map((day, index) => (
          <motion.div
            key={day}
            className="text-center py-2 text-sm font-medium text-slate-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
          >
            {day}
          </motion.div>
        ))}

        {/* Empty cells for days before first day of month */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <motion.div
            key={`empty-${i}`}
            className="h-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.02 }}
          />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = new Date(currentYear, currentMonth, day)
          const dateStr = date.toISOString().split('T')[0]
          const dayEvents = getEventsForDate(dateStr)
          const isTodayDate = isToday(date)
          const isSelectedDate = isSelected(date)

          return (
            <motion.div
              key={`day-${day}`}
              className="relative h-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + (firstDayOfMonth + i) * 0.02 }}
            >
              {/* Day Cell */}
              <motion.button
                onClick={() => setSelectedDate(dateStr)}
                className={`w-full h-full rounded-lg transition-all duration-200 ${
                  isSelectedDate
                    ? 'bg-purple-600 text-white'
                    : isTodayDate
                      ? 'bg-purple-100 text-purple-700 font-bold'
                      : hasEvents(date)
                        ? 'bg-purple-50 hover:bg-purple-100'
                        : 'hover:bg-slate-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {day}
              </motion.button>

              {/* Event Dots */}
              {dayEvents.length > 0 && (
                <motion.div
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + (firstDayOfMonth + i) * 0.02 }}
                >
                  {dayEvents.slice(0, 3).map((_, eventIndex) => (
                    <motion.div
                      key={`event-dot-${day}-${eventIndex}`}
                      className="w-2 h-2 rounded-full bg-purple-500"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + (firstDayOfMonth + i) * 0.02 + eventIndex * 0.1 }}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-purple-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + (firstDayOfMonth + i) * 0.02 }}
                      title={`+${dayEvents.length - 3} more`}
                    />
                  )}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Today's Events and Upcoming */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Today's Events */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.h2
            className="text-xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Today's Events
          </motion.h2>
          
          {todayEvents.length > 0 ? (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {todayEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className={`card p-4 ${event.color}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <motion.div
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      {event.type === 'session' ? '<MessageCircle size={14} />' : 
                       event.type === 'consultation' ? '👨‍💼' :
                       event.type === 'follow_up' ? '<List size={14} />' :
                       event.type === 'assessment' ? '<BarChart3 size={14} />' : '<Calendar size={14} />'}
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.h3
                        className="font-bold text-slate-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.85 + index * 0.1 }}
                      >
                        {event.title}
                      </motion.h3>
                      <motion.p
                        className="text-sm text-slate-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      >
                        {event.time}
                      </motion.p>
                      {event.location && (
                        <motion.p
                          className="text-xs text-slate-400 mt-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.95 + index * 0.1 }}
                        >
                          {event.location}
                        </motion.p>
                      )}
                    </div>

                    <motion.div
                      className="flex flex-col gap-1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                    >
                      {event.reminders && (
                        <motion.button
                          className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm"
                          whileHover={{ scale: 1.1 }}
                          title="Reminder set"
                        >
                          <Bell size={18} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => deleteEvent(event.id)}
                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm"
                        whileHover={{ scale: 1.1 }}
                        title="Delete"
                      >
                        <X size={18} />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="empty-state py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.p
                className="text-slate-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                No events scheduled for today
              </motion.p>
            </motion.div>
          )}
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.h2
            className="text-xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Upcoming
          </motion.h2>
          
          {upcomingEvents.length > 0 ? (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  className="card p-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <motion.div
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <motion.div
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-sm flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Calendar size={14} />
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <motion.p
                        className="font-medium text-slate-800 truncate"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.85 + index * 0.1 }}
                      >
                        {event.title}
                      </motion.p>
                      <motion.p
                        className="text-xs text-slate-400"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      >
                        {event.date} • {event.time}
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="empty-state py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.p
                className="text-slate-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                No upcoming events
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Selected Date Events (if any date with events is selected) */}
      {selectedDate && getEventsForDate(selectedDate).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Events on {new Date(selectedDate).toLocaleDateString([], { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </motion.h2>
          
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {getEventsForDate(selectedDate).map((event, index) => (
              <motion.div
                key={event.id}
                className={`card p-4 ${event.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <motion.div
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    {event.type === 'session' ? '<MessageCircle size={14} />' : 
                     event.type === 'consultation' ? '👨‍💼' :
                     event.type === 'follow_up' ? '<List size={14} />' :
                     event.type === 'assessment' ? '<BarChart3 size={14} />' : '<Calendar size={14} />'}
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.h3
                      className="font-bold text-slate-800"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }}
                    >
                      {event.title}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-slate-500"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    >
                      {event.time}
                    </motion.p>
                    {event.location && (
                      <motion.p
                        className="text-xs text-slate-400 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.25 + index * 0.1 }}
                      >
                        {event.location}
                      </motion.p>
                    )}
                    {event.notes && (
                      <motion.p
                        className="text-xs text-slate-500 mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      >
                        {event.notes}
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    className="flex flex-col gap-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  >
                    {event.reminders && (
                      <motion.button
                        className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm"
                        whileHover={{ scale: 1.1 }}
                        title="Reminder set"
                      >
                        <Bell size={18} />
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => deleteEvent(event.id)}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm"
                      whileHover={{ scale: 1.1 }}
                      title="Delete"
                    >
                      <X size={18} />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-modal w-full max-w-lg p-6"
            >
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.h2
                  className="text-2xl font-bold text-gradient"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  Create New Event
                </motion.h2>
                <motion.button
                  onClick={() => setShowCreateEventModal(false)}
                  className="text-2xl text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              </motion.div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., Therapy Session - John Smith"
                    className="input-solid"
                    autoFocus
                  />
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="input-solid"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time
                    </label>
                    <input
                      type="text"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="e.g., 10:00 AM - 11:00 AM"
                      className="input-solid"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'session' | 'consultation' | 'follow_up' | 'assessment' | 'other' })}
                      className="input-solid"
                    >
                      {eventTypes.map((et) => (
                        <option key={et.value} value={et.value}>{et.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Client
                    </label>
                    <select
                      value={newEvent.clientId}
                      onChange={(e) => setNewEvent({ ...newEvent, clientId: e.target.value })}
                      className="input-solid"
                    >
                      <option value="">No client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="e.g., Office, Video Call"
                    className="input-solid"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="textarea-solid"
                    rows={3}
                  />
                </motion.div>

                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <input
                    type="checkbox"
                    id="reminders"
                    checked={newEvent.reminders}
                    onChange={(e) => setNewEvent({ ...newEvent, reminders: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-400"
                  />
                  <label htmlFor="reminders" className="text-sm text-slate-600">
                    Set reminders
                  </label>
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateEventModal(false)}
                    className="btn-secondary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn-primary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-1">+</span>
                    Create Event
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowCreateEventModal(true)}
        className="fab"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: 'spring', damping: 10, stiffness: 200 }}
      >
        <Calendar size={14} />
      </motion.button>
    </motion.div>
  )
}
