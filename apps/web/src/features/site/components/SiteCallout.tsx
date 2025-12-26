import type { ReactNode } from 'react'

export function SiteCallout({
  title,
  description,
  actions,
}: {
  title: ReactNode
  description: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-slate-200 max-w-2xl">{description}</p>
      </div>
      {actions ? <div className="flex flex-col sm:flex-row gap-3">{actions}</div> : null}
    </div>
  )
}

