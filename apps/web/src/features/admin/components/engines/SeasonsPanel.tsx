import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SeasonRow } from '@/features/admin/components/engines/types'
import { toIsoDateInput } from '@/features/admin/components/engines/types'

export function SeasonsPanel() {
  const [loading, setLoading] = useState(false)
  const [seasons, setSeasons] = useState<SeasonRow[]>([])
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    starts_at: `${new Date().getFullYear()}-01-01`,
    ends_at: `${new Date().getFullYear()}-12-31`,
    is_active: false,
  })

  const activeSeason = useMemo(() => seasons.find((s) => s.is_active) ?? null, [seasons])

  const fetchSeasons = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('seasons').select('*').order('year', { ascending: false })
    if (error) {
      alert(error.message)
      setSeasons([])
      setLoading(false)
      return
    }
    setSeasons((data || []) as unknown as SeasonRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSeasons()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSeasons])

  const saveSeason = async () => {
    const payload = {
      year: form.year,
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      is_active: form.is_active,
    }

    const { error } = await supabase.from('seasons').insert(payload)
    if (error) {
      alert(error.message)
      return
    }

    await fetchSeasons()
    setForm({
      year: new Date().getFullYear(),
      starts_at: `${new Date().getFullYear()}-01-01`,
      ends_at: `${new Date().getFullYear()}-12-31`,
      is_active: false,
    })
  }

  const setActiveSeasonById = async (id: string) => {
    const { error: clearError } = await supabase.from('seasons').update({ is_active: false }).neq('id', id)
    if (clearError) {
      alert(clearError.message)
      return
    }

    const { error } = await supabase.from('seasons').update({ is_active: true }).eq('id', id)
    if (error) {
      alert(error.message)
      return
    }

    await fetchSeasons()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Criar temporada</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500">Ano</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => setForm((p) => ({ ...p, year: parseInt(e.target.value) }))}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-slate-300" />
              Marcar como ativa
            </label>
          </div>
          <div>
            <label className="block text-xs text-slate-500">Início</label>
            <input
              type="date"
              value={toIsoDateInput(form.starts_at)}
              onChange={(e) => setForm((p) => ({ ...p, starts_at: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500">Fim</label>
            <input
              type="date"
              value={toIsoDateInput(form.ends_at)}
              onChange={(e) => setForm((p) => ({ ...p, ends_at: e.target.value }))}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={saveSeason}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
          >
            Salvar temporada
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Temporadas</p>
          <button type="button" onClick={fetchSeasons} className="text-sm text-primary hover:underline">
            Atualizar
          </button>
        </div>
        {activeSeason ? (
          <p className="mt-3 text-xs text-slate-500">
            Ativa: <span className="font-semibold text-slate-700">{activeSeason.year}</span>
          </p>
        ) : null}
        <div className="mt-4 space-y-2">
          {seasons.length === 0 ? <p className="text-sm text-slate-500">Nenhuma temporada cadastrada.</p> : null}
          {seasons.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">{s.year}</p>
                <p className="text-xs text-slate-500">
                  {toIsoDateInput(s.starts_at)} → {toIsoDateInput(s.ends_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void setActiveSeasonById(s.id)}
                disabled={s.is_active}
                className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                  s.is_active ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s.is_active ? 'Ativa' : 'Ativar'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
