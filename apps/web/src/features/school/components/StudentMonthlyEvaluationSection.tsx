import { useEffect, useMemo, useState } from 'react'
import { getStudentMonthlySummary, listStudentMonthlyMonths, monthLabel, type MonthlySummary, type SeasonRow } from '@/features/school/services/studentMonthlyEvaluation'

type Props = {
  studentId: string
  season: SeasonRow | null
}

export function StudentMonthlyEvaluationSection({ studentId, season }: Props) {
  const [months, setMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const seasonId = season?.id ?? null

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!seasonId) {
        setMonths([])
        setSelectedMonth('')
        setSummary(null)
        return
      }
      if (!studentId) return

      setLoading(true)
      const out = await listStudentMonthlyMonths(seasonId, studentId)
      if (!mounted) return

      setMonths(out)
      setSelectedMonth((prev) => (prev ? prev : out[0] || ''))
      setLoading(false)
    }

    void run()

    return () => {
      mounted = false
    }
  }, [seasonId, studentId])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!seasonId) return
      if (!studentId) return
      if (!selectedMonth) {
        setSummary(null)
        return
      }

      setLoading(true)
      const next = await getStudentMonthlySummary(seasonId, studentId, selectedMonth)

      if (!mounted) return

      setSummary(next)
      setLoading(false)
    }

    void run()

    return () => {
      mounted = false
    }
  }, [seasonId, selectedMonth, studentId])

  const header = useMemo(() => {
    if (!season) return null
    return `Temporada ${season.year}`
  }, [season])

  const pct = useMemo(() => {
    if (!summary) return 0
    return Math.max(0, Math.min(100, Math.round((summary.avg / 10) * 100)))
  }, [summary])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Avaliação técnica mensal</h2>
          <p className="mt-1 text-sm text-slate-600">{header || 'Sem temporada ativa definida.'}</p>
        </div>
        {months.length ? (
          <div>
            <p className="text-xs font-semibold text-slate-500">Mês</p>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-2 w-full md:w-[220px] text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {!season ? null : loading ? (
        <div className="mt-4 text-sm text-slate-600">Carregando…</div>
      ) : !summary || summary.criteriaCount === 0 ? (
        <p className="mt-4 text-sm text-slate-600">Nenhuma avaliação mensal encontrada para esta temporada.</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{monthLabel(summary.month)}</p>
              <p className="text-xs text-slate-500">
                {summary.criteriaCount} critérios{summary.position ? ` • posição ${summary.position}` : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Média</p>
              <p className="text-2xl font-extrabold text-slate-900">{summary.avg.toFixed(1)}</p>
            </div>
          </div>

          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-2 bg-primary" style={{ width: `${pct}%` }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">Média base</p>
              <p className="mt-1 font-semibold text-slate-900">{summary.baseAvg == null ? '—' : summary.baseAvg.toFixed(1)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">Média posição</p>
              <p className="mt-1 font-semibold text-slate-900">{summary.positionAvg == null ? '—' : summary.positionAvg.toFixed(1)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-900">Destaques</p>
              </div>
              <div className="divide-y divide-slate-100">
                {summary.top.map((it) => (
                  <div key={it.label} className="px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-900">{it.label}</p>
                    <span className="text-sm font-bold text-green-700">{it.value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-900">Pontos de atenção</p>
              </div>
              <div className="divide-y divide-slate-100">
                {summary.bottom.map((it) => (
                  <div key={it.label} className="px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-900">{it.label}</p>
                    <span className="text-sm font-bold text-amber-700">{it.value.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
