import { useState } from 'react'
import { useAuthStore } from '../store'
import { chatWithMindy } from '../utils/ai'

export function AIConnectionPanel() {
  const source=useAuthStore(state=>state.sessionSource)
  const [busy,setBusy]=useState(false),[result,setResult]=useState(''),[error,setError]=useState('')
  const test=async()=>{
    setBusy(true);setResult('');setError('')
    try {
      await chatWithMindy([{role:'user',content:'In one short sentence, explain what active recall means for a psychology student.'}])
      setResult('Mindy responded successfully through your signed-in account.')
    }catch(error){setError(error instanceof Error?error.message:'The AI request did not complete.')}
    finally{setBusy(false)}
  }
  return <section className="ref-panel workspace-backup"><h2>AI connection</h2><p>Mindy, summaries, quizzes, flashcards and handwriting OCR use your private server-side Mistral connection. Research also requires access to Mistral’s search tools.</p><p>Run a real Mindy request to check your account’s current access. This uses one AI request; it does not verify research or OCR access.</p><button className="ref-primary" onClick={()=>void test()} disabled={busy||source!=='supabase'}>{busy?'Checking Mindy…':'Test Mindy connection'}</button>{source!=='supabase'&&<p>Sign in with your Supabase account to use AI. Development demo accounts have no AI access.</p>}{result&&<p role="status">{result}</p>}{error&&<p role="alert" className="ref-form-error">{error}</p>}</section>
}
