import { AppleLogo, GoogleLogo, WindowsLogo } from '@phosphor-icons/react'
import { useState } from 'react'
import { socialAuthConfigured, startSocialSignIn } from '../utils/socialAuth'

export function SocialSignInButtons() {
  const [error, setError] = useState('')
  return <div className="ref-social-auth"><div className="ref-auth-divider"><span>or continue with</span></div><div className="ref-social-buttons">{[{ id: 'microsoft' as const, name: 'Microsoft', icon: WindowsLogo }, { id: 'google' as const, name: 'Google', icon: GoogleLogo }, { id: 'apple' as const, name: 'Apple', icon: AppleLogo }].map(provider => <button type="button" key={provider.id} className={'ref-social-button ' + provider.id} disabled={!socialAuthConfigured} aria-describedby={!socialAuthConfigured ? 'social-auth-status' : undefined} onClick={async () => { setError(''); try { await startSocialSignIn(provider.id) } catch(error) { setError(error instanceof Error ? error.message : 'Unable to start sign-in.') } }}><provider.icon size={21} weight={provider.id === 'apple' ? 'fill' : 'regular'} aria-hidden="true"/><span>Sign in with {provider.name}</span></button>)}</div>{!socialAuthConfigured && <p className="ref-auth-provider-status" id="social-auth-status">Microsoft, Google, and Apple sign-in are awaiting configuration.</p>}{error && <p className="ref-form-error" role="alert">{error}</p>}<p className="ref-auth-provider-status">New here? After signing in, choose Student or Registered Psych.</p></div>
}
