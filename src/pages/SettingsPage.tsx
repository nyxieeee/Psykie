import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser, useAuthStore } from '../store'

export function SettingsPage() {
  const user = useUser()
  const { logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '<User size={18} />',
    bio: '',
  })
  const [settings, setSettings] = useState({
    theme: 'system',
    language: 'English',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    privacy: {
      profileVisibility: 'public',
      activityStatus: true,
    },
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '<User size={18} />' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '<Bell size={18} />' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '<Settings size={18} />' },
  ]

  const themeOptions = [
    { value: 'light', label: 'Light Mode', icon: '☀️' },
    { value: 'dark', label: 'Dark Mode', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ]

  const languageOptions = [
    'English',
    'Spanish',
    'French',
    'German',
    'Mandarin',
    'Japanese',
    'Filipino',
  ]

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile saved:', profile)
    // TODO: Save to backend
  }

  const handleSaveSettings = () => {
    console.log('Settings saved:', settings)
    // TODO: Save to backend
  }

  const handleLogout = () => {
    logout()
    setShowConfirmLogout(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold text-gradient mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Settings
        </motion.h1>
        <motion.p
          className="text-slate-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Configure your preferences and account settings
        </motion.p>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="card p-6"
      >
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl mx-auto mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {profile.avatar}
                </motion.div>
                <motion.button
                  onClick={() => setProfile({ ...profile, avatar: '<User size={18} />' })}
                  className="text-sm text-purple-600 hover:text-purple-700"
                  whileHover={{ x: 4 }}
                >
                  Change Avatar
                </motion.button>
              </motion.div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Your name"
                    className="input-solid"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Your email"
                    className="input-solid"
                    readOnly
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="textarea-solid"
                    rows={4}
                  />
                </motion.div>

                <motion.div
                  className="flex justify-end gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => setProfile({
                      name: user?.name || '',
                      email: user?.email || '',
                      avatar: user?.avatar || '<User size={18} />',
                      bio: '',
                    })}
                    className="btn-secondary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn-primary px-6 py-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              key="appearance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3
                  className="text-lg font-bold text-slate-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Theme
                </motion.h3>
                <motion.p
                  className="text-sm text-slate-500 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  Choose how Psykie looks
                </motion.p>

                <motion.div
                  className="grid grid-cols-3 gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {themeOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setSettings({ ...settings, theme: option.value })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        settings.theme === option.value
                          ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <motion.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      >
                        <motion.span
                          className="text-3xl"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                          {option.icon}
                        </motion.span>
                        <motion.span
                          className={`font-medium ${
                            settings.theme === option.value ? 'text-purple-700' : 'text-slate-600'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        >
                          {option.label}
                        </motion.span>
                        {settings.theme === option.value && (
                          <motion.div
                            className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                          >
                            <Check size={18} />
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <motion.h3
                  className="text-lg font-bold text-slate-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Language
                </motion.h3>
                <motion.select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="input-solid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </motion.select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <motion.h3
                  className="text-lg font-bold text-slate-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Timezone
                </motion.h3>
                <motion.p
                  className="text-sm text-slate-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {settings.timezone}
                </motion.p>
              </motion.div>

              <motion.div
                className="flex justify-end gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <motion.button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    theme: 'system',
                    language: 'English',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  })}
                  className="btn-secondary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset
                </motion.button>
                <motion.button
                  onClick={handleSaveSettings}
                  className="btn-primary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3
                  className="text-lg font-bold text-slate-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Notification Preferences
                </motion.h3>
                <motion.p
                  className="text-sm text-slate-500 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  Choose how you want to be notified
                </motion.p>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {Object.entries(settings.notifications).map(([key, value], index) => {
                    const labels = {
                      email: 'Email Notifications',
                      push: 'Push Notifications',
                      sms: 'SMS Notifications',
                    }
                    const descriptions = {
                      email: 'Receive notifications via email',
                      push: 'Receive push notifications on your device',
                      sms: 'Receive notifications via SMS (carrier charges may apply)',
                    }
                    return (
                      <motion.div
                        key={key}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                        >
                          <motion.h4
                            className="font-medium text-slate-800"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          >
                            {labels[key as keyof typeof labels]}
                          </motion.h4>
                          <motion.p
                            className="text-sm text-slate-500"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          >
                            {descriptions[key as keyof typeof descriptions]}
                          </motion.p>
                        </motion.div>
                        <motion.label
                          className="relative inline-flex items-center cursor-pointer"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {
                                ...settings.notifications,
                                [key]: e.target.checked,
                              },
                            })}
                            className="sr-only peer"
                          />
                          <motion.div
                            className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                            whileHover={{ scale: 1.05 }}
                          />
                        </motion.label>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-end gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <motion.button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    notifications: { email: true, push: true, sms: false },
                  })}
                  className="btn-secondary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset
                </motion.button>
                <motion.button
                  onClick={handleSaveSettings}
                  className="btn-primary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3
                  className="text-lg font-bold text-slate-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Profile Visibility
                </motion.h3>
                <motion.p
                  className="text-sm text-slate-500 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  Who can see your profile information
                </motion.p>

                <motion.div
                  className="grid grid-cols-3 gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {[
                    { value: 'public', label: 'Public', icon: '🌍', desc: 'Anyone can see' },
                    { value: 'contacts', label: 'Contacts', icon: '<Users size={18} />', desc: 'Only your contacts' },
                    { value: 'private', label: 'Private', icon: '🔒', desc: 'Only you' },
                  ].map((option, index) => (
                    <motion.button
                      key={option.value}
                      onClick={() => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, profileVisibility: option.value },
                      })}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        settings.privacy.profileVisibility === option.value
                          ? 'border-purple-500 bg-purple-50/50 ring-2 ring-purple-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <motion.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      >
                        <motion.span
                          className="text-3xl"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                          {option.icon}
                        </motion.span>
                        <motion.span
                          className={`font-medium ${
                            settings.privacy.profileVisibility === option.value ? 'text-purple-700' : 'text-slate-600'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        >
                          {option.label}
                        </motion.span>
                        <motion.span
                          className={`text-xs ${
                            settings.privacy.profileVisibility === option.value ? 'text-purple-600' : 'text-slate-400'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                        >
                          {option.desc}
                        </motion.span>
                        {settings.privacy.profileVisibility === option.value && (
                          <motion.div
                            className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                          >
                            <Check size={18} />
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <motion.h4
                    className="font-medium text-slate-800"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    Show Activity Status
                  </motion.h4>
                  <motion.p
                    className="text-sm text-slate-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    Let others see when you're online
                  </motion.p>
                </motion.div>
                <motion.label
                  className="relative inline-flex items-center cursor-pointer"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <input
                    type="checkbox"
                    checked={settings.privacy.activityStatus}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, activityStatus: e.target.checked },
                    })}
                    className="sr-only peer"
                  />
                  <motion.div
                    className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"
                    whileHover={{ scale: 1.05 }}
                  />
                </motion.label>
              </motion.div>

              <motion.div
                className="flex justify-end gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <motion.button
                  type="button"
                  onClick={() => setSettings({
                    ...settings,
                    privacy: { profileVisibility: 'public', activityStatus: true },
                  })}
                  className="btn-secondary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset
                </motion.button>
                <motion.button
                  onClick={handleSaveSettings}
                  className="btn-primary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3
                  className="text-lg font-bold text-slate-800 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Account Information
                </motion.h3>
                <motion.p
                  className="text-sm text-slate-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {user?.role === 'professional' 
                    ? 'Professional account with access to client management'
                    : 'Student account with access to learning tools'}
                </motion.p>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className="p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.h4
                    className="font-medium text-slate-800 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Account Type
                  </motion.h4>
                  <motion.p
                    className="text-sm text-slate-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {user?.role === 'admin' ? 'Administrator' : user?.role === 'professional' ? 'Professional' : 'Student'}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <motion.h4
                    className="font-medium text-slate-800 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Member Since
                  </motion.h4>
                  <motion.p
                    className="text-sm text-slate-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <motion.h4
                    className="font-medium text-slate-800 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Last Login
                  </motion.h4>
                  <motion.p
                    className="text-sm text-slate-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </motion.p>
                </motion.div>

                <motion.div
                  className="p-4 bg-slate-50 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <motion.h4
                    className="font-medium text-slate-800 mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Storage Used
                  </motion.h4>
                  <motion.p
                    className="text-sm text-slate-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    124 MB of 1 GB
                  </motion.p>
                  <motion.div
                    className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: '12.4%' }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <motion.button
                  className="w-full flex items-center justify-between p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowConfirmLogout(true)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <motion.span
                      className="text-2xl"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      🔐
                    </motion.span>
                    <motion.span
                      className="font-medium text-rose-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      Log Out
                    </motion.span>
                  </motion.div>
                  <motion.span
                    className="text-sm text-rose-600"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.85 }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </motion.button>

                <motion.button
                  className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <motion.div
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                  >
                    <motion.span
                      className="text-2xl"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <Trash2 size={18} />️
                    </motion.span>
                    <motion.span
                      className="font-medium text-slate-700"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                      Delete Account
                    </motion.span>
                  </motion.div>
                  <motion.span
                    className="text-sm text-slate-400"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.95 }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showConfirmLogout && (
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
              className="glass-modal w-full max-w-md p-6"
            >
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-3xl mx-auto mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  ⚠️
                </motion.div>
                
                <motion.h2
                  className="text-2xl font-bold text-rose-700 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  Log Out
                </motion.h2>
                
                <motion.p
                  className="text-slate-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  Are you sure you want to log out of Psykie?
                </motion.p>
              </motion.div>

              <motion.div
                className="flex justify-end gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmLogout(false)}
                  className="btn-secondary px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="btn-rose px-6 py-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Log Out
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Custom button for logout
const LogoutButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 text-rose-700 font-medium hover:bg-rose-50 transition-colors"
      whileHover={{ scale: 1.01, x: 4 }}
      whileTap={{ scale: 0.99 }}
    >
      <span>🔐</span>
      <span>Log Out</span>
    </motion.button>
  )
}
