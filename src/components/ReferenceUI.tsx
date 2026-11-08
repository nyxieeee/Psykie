import { MagnifyingGlass, Plus } from '@phosphor-icons/react'
import { useLayoutEffect, useRef, type ReactNode } from 'react'

export function ReferenceHeader({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) {
  return <header className="ref-page-header"><div><h1>{title}</h1><p>{subtitle}</p></div>{action && <button className="ref-primary" onClick={onAction}><Plus size={19} />{action}</button>}</header>
}
export function ReferenceSearch({ value, onChange, placeholder = 'Search…' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="ref-search"><MagnifyingGlass size={17} /><input type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} /></label>
}
export function ReferenceTabs({ items, value, onChange }: { items: { id: string; label: string; count?: number }[]; value: string; onChange: (id: string) => void }) {
  const bar = useRef<HTMLDivElement>(null)
  const signature = items.map(item => `${item.id}:${item.label}:${item.count}`).join('|')
  useLayoutEffect(() => {
    const element = bar.current
    if (!element) return
    const pill = element.querySelector<HTMLElement>('.ref-tabs-pill')
    const measure = () => {
      const active = element.querySelector<HTMLElement>('button[aria-pressed="true"]')
      if (!pill || !active) return
      pill.style.transform = `translate(${active.offsetLeft}px,${active.offsetTop}px)`
      pill.style.width = `${active.offsetWidth}px`
      pill.style.height = `${active.offsetHeight}px`
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    element.querySelectorAll('button').forEach(button => observer.observe(button))
    return () => observer.disconnect()
  }, [value, signature])
  return <div ref={bar} className="ref-tabs motion-tabs" role="group" aria-label="View options"><span className="ref-tabs-pill" aria-hidden="true"/>{items.map(item => <button key={item.id} className={value === item.id ? 'selected' : ''} aria-pressed={value === item.id} onClick={() => onChange(item.id)}>{item.label}{item.count !== undefined && <span>{item.count}</span>}</button>)}</div>
}
export function ReferenceEmpty({ children }: { children: ReactNode }) { return <p className="ref-empty">{children}</p> }
