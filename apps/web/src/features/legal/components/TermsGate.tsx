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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  const isTermsRoute = location.pathname.startsWith('/app/aceite-termos')

  const returnTo = useMemo(() => encodeURIComponent(location.pathname + location.search), [location.pathname, location.search])

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (!user) return
      setChecking(true)
      setErrorMessage(null)
      try {
        const ok = await hasAcceptedTerms(user.id, TERMS_VERSION)
        if (mounted) setAccepted(ok)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erro ao validar o aceite dos termos.'
        if (mounted) {
          setAccepted(false)
          setErrorMessage(message)
        }
      } finally {
        if (mounted) setChecking(false)
      }
    }

    if (!loading && user) run()

    return () => {
      mounted = false
    }
  }, [loading, retryKey, user])

  if (loading || checking)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <p className="text-sm text-slate-600">Carregando…</p>
      </div>
    )
  if (!user) return <>{children}</>
  if (isTermsRoute) return <>{children}</>
  if (errorMessage)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-base font-semibold text-slate-900">Não consegui validar os termos agora</p>
          <p className="mt-2 text-sm text-slate-600 break-words">{errorMessage}</p>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => setRetryKey((v) => v + 1)}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
            >
              Tentar de novo
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
            >
              Recarregar
            </button>
          </div>
        </div>
      </div>
    )
  if (!accepted) return <Navigate to={`/app/aceite-termos?returnTo=${returnTo}`} replace />

  return <>{children}</>
}

