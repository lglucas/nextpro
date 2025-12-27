import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { hasAcceptedTerms } from '@/features/legal/api'
import { TERMS_VERSION } from '@/features/legal/terms'

export function TermsGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [accepted, setAccepted] = useState(false)

  const isTermsRoute = location.pathname.startsWith('/app/aceite-termos')

  const returnTo = useMemo(() => encodeURIComponent(location.pathname + location.search), [location.pathname, location.search])

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (!user) return
      setChecking(true)
      try {
        const ok = await hasAcceptedTerms(user.id, TERMS_VERSION)
        if (mounted) setAccepted(ok)
      } catch {
        if (mounted) setAccepted(false)
      } finally {
        if (mounted) setChecking(false)
      }
    }

    if (!loading && user) run()

    return () => {
      mounted = false
    }
  }, [loading, user])

  if (loading) return null
  if (!user) return <>{children}</>
  if (isTermsRoute) return <>{children}</>
  if (checking) return null
  if (!accepted) return <Navigate to={`/app/aceite-termos?returnTo=${returnTo}`} replace />

  return <>{children}</>
}

