import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { PreCadastroOnboardingStatus, PreRegistrationRow } from '@/features/admin/components/preCadastros/types'
import { preCadastroMatchesQuery } from '@/features/admin/components/preCadastros/utils'
import { PreCadastrosTable } from '@/features/admin/components/preCadastros/PreCadastrosTable'

export function PreCadastrosAdminPanel() {
  const [rows, setRows] = useState<PreRegistrationRow[]>([])
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [showSubmittedOnly, setShowSubmittedOnly] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchRows = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pre_registrations')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(200)

    if (error) {
      console.error('Erro ao carregar pré‑cadastros:', error)
      setRows([])
      setLoading(false)
      return
    }

    setRows((data || []) as unknown as PreRegistrationRow[])
    setLoading(false)
  }

  const updateOnboardingStatus = async (id: string, onboardingStatus: PreCadastroOnboardingStatus) => {
    setUpdatingId(id)
    const { error } = await supabase.from('pre_registrations').update({ onboarding_status: onboardingStatus }).eq('id', id)
    if (error) {
      console.error('Erro ao atualizar status:', error)
    }
    await fetchRows()
    setUpdatingId(null)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRows()
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (showSubmittedOnly && row.status !== 'submitted') return false
      return preCadastroMatchesQuery(row, query)
    })
  }, [query, rows, showSubmittedOnly])

  return (
    <div className="p-0">
      <div className="p-4 border-b border-slate-100 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-slate-50/50">
        <div className="space-y-0.5">
          <h2 className="font-semibold text-slate-700">Pré‑cadastros (Censo)</h2>
          <p className="text-xs text-slate-500">Leitura do Supabase. Aqui a gente enxerga o que está chegando do censo.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label className="inline-flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showSubmittedOnly}
              onChange={(e) => setShowSubmittedOnly(e.target.checked)}
              className="w-4 h-4"
            />
            Mostrar apenas enviados
          </label>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome/email/escolinha/UF/cidade..."
            className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[260px]"
          />

          <button onClick={fetchRows} className="text-sm text-primary hover:underline">
            Atualizar
          </button>
        </div>
      </div>

      <PreCadastrosTable
        rows={filteredRows}
        loading={loading}
        updatingId={updatingId}
        expandedId={expandedId}
        onToggleExpanded={(id) => setExpandedId((curr) => (curr === id ? null : id))}
        onUpdateOnboardingStatus={updateOnboardingStatus}
      />
    </div>
  )
}
