import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { POSITIONS } from '@/features/admin/components/engines/types'
import type { SeasonRow, TechnicalMonthlyQuestionRow } from '@/features/admin/components/engines/types'
import { MonthlyQuestionForm } from '@/features/admin/components/engines/MonthlyQuestionForm'
import { MonthlyQuestionsList } from '@/features/admin/components/engines/MonthlyQuestionsList'

export function TechnicalMonthlyRubricsPanel() {
  const [loading, setLoading] = useState(false)
  const [seasons, setSeasons] = useState<SeasonRow[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<string>('atacante')
  const [questions, setQuestions] = useState<TechnicalMonthlyQuestionRow[]>([])

  const [form, setForm] = useState({
    kind: 'base' as 'base' | 'position',
    position: '',
    pillar: 'tecnica' as 'tecnica' | 'tatica' | 'mental' | 'fisico',
    key: '',
    prompt: '',
    sort_order: 0,
    active: true,
  })

  const fetchSeasons = useCallback(async () => {
    const { data, error } = await supabase.from('seasons').select('*').order('year', { ascending: false })
    if (error) {
      alert(error.message)
      setSeasons([])
      return
    }
    const list = (data || []) as unknown as SeasonRow[]
    setSeasons(list)
    const active = list.find((s) => s.is_active)
    if (!selectedSeasonId && active) setSelectedSeasonId(active.id)
  }, [selectedSeasonId])

  const fetchQuestions = useCallback(async () => {
    if (!selectedSeasonId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('technical_monthly_questions')
      .select('*')
      .eq('season_id', selectedSeasonId)
      .order('kind', { ascending: true })
      .order('sort_order', { ascending: true })

    if (error) {
      alert(error.message)
      setQuestions([])
      setLoading(false)
      return
    }
    setQuestions((data || []) as unknown as TechnicalMonthlyQuestionRow[])
    setLoading(false)
  }, [selectedSeasonId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSeasons()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSeasons])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchQuestions()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchQuestions])

  const saveQuestion = async () => {
    if (!selectedSeasonId) return
    const payload = {
      season_id: selectedSeasonId,
      kind: form.kind,
      position: form.kind === 'position' ? (form.position || selectedPosition) : null,
      pillar: form.pillar,
      key: form.key.trim(),
      prompt: form.prompt.trim(),
      sort_order: form.sort_order,
      active: form.active,
    }

    const { error } = await supabase.from('technical_monthly_questions').insert(payload)
    if (error) {
      alert(error.message)
      return
    }

    setForm({ kind: 'base', position: '', pillar: 'tecnica', key: '', prompt: '', sort_order: 0, active: true })
    await fetchQuestions()
  }

  const toggleActive = async (id: string, next: boolean) => {
    const { error } = await supabase.from('technical_monthly_questions').update({ active: next }).eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    await fetchQuestions()
  }

  const deleteQuestion = async (id: string) => {
    const ok = confirm('Excluir esta pergunta?')
    if (!ok) return
    const { error } = await supabase.from('technical_monthly_questions').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    await fetchQuestions()
  }

  const baseQuestions = useMemo(() => questions.filter((q) => q.kind === 'base'), [questions])
  const positionQuestions = useMemo(() => questions.filter((q) => q.kind === 'position' && q.position === selectedPosition), [questions, selectedPosition])

  if (!seasons.length) {
    return <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-sm text-slate-600">Cadastre uma temporada antes de configurar rubricas.</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Temporada</p>
          <select value={selectedSeasonId || ''} onChange={(e) => setSelectedSeasonId(e.target.value || null)} className="mt-2 text-sm border border-slate-200 rounded-lg px-3 py-2">
            <option value="">Selecione</option>
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.year}
                {s.is_active ? ' (ativa)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Posição</p>
          <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="mt-2 text-sm border border-slate-200 rounded-lg px-3 py-2">
            {POSITIONS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyQuestionForm value={form} selectedPosition={selectedPosition} disabled={loading || !selectedSeasonId} onChange={setForm} onSubmit={saveQuestion} />
        <div className="space-y-6">
          <MonthlyQuestionsList title="Base (mensal)" questions={baseQuestions} onToggleActive={toggleActive} onDelete={deleteQuestion} />
          <MonthlyQuestionsList title={`Por posição (mensal) • ${selectedPosition}`} questions={positionQuestions} onToggleActive={toggleActive} onDelete={deleteQuestion} />
        </div>
      </div>
    </div>
  )
}
