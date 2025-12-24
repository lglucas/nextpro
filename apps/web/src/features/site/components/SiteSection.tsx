import type { ReactNode } from 'react'

export function SiteSection({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: 'default' | 'muted'
}) {
  const className =
    variant === 'muted'
      ? 'bg-slate-50 border-y border-slate-100 py-16'
      : 'bg-white py-16'

  return <section className={className}>{children}</section>
}

