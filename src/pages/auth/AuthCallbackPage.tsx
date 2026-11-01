import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { finishSocialSignIn, isLoading, error } = useAuthStore()
  useEffect(() => {
    let active = true
    finishSocialSignIn().then(success => {
      if (!active || !success) return
      const role = useAuthStore.getState().user?.role
      navigate(role === 'guest' ? '/account-type' : '/dashboard', { replace: true })
    })
    return () => { active = false }
  }, [finishSocialSignIn, navigate])
  return <><h2>Signing you in</h2>{isLoading ? <p role="status">Checking your account...</p> : error ? <><p className="ref-form-error" role="alert">{error}</p><button className="ref-primary ref-wide" onClick={() => navigate('/login', { replace: true })}>Return to sign in</button></> : <p role="status">Opening your workspace...</p>}</>
}
