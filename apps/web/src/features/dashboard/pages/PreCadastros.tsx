import { useCallback, useEffect, useMemo, useState } from 'react'
import { ClipboardList, Copy, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { PreCadastrosTable } from '@/features/admin/components/preCadastros/PreCadastrosTable'
import type { PreCadastroOnboardingStatus, PreRegistrationRow } from '@/features/admin/components/preCadastros/types'
import { preCadastroMatchesQuery } from '@/features/admin/components/preCadastros/utils'

type ProfileSchoolRow = { school_id: string | null }

const ALLOWED_STATUSES: PreCadastroOnboardingStatus[] = ['pendente_escola', 'aguardando_contrato', 'rejeitado']

export function PreCadastrosPage() {
  const { user, role } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [rows, setRows] = useState<PreRegistrationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)

  const inviteUrl = useMemo(() => {
    if (!schoolId) return ''
    const origin = typeof window === 'undefined' ? '' : window.location.origin
    return `${origin}/pre-cadastro?schoolId=${encodeURIComponent(schoolId)}`
  }, [schoolId])

  const loadSchoolId = useCallback(async () => {
    if (!user) return
    setLoadError(null)

    const { data, error } = await supabase.from('profiles').select('school_id').eq('id', user.id).single()
    if (error) {
      setSchoolId(null)
      setLoadError(error.message)
      return
    }
    const row = data as unknown as ProfileSchoolRow
    setSchoolId(row.school_id ?? null)
  }, [user])

  const fetchRows = useCallback(async () => {
    if (!schoolId) return
    setLoading(true)
    setLoadError(null)

    const { data, error } = await supabase
      .from('pre_registrations')
      .select('*')
      .eq('status', 'submitted')
      .eq('school_id', schoolId)
      .order('updated_at', { ascending: false })
      .limit(200)

    if (error) {
      setRows([])
      setLoading(false)
      setLoadError(error.message)
      return
    }

    setRows((data || []) as unknown as PreRegistrationRow[])
    setLoading(false)
  }, [schoolId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSchoolId()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadSchoolId])

  useEffect(() => {
    if (!schoolId) return
    const timeoutId = window.setTimeout(() => {
      void fetchRows()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchRows, schoolId])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => preCadastroMatchesQuery(row, query))
  }, [query, rows])

  const onToggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  const onUpdateOnboardingStatus = useCallback(
    async (id: string, next: PreCadastroOnboardingStatus) => {
      if (!ALLOWED_STATUSES.includes(next)) return
      setUpdatingId(id)

      const patch: Record<string, unknown> = { onboarding_status: next }
      if (next === 'rejeitado') {
        const reason = window.prompt('Motivo (opcional) para rejeição:')
        if (typeof reason === 'string' && reason.trim()) patch.school_review_note = reason.trim()
      }

      const { error } = await supabase.from('pre_registrations').update(patch).eq('id', id)
      setUpdatingId(null)

      if (error) {
        window.alert(`Erro ao atualizar: ${error.message}`)
        return
      }

      await fetchRows()
    },
    [fetchRows],
  )

  const canUsePage = role === 'school_admin' || role === 'super_admin'

  if (!canUsePage) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <p className="text-sm text-slate-700">Você não tem acesso a esta página.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Pré‑cadastros</h1>
            <p className="text-slate-500">Confirme ou rejeite pré‑cadastros enviados para sua escolinha</p>
          </div>
        </div>
      </div>

      {loadError ? (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-900">{loadError}</div>
      ) : null}

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500">Link de convite (da sua escola)</p>
            <div className="mt-1 flex gap-2">
              <input
                value={inviteUrl || 'Vincule um school_id ao seu perfil para gerar o link.'}
                readOnly
                className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-700"
              />
              <button
                type="button"
                disabled={!inviteUrl}
                onClick={async () => {
                  if (!inviteUrl) return
                  try {
                    await navigator.clipboard.writeText(inviteUrl)
                  } catch {
                    window.alert('Não foi possível copiar automaticamente. Copie manualmente.')
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
            </div>
          </div>

          <div className="relative lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome/email..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <PreCadastrosTable
          rows={filteredRows}
          loading={loading}
          updatingId={updatingId}
          expandedId={expandedId}
          onToggleExpanded={onToggleExpanded}
          onUpdateOnboardingStatus={onUpdateOnboardingStatus}
          allowedOnboardingStatuses={ALLOWED_STATUSES}
        />
      </div>
    </div>
  )
}
