import { Briefcase, GraduationCap } from '@phosphor-icons/react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store'

export function AccountTypePage() {
  const { user, isAuthenticated, isLoading, isSessionReady, error, completeAccountRole } = useAuthStore()
  const [role, setRole] = useState<'student' | 'professional' | null>(null)
  if (!isSessionReady) return <p role="status">Checking your account...</p>
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />
  if (['student', 'professional', 'admin'].includes(user.role)) return <Navigate to="/dashboard" replace />
  return <><h2>Make Psykie your space.</h2><p className="ref-auth-subtitle">Choose your account type to finish signing up.</p>{error && <p className="ref-form-error" role="alert">{error}</p>}<form className="ref-auth-fields" onSubmit={event => { event.preventDefault(); if (role) completeAccountRole(role) }}><fieldset><legend>I am a...</legend><div className="ref-auth-roles">{[{ id: 'student' as const, title: 'Student', text: 'Learn, take notes, and study.', icon: GraduationCap }, { id: 'professional' as const, title: 'Registered Psych', text: 'Organize clients and sessions.', icon: Briefcase }].map(item => <button type="button" key={item.id} aria-pressed={role === item.id} className={role === item.id ? 'selected' : ''} onClick={() => setRole(item.id)}><item.icon size={25}/><span><strong>{item.title}</strong><small>{item.text}</small></span></button>)}</div></fieldset><p className="ref-auth-password-hint">This sets your workspace and cannot be changed in settings.</p><button className="ref-primary ref-wide" disabled={!role || isLoading}>{isLoading ? 'Saving...' : 'Continue to Psykie'}</button></form></>
}
