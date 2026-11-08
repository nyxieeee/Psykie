import { Suspense, useCallback, useState, type ReactNode } from 'react'
import { StartupContext } from '../context/StartupContext'
import { LoadingScreen } from './LoadingScreen'

export function StartupBoundary({children}:{children:ReactNode}) {
  const [ready,setReady]=useState(false)
  const markReady=useCallback(()=>setReady(true),[])
  return <StartupContext.Provider value={markReady}>
    {!ready&&<LoadingScreen fullScreen label="Loading Psykie..."/>}
    <Suspense fallback={null}>{children}</Suspense>
  </StartupContext.Provider>
}
