import type { ReactNode } from 'react'

export function SiteCard({
  title,
  description,
  icon,
  footer,
}: {
  title: ReactNode
  description: ReactNode
  icon?: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {icon ? <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">{icon}</div> : null}
      <div className={icon ? 'mt-4' : ''}>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  )
}

