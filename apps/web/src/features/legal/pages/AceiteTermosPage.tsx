import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { acceptTerms } from '@/features/legal/api'
import { TERMS_URL_PATH, TERMS_VERSION } from '@/features/legal/terms'

function getSafeReturnTo(value: string | null) {
  if (!value) return '/app'
  try {
    const decoded = decodeURIComponent(value)
    if (decoded.startsWith('/')) return decoded
    return '/app'
  } catch {
    return '/app'
  }
}

export function AceiteTermosPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = useMemo(() => getSafeReturnTo(searchParams.get('returnTo')), [searchParams])

  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Aceite de termos</h1>
        <p className="mt-2 text-slate-600">
          Para continuar, confirme o aceite dos Termos de Uso. Esse registro é necessário para acessar a plataforma.
        </p>

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Versão</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{TERMS_VERSION}</p>
          <p className="mt-3 text-sm text-slate-600">
            Leia o documento completo em{' '}
            <Link to={TERMS_URL_PATH} className="text-primary font-semibold hover:underline" target="_blank" rel="noreferrer">
              Termos de Uso
            </Link>
            .
          </p>
        </div>

        <div className="mt-6 flex items-start gap-3">
          <input
            id="accepted"
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <label htmlFor="accepted" className="text-sm text-slate-700">
            Li e aceito os Termos de Uso para acessar a plataforma.
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-8 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={async () => {
              await signOut()
              navigate('/login', { replace: true })
            }}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
          >
            Sair
          </button>

          <button
            type="button"
            disabled={!accepted || submitting}
            onClick={async () => {
              setSubmitting(true)
              setError(null)
              try {
                await acceptTerms(TERMS_VERSION, TERMS_URL_PATH, {
                  userAgent: typeof navigator === 'undefined' ? null : navigator.userAgent,
                  language: typeof navigator === 'undefined' ? null : navigator.language,
                  timezoneOffsetMinutes: new Date().getTimezoneOffset(),
                })
                navigate(returnTo, { replace: true })
              } catch (e: unknown) {
                const message = e instanceof Error ? e.message : 'Erro ao registrar aceite'
                setError(message)
              } finally {
                setSubmitting(false)
              }
            }}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Registrando...' : 'Aceitar e continuar'}
          </button>
        </div>
      </div>
    </div>
  )
}

