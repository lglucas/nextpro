import type { ReactNode } from 'react'

export function SiteHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description: ReactNode
  children?: ReactNode
}) {
  return (
    <section className="bg-[radial-gradient(900px_circle_at_0%_0%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(900px_circle_at_100%_20%,rgba(15,23,42,0.10),transparent_55%)] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-xs font-semibold text-slate-700">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600">{description}</p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}

