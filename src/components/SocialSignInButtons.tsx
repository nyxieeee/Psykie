import { GoogleLogo } from '@phosphor-icons/react'
import { useState } from 'react'
import { socialAuthConfigured, startSocialSignIn } from '../utils/socialAuth'

export function SocialSignInButtons() {
  const [error, setError] = useState('')
  return <div className="ref-social-auth">
    <div className="ref-auth-divider"><span>or continue with</span></div>
    <div className="ref-social-buttons"><button type="button" className="ref-social-button google" disabled={!socialAuthConfigured} aria-describedby={!socialAuthConfigured ? 'social-auth-status' : undefined} onClick={async () => {
      setError('')
      try { await startSocialSignIn('google') }
      catch(error) { setError(error instanceof Error ? error.message : 'Unable to start sign-in.') }
    }}><GoogleLogo size={21} aria-hidden="true"/><span>Sign in with Google</span></button></div>
    {!socialAuthConfigured && <p className="ref-auth-provider-status" id="social-auth-status">Google sign-in is awaiting configuration.</p>}
    {error && <p className="ref-form-error" role="alert">{error}</p>}
    <p className="ref-auth-provider-status">New here? After signing in, choose Student or Registered Psych.</p>
  </div>
}
