import { useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'

export function DevAccounts() {
  const { loginDemo, isLoading } = useAuthStore()
  const navigate = useNavigate()
  if (!import.meta.env.DEV) return null
  return <details className="ref-demo-accounts ref-dev-accounts"><summary>Development accounts</summary><p>Skip signup in the development server. These accounts have separate, empty workspaces.</p>{[{ role: 'student' as const, label: 'Student' }, { role: 'professional' as const, label: 'Registered Psych' }].map(account => <button type="button" disabled={isLoading} key={account.role} onClick={async () => { if (await loginDemo(account.role)) navigate('/dashboard', { replace: true }) }}><span>Continue as {account.label}</span><small>Development only</small></button>)}</details>
}
