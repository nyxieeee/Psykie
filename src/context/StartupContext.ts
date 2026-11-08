import { createContext, useContext, useLayoutEffect } from 'react'

export const StartupContext=createContext<()=>void>(()=>{})
/** Called only when a real route commits, after its lazy children resolve. */
export function useStartupReady(enabled=true) {
  const ready=useContext(StartupContext)
  useLayoutEffect(()=>{if(enabled)ready()},[ready,enabled])
}
