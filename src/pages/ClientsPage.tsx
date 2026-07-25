import { useState, useEffect } from 'react'
import { FileText, Calendar, Users, User, X, Search, Mail, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '../store'

export function ClientsPage() {
  const user = useUser()
  const [clients, setClients] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    emergencyContact?: { name: string; phone: string; relationship: string };
    notes?: string;
    createdAt: string;
    lastSession?: string;
    sessionsCount: number;
    status: 'active' | 'inactive' | 'on_hold';
    avatar?: string;
  }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
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
    // Simulate loading clients
    const timer = setTimeout(() => {
      const mockClients = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          dateOfBirth: '1985-03-15',
          gender: 'Male',
          address: '123 Main St, Springfield, IL',
          emergencyContact: { name: 'Jane Smith', phone: '(555) 987-6543', relationship: 'Wife' },
          notes: 'History of anxiety. Responds well to CBT.',
          createdAt: '2 years ago',
          lastSession: '2 days ago',
          sessionsCount: 42,
          status: 'active',
          avatar: '👨',
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@email.com',
          phone: '(555) 234-5678',
          dateOfBirth: '1990-08-22',
          gender: 'Female',
          address: '456 Oak Ave, Chicago, IL',
          emergencyContact: { name: 'Robert Johnson', phone: '(555) 345-6789', relationship: 'Husband' },
          notes: 'New client. Initial assessment scheduled.',
          createdAt: '1 month ago',
          lastSession: '1 week ago',
          sessionsCount: 3,
          status: 'active',
          avatar: '👩',
        },
        {
          id: '3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.b@email.com',
          phone: '(555) 345-6789',
          dateOfBirth: '1978-11-30',
          gender: 'Male',
          address: '789 Pine Rd, Peoria, IL',
          emergencyContact: { name: 'Lisa Brown', phone: '(555) 456-7890', relationship: 'Sister' },
          notes: 'On medical leave. Resume sessions in 2 months.',
          createdAt: '1 year ago',
          lastSession: '3 months ago',
          sessionsCount: 28,
          status: 'on_hold',
          avatar: '👨',
        },
        {
          id: '4',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.d@email.com',
          phone: '(555) 456-7890',
          dateOfBirth: '1982-05-14',
          gender: 'Female',
          address: '321 Elm St, Naperville, IL',
          emergencyContact: { name: 'David Davis', phone: '(555) 567-8901', relationship: 'Brother' },
          notes: 'Completed treatment plan. Discharged.',
          createdAt: '3 years ago',
          lastSession: '6 months ago',
          sessionsCount: 56,
          status: 'inactive',
          avatar: '👩',
        },
        {
          id: '5',
          firstName: 'Alex',
          lastName: 'Wilson',
          email: 'alex.w@email.com',
          phone: '(555) 567-8901',
          dateOfBirth: '1995-12-01',
          gender: 'Non-binary',
          address: '654 Cedar Ln, Evanston, IL',
          emergencyContact: { name: 'Jamie Wilson', phone: '(555) 678-9012', relationship: 'Partner' },
          notes: 'Working on trauma processing. Good progress.',
          createdAt: '8 months ago',
          lastSession: 'Yesterday',
          sessionsCount: 18,
          status: 'active',
          avatar: '<User size={18} />',
        },
      ]
      setClients(mockClients)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       client.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.firstName.trim() || !newClient.lastName.trim()) return
    
    const newClientData = {
      id: `client-${Date.now()}`,
      firstName: newClient.firstName,
      lastName: newClient.lastName,
      email: newClient.email,
      phone: newClient.phone,
      dateOfBirth: newClient.dateOfBirth,
      gender: newClient.gender,
      address: newClient.address,
      notes: newClient.notes,
      createdAt: 'Just now',
      sessionsCount: 0,
      status: 'active' as const,
      avatar: '<User size={18} />',
    }
    
    setClients([newClientData, ...clients])
    setShowCreateModal(false)
    setNewClient({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      notes: '',
    })
  }

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0]
  }

  const selectedClient = showClientDetails ? clients.find(c => c.id === showClientDetails) : null

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
            Client Management
          </motion.h1>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Manage your clients and their records
          </motion.p>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Search */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-pill pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          </motion.div>

          {/* Create Client Button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-6 py-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="text-lg mr-1">+</span>
            New Client
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Status Filter */}
      <motion.div
        className="flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {statusOptions.map((status, index) => {
          const statusObj = statusOptions.find(s => s.value === status.value)
          return (
            <motion.button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedStatus === status.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              {status.label}
            </motion.button>
          )
        })}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.p
            className="text-2xl font-bold text-purple-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredClients.length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Total Clients
          </motion.p>
        </motion.div>

        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.p
            className="text-2xl font-bold text-emerald-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredClients.filter(c => c.status === 'active').length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Active
          </motion.p>
        </motion.div>

        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.p
            className="text-2xl font-bold text-amber-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredClients.reduce((sum, c) => sum + c.sessionsCount, 0)}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Total Sessions
          </motion.p>
        </motion.div>

        <motion.div
          className="card p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.p
            className="text-2xl font-bold text-rose-700"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredClients.filter(c => c.status === 'inactive').length}
          </motion.p>
          <motion.p
            className="text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Inactive
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Clients List */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="card h-36 skeleton"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
      ) : filteredClients.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="card card-3d cursor-pointer group"
                onClick={() => setShowClientDetails(client.id)}
              >
                <div className="p-4">
                  <motion.div
                    className="flex items-start gap-4 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 + 0.1 }}
                  >
                    {/* Avatar */}
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {client.avatar}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <motion.h3
                        className="font-bold text-slate-800 truncate"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 + 0.2 }}
                      >
                        {client.firstName} {client.lastName}
                      </motion.h3>
                      <motion.p
                        className="text-sm text-slate-500"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 + 0.3 }}
                      >
                        {client.email}
                      </motion.p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 + 0.4 }}
                  >
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.5 }}
                    >
                      <motion.span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(client.status)?.color || 'bg-slate-100'
                        } ${
                          getStatusColor(client.status)?.text || 'text-slate-700'
                        }`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 + 0.6 }}
                      >
                        {client.status}
                      </motion.span>
                      <motion.span
                        className="text-xs text-slate-400"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 + 0.7 }}
                      >
                        {client.sessionsCount} sessions
                      </motion.span>
                    </motion.div>

                    <motion.div
                      className="flex items-center justify-between text-xs text-slate-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 + 0.6 }}
                    >
                      <span>Created: {client.createdAt}</span>
                      <span>Last: {client.lastSession || 'Never'}</span>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="empty-state-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Users size={18} />
          </motion.div>
          <motion.h3
            className="text-xl font-bold text-slate-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            No clients found
          </motion.h3>
          <motion.p
            className="text-slate-500"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {searchQuery || selectedStatus !== 'all' 
              ? 'Try adjusting your search or filter'
              : 'Start by adding your first client'}
          </motion.p>
        </motion.div>
      )}

      {/* Client Details Modal */}
      <AnimatePresence>
        {showClientDetails && selectedClient && (
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
              className="glass-modal w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
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
                        <span className="text-slate-400">📞</span>
                        <span className="text-slate-700">{selectedClient.phone}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <span className="text-slate-400">🎂</span>
                        <span className="text-slate-700">{selectedClient.dateOfBirth}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.85 }}
                      >
                        <span className="text-slate-400">⚧</span>
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
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusColor(selectedClient.status)?.color || 'bg-slate-100'
                        } ${
                          getStatusColor(selectedClient.status)?.text || 'text-slate-700'
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
                        <span className="text-slate-400">📞</span>
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
                    className="btn-primary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText size={18} /> Edit
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Client Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
                  Add New Client
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
                    <span className="mr-1">+</span>
                    Add Client
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowCreateModal(true)}
        className="fab"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95, rotate: 0 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5, type: 'spring', damping: 10, stiffness: 200 }}
      >
        <User size={18} />
      </motion.button>
    </motion.div>
  )
}
