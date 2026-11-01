import type { ReactNode } from 'react'

type PageHeaderProps = {
  section: string
  title: string
  description: string
  children?: ReactNode
}

export function PageHeader({ section, title, description, children }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-copy">
        <span className="page-kicker">{section}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  )
}
