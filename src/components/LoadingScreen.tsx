import { motion } from 'framer-motion'
import { useMotionPreference } from '../hooks/useMotionPreference'

interface LoadingScreenProps {
  fullScreen?: boolean
  label?: string
  description?: string
}

export function LoadingScreen({
  fullScreen=true,
  label='Loading Psykie...',
  description='Opening your study workspace',
}:LoadingScreenProps) {
  const reduced=useMotionPreference()
  return <div className={'psykie-loading '+(fullScreen?'psykie-loading-full':'psykie-loading-inline')} data-startup-loader={fullScreen||undefined} role="status" aria-live="polite" aria-busy="true">
    <section className="psykie-loading-card">
      <motion.img src="/mindy-mascot.png" alt="" className="psykie-loading-mascot"
        animate={reduced?{y:0}:{y:[0,-6,0]}} transition={reduced?{duration:0}:{duration:2.4,repeat:Infinity,ease:'easeInOut'}}/>
      <strong className="psykie-loading-brand">Psykie</strong>
      <div><p className="psykie-loading-label">{label}</p>{description&&<p className="psykie-loading-description">{description}</p>}</div>
      <div className="psykie-loading-track" aria-hidden="true"><span/></div>
    </section>
  </div>
}
