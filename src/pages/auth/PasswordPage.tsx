import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { requireSupabase, supabase, supabaseConfigured } from '../../utils/supabase'

export function PasswordPage({reset=false}:{reset?:boolean}) {
  const [email,setEmail] = useState(''), [password,setPassword] = useState(''), [confirm,setConfirm] = useState('')
  const [ready,setReady] = useState(!reset), [busy,setBusy] = useState(false), [done,setDone] = useState(false), [error,setError] = useState('')
  useEffect(() => {
    if (!reset || !supabase) return
    let active=true
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session) => {
      if (active && event==='PASSWORD_RECOVERY' && session) setReady(true)
    })
    // The Supabase client completes the PKCE exchange before getSession resolves.
    supabase.auth.getSession().then(({data,error}) => {
      if (!active) return
      if (error) setError(error.message)
      else if (data.session) setReady(true)
      else setError('Open the password reset link from your email, or request a new link.')
    })
    return () => {active=false;subscription.unsubscribe()}
  }, [reset])
  const submit=async(event:React.FormEvent) => {
    event.preventDefault();if(busy)return;setError('')
    if(reset && (password.length<8 || password!==confirm)) {setError('Use at least 8 characters and make sure both passwords match.');return}
    setBusy(true)
    try {
      const client=requireSupabase()
      const {error}=reset ? await client.auth.updateUser({password}) : await client.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+'/reset-password'})
      if(error)throw error
      setDone(true);setPassword('');setConfirm('')
    } catch(error) {setError(error instanceof Error ? error.message : 'The request could not be completed. Try again.')}
    finally {setBusy(false)}
  }
  return <><h2>{reset?'Set a new password':'Forgot your password?'}</h2><p className="ref-auth-subtitle">{reset?'Choose a strong password for your Psykie account.':'We’ll email you a link to reset it.'}</p>
    {done?<p role="status" className="ref-inline-notice">{reset?'Your password was updated. You can return to your workspace.':'If that email has a password account, a reset link will arrive shortly. Open it in this browser.'}</p>:<form className="ref-auth-fields" onSubmit={submit}>
      {reset?<><label htmlFor="new-password">New password</label><div className="ref-auth-input"><input id="new-password" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></div><label htmlFor="confirm-password">Confirm password</label><div className="ref-auth-input"><input id="confirm-password" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)}/></div></>:<><label htmlFor="recovery-email">Email</label><div className="ref-auth-input"><input id="recovery-email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></div></>}
      <button className="ref-primary ref-wide" disabled={busy||!ready||!supabaseConfigured}>{busy?'Please wait…':reset?'Update password':'Send reset link'}</button></form>}
    {error&&<p role="alert" className="ref-form-error">{error}</p>}{!supabaseConfigured&&<p className="ref-inline-notice">Password recovery requires a configured Supabase account.</p>}
    <p className="ref-auth-switch"><Link to={reset&&done?'/dashboard':'/login'}>{reset&&done?'Open workspace':'Back to sign in'}</Link></p></>
}
