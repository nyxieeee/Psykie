import { readWorkspaceList } from '../utils/workspaceStorage'
import { workspaceStorage } from '../utils/workspaceStorage'
import {
  ArrowRight, ChartBar as BarChart3, Cake, CalendarCheck as Calendar, CaretRight, DotsThreeVertical, FileText, GenderNeuter, EnvelopeSimple as Mail,
  ChatCircle as MessageCircle, Phone, Plus, User, Users, X
} from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ReferenceEmpty, ReferenceHeader, ReferenceSearch, ReferenceTabs } from '../components/ReferenceUI'
import { ViewportOverlay } from '../components/ViewportOverlay'

export function ClientsPage() {
  const [clients, setClients] = useState<{
    id: string
    firstName: string
    lastName: string
    email?: string
    phone?: string
    dateOfBirth?: string
    gender?: string
    address?: string
    emergencyContact?: { name: string; phone: string; relationship: string }
    notes?: string
    createdAt: string
    lastSession?: string
    sessionsCount: number
    status: 'active' | 'inactive' | 'on_hold'
    avatar?: string
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showClientDetails, setShowClientDetails] = useState<string | null>(null)
  const [newClient, setNewClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    notes: '',
  })

  const statusOptions = [
    { value: 'all', label: 'All Clients' },
    { value: 'active', label: 'Active', color: 'bg-emerald-100', text: 'text-emerald-700' },
    { value: 'inactive', label: 'Inactive', color: 'bg-slate-100', text: 'text-slate-700' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-amber-100', text: 'text-amber-700' },
  ]

  const genderOptions = ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say']

  useEffect(() => {
    setClients(readWorkspaceList('psykie-clients'))
    setIsLoading(false)
  }, [])
  const filteredClients = clients.filter(client => {
    const matchesSearch = (client.firstName + ' ' + client.lastName + ' ' + (client.email || '') + ' ' + (client.notes || '') + ' client ' + String.fromCharCode(65 + clients.findIndex(item => item.id === client.id)) + ' cl-' + String(clients.findIndex(item => item.id === client.id) + 1).padStart(3, '0')).toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && (selectedStatus === 'all' || client.status === selectedStatus)
  })
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault(); if (!newClient.firstName.trim() || !newClient.lastName.trim()) return
    if (editingClientId) setClients(previous => previous.map(client => client.id === editingClientId ? { ...client, ...newClient } : client))
    else setClients(previous => [{ ...newClient, id: 'client-' + crypto.randomUUID(), createdAt: new Date().toISOString(), sessionsCount: 0, status: 'active' }, ...previous]); setShowCreateModal(false); setEditingClientId(null)
    setNewClient({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '', notes: '' })
  }
  const getStatusColor = (status: string) => statusOptions.find(option => option.value === status) || statusOptions[0]
  const selectedClient = showClientDetails ? clients.find(client => client.id === showClientDetails) : null
  const [activeClientId, setActiveClientId] = useState<string | null>(null)
  const [detailTab, setDetailTab] = useState('overview')
  const [noteDraft, setNoteDraft] = useState('')
  const [editingNote, setEditingNote] = useState(false)
  const activeClient = clients.find(client => client.id === activeClientId) || filteredClients[0]
  const displayName = (id: string, first: string, last: string) => id.startsWith('client-') ? first + ' ' + last : 'Client ' + String.fromCharCode(65 + Math.max(0, clients.findIndex(client => client.id === id)))
  const statusLabel = (status: string) => status === 'on_hold' ? 'On hold' : status === 'active' ? 'Active' : 'Inactive'
  useEffect(() => { if (!isLoading) workspaceStorage.setItem('psykie-clients', JSON.stringify(clients)) }, [clients, isLoading])
  return (
    <div className="reference-page ref-clients-page">
      <ReferenceHeader title="Clients" subtitle="Keep track of your clients, sessions, and notes in one place." />
      <div className="ref-clients-layout"><section><div className="ref-clients-toolbar"><ReferenceTabs items={[{ id: 'all', label: 'All clients', count: clients.length }, { id: 'active', label: 'Active', count: clients.filter(client => client.status === 'active').length }, { id: 'inactive', label: 'Inactive', count: clients.filter(client => client.status === 'inactive').length }]} value={selectedStatus} onChange={setSelectedStatus} /><button className="ref-primary" onClick={() => { setEditingClientId(null); setNewClient({ firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '', notes: '' }); setShowCreateModal(true) }}><Plus size={18} />Add client</button></div><ReferenceSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search clients by name or ID…" /><div className="ref-panel ref-clients-table"><div className="ref-client-table-heading"><span>Client ↕</span><span>Client ID ↕</span><span>Last session ↕</span><span>Sessions</span><span>Status ↕</span><span /></div>{filteredClients.map((client, index) => <button key={client.id} className={activeClient?.id === client.id ? 'ref-client-row selected' : 'ref-client-row'} onClick={() => { setActiveClientId(client.id); setEditingNote(false) }}><span><span className={'ref-avatar tint-' + index % 4}>C{String.fromCharCode(65 + Math.max(0, clients.findIndex(item => item.id === client.id)))}</span><strong>{displayName(client.id, client.firstName, client.lastName)}</strong></span><span>CL-{String(clients.findIndex(item => item.id === client.id) + 1).padStart(3, '0')}</span><span>{client.lastSession || '—'}</span><span>{client.sessionsCount}</span><span><span className={'ref-status ' + client.status}><i />{statusLabel(client.status)}</span></span><CaretRight size={18} /></button>)}{!filteredClients.length && <ReferenceEmpty>{isLoading ? 'Preparing your client workspace…' : 'No clients in this view.'}</ReferenceEmpty>}</div></section>
        <aside className="ref-panel ref-client-detail">{activeClient ? <><div className="ref-client-detail-title"><span className="ref-avatar large tint-0">C{String.fromCharCode(65 + Math.max(0, clients.findIndex(client => client.id === activeClient.id)))}</span><div><h2>{displayName(activeClient.id, activeClient.firstName, activeClient.lastName)}</h2><p>CL-{String(clients.findIndex(client => client.id === activeClient.id) + 1).padStart(3, '0')}</p></div><button aria-label="Open full client profile" onClick={() => setShowClientDetails(activeClient.id)}><DotsThreeVertical size={21} /></button></div><ReferenceTabs items={[{ id: 'overview', label: 'Overview' }, { id: 'sessions', label: 'Sessions' }, { id: 'documents', label: 'Documents' }]} value={detailTab} onChange={setDetailTab} />{detailTab === 'overview' ? <><a className="ref-appointment" href="/calendar"><span className="ref-icon tint-2"><Calendar size={25} /></span><span><strong>Plan the next appointment</strong><small>Open your calendar to schedule a session.</small></span><CaretRight size={19} /></a><button className="ref-primary ref-wide" onClick={() => { setNoteDraft(activeClient.notes || ''); setEditingNote(true) }}><Plus size={18} />Add session note</button><div className="ref-client-overview"><div className="ref-panel-title"><h3>Client overview</h3></div>{editingNote ? <form onSubmit={e => { e.preventDefault(); setClients(previous => previous.map(client => client.id === activeClient.id ? { ...client, notes: noteDraft } : client)); setEditingNote(false) }}><textarea aria-label="Session note" rows={5} value={noteDraft} onChange={e => setNoteDraft(e.target.value)} /><button className="ref-primary">Save note</button></form> : <p>{activeClient.notes || 'No session notes yet. Add a note to keep the next step clear.'}</p>}</div></> : detailTab === 'sessions' ? <div className="ref-detail-section"><h3>Session history</h3><div className="ref-stat"><Calendar size={25} /><span><strong>{activeClient.sessionsCount}</strong><small>completed sessions</small></span></div><p>Last session: {activeClient.lastSession || 'Not recorded'}</p><a className="ref-secondary" href="/calendar">View calendar<ArrowRight size={16} /></a></div> : <div className="ref-detail-section"><h3>Client documents</h3><p>Keep intake forms and session resources together in the document library.</p><a className="ref-primary" href="/documents">Open documents<ArrowRight size={16} /></a></div>}</> : <ReferenceEmpty>Select a client to see their overview.</ReferenceEmpty>}</aside></div>
      <AnimatePresence>
        {showClientDetails && selectedClient && (
          <ViewportOverlay onDismiss={() => setShowClientDetails(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-[99999] p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-modal w-full max-w-lg p-5 my-auto max-h-[88vh] overflow-y-auto"
            >
              <motion.div
                className="flex items-center justify-between mb-6 sticky top-0 bg-white/80 backdrop-blur-xl z-10 -mx-6 -mt-6 pt-6 pr-6 pl-6"
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
                  {selectedClient.firstName} {selectedClient.lastName}
                </motion.h2>
                <motion.button
                  onClick={() => setShowClientDetails(null)}
                  className="text-2xl text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {/* Profile Section */}
                <motion.div
                  className="flex flex-col md:flex-row gap-6 p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {selectedClient.avatar}
                  </motion.div>

                  <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                      >
                        <span className="text-slate-400"><Mail size={18} /></span>
                        <span className="text-slate-700">{selectedClient.email}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.75 }}
                      >
                        <span className="text-slate-400"><Phone size={18} /></span>
                        <span className="text-slate-700">{selectedClient.phone}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <span className="text-slate-400"><Cake size={18} /></span>
                        <span className="text-slate-700">{selectedClient.dateOfBirth}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.85 }}
                      >
                        <span className="text-slate-400"><GenderNeuter size={18} /></span>
                        <span className="text-slate-700">{selectedClient.gender}</span>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                      <motion.div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClient.status)?.color || 'bg-slate-100'
                          } ${getStatusColor(selectedClient.status)?.text || 'text-slate-700'
                          }`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 1 }}
                      >
                        {selectedClient.status}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Contact Information */}
                {selectedClient.address && (
                  <motion.div
                    className="p-4 bg-slate-50 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <motion.h3
                      className="font-bold text-slate-800 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      Address
                    </motion.h3>
                    <motion.p
                      className="text-slate-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      {selectedClient.address}
                    </motion.p>
                  </motion.div>
                )}

                {/* Emergency Contact */}
                {selectedClient.emergencyContact && (
                  <motion.div
                    className="p-4 bg-slate-50 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <motion.h3
                      className="font-bold text-slate-800 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      Emergency Contact
                    </motion.h3>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <span className="text-slate-400"><User size={18} /></span>
                        <span>{selectedClient.emergencyContact.name}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.85 }}
                      >
                        <span className="text-slate-400"><Phone size={18} /></span>
                        <span>{selectedClient.emergencyContact.phone}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 }}
                      >
                        <span className="text-slate-400"><Users size={18} /></span>
                        <span>{selectedClient.emergencyContact.relationship}</span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Clinical Notes */}
                {selectedClient.notes && (
                  <motion.div
                    className="p-4 bg-slate-50 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <motion.h3
                      className="font-bold text-slate-800 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      Clinical Notes
                    </motion.h3>
                    <motion.p
                      className="text-slate-600 whitespace-pre-wrap"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      {selectedClient.notes}
                    </motion.p>
                  </motion.div>
                )}

                {/* Session History */}
                <motion.div
                  className="p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <motion.h3
                    className="font-bold text-slate-800 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    Session History
                  </motion.h3>
                  <motion.div
                    className="grid grid-cols-2 gap-4 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                  >
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1 }}
                    >
                      <span className="text-slate-400"><Calendar size={18} /></span>
                      <span className="text-slate-600">Created: {selectedClient.createdAt}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.05 }}
                    >
                      <span className="text-slate-400"><MessageCircle size={18} /></span>
                      <span className="text-slate-600">Last: {selectedClient.lastSession || 'Never'}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2 md:col-span-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.1 }}
                    >
                      <span className="text-slate-400"><BarChart3 size={18} /></span>
                      <span className="text-slate-600">Total Sessions: {selectedClient.sessionsCount}</span>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                >
                  <motion.button
                    onClick={() => setShowClientDetails(null)}
                    className="btn-secondary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                  <motion.button
                    onClick={() => { setEditingClientId(selectedClient.id); setNewClient({ firstName: selectedClient.firstName, lastName: selectedClient.lastName, email: selectedClient.email || '', phone: selectedClient.phone || '', dateOfBirth: selectedClient.dateOfBirth || '', gender: selectedClient.gender || '', address: selectedClient.address || '', notes: selectedClient.notes || '' }); setShowClientDetails(null); setShowCreateModal(true) }}
                    className="btn-primary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText size={18} /> Edit
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>

      {/* Create Client Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <ViewportOverlay onDismiss={() => setShowCreateModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-[99999] p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="glass-modal w-full max-w-md p-5 space-y-3 my-auto max-h-[90vh] overflow-y-auto"
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
                  {editingClientId ? 'Edit client' : 'Add New Client'}
                </motion.h2>
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  className="text-2xl text-slate-400 hover:text-slate-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              </motion.div>

              <form onSubmit={handleCreateClient} className="space-y-4">
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newClient.firstName}
                      onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
                      placeholder="First name"
                      className="input-solid"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newClient.lastName}
                      onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
                      placeholder="Last name"
                      className="input-solid"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="client@email.com"
                    className="input-solid"
                  />
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="input-solid"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={newClient.dateOfBirth}
                      onChange={(e) => setNewClient({ ...newClient, dateOfBirth: e.target.value })}
                      className="input-solid"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={newClient.gender}
                      onChange={(e) => setNewClient({ ...newClient, gender: e.target.value })}
                      className="input-solid"
                    >
                      <option value="">Select gender</option>
                      {genderOptions.map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address (optional)
                    </label>
                    <input
                      type="text"
                      value={newClient.address}
                      onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                      placeholder="Address"
                      className="input-solid"
                    />
                  </div>
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
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    placeholder="Clinical notes, history, etc."
                    className="textarea-solid"
                    rows={3}
                  />
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
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
                    <span className="mr-1" aria-hidden="true">+</span>
                    {editingClientId ? 'Save changes' : 'Add Client'}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </ViewportOverlay>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}

    </div>
  )
}
