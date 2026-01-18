import { useEffect, useMemo, useState } from 'react'
import {
  getStudentMonthlyAverages,
  getStudentMonthlySummary,
  listStudentMonthlyMonths,
  monthLabel,
  type PillarKey,
  type MonthlyAveragePoint,
  type MonthlySummary,
  type SeasonRow,
} from '@/features/school/services/studentMonthlyEvaluation'

type Props = {
  studentId: string
  season: SeasonRow | null
}

export function StudentMonthlyEvaluationSection({ studentId, season }: Props) {
  const [months, setMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [trend, setTrend] = useState<MonthlyAveragePoint[]>([])
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
      const next = await getStudentMonthlyAverages(seasonId, studentId, 12)
      if (!mounted) return
      setTrend(next)
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

  const trendPoints = useMemo(() => {
    if (!trend.length) return null
    const w = 100
    const h = 24
    const pad = 2
    const xs = trend.map((_, idx) => (trend.length === 1 ? w / 2 : (idx / (trend.length - 1)) * (w - pad * 2) + pad))
    const ys = trend.map((p) => h - (Math.max(0, Math.min(10, p.avg)) / 10) * (h - pad * 2) - pad)
    const points = xs.map((x, i) => `${x.toFixed(2)},${ys[i].toFixed(2)}`).join(' ')
    const last = trend[trend.length - 1]?.avg ?? 0
    const prev = trend.length > 1 ? trend[trend.length - 2]?.avg ?? null : null
    const delta = prev == null ? null : last - prev
    return { points, last, prev, delta }
  }, [trend])

  const radar = useMemo(() => {
    if (!summary) return null
    const values = summary.pillars
    const keys: Array<{ key: PillarKey; label: string }> = [
      { key: 'tecnica', label: 'Técnica' },
      { key: 'tatica', label: 'Tática' },
      { key: 'mental', label: 'Mental' },
      { key: 'fisico', label: 'Físico' },
    ]

    const size = 140
    const cx = size / 2
    const cy = size / 2
    const r = 48
    const levels = [2.5, 5, 7.5, 10]

    const pointFor = (idx: number, value: number) => {
      const angle = (Math.PI * 2 * idx) / keys.length - Math.PI / 2
      const rr = (Math.max(0, Math.min(10, value)) / 10) * r
      return { x: cx + Math.cos(angle) * rr, y: cy + Math.sin(angle) * rr }
    }

    const axisFor = (idx: number) => {
      const angle = (Math.PI * 2 * idx) / keys.length - Math.PI / 2
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
    }

    const points = keys
      .map((k, idx) => {
        const v = values[k.key]
        return pointFor(idx, v == null ? 0 : v)
      })
      .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
      .join(' ')

    const gridPolys = levels.map((lvl) => {
      const pts = keys
        .map((_, idx) => pointFor(idx, lvl))
        .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(' ')
      return { lvl, pts }
    })

    const axes = keys.map((_, idx) => axisFor(idx))

    return { size, cx, cy, r, keys, points, gridPolys, axes }
  }, [summary])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Avaliação técnica mensal</h2>
          <p className="mt-1 text-sm text-slate-600">{header || 'Sem temporada ativa definida.'}</p>
        </div>
        {trendPoints ? (
          <div className="md:text-right">
            <p className="text-xs font-semibold text-slate-500">Evolução (últimos {trend.length} meses)</p>
            <div className="mt-2 flex items-center gap-3 md:justify-end">
              <svg viewBox="0 0 100 24" className="w-36 h-8">
                <polyline points={trendPoints.points} fill="none" stroke="currentColor" strokeWidth={2} className="text-primary" />
              </svg>
              <div className="text-right">
                <p className="text-xs text-slate-500">Última</p>
                <p className="text-sm font-bold text-slate-900">
                  {trendPoints.last.toFixed(1)}
                  {trendPoints.delta == null ? null : (
                    <span className={`ml-2 text-xs font-semibold ${trendPoints.delta >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {trendPoints.delta >= 0 ? '+' : ''}
                      {trendPoints.delta.toFixed(1)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : null}
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

          {radar ? (
            <div className="border border-slate-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-slate-900">Radar (pilares)</p>
              <p className="mt-1 text-xs text-slate-500">Estimado por heurística de palavras‑chave nas rubricas.</p>
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                <div className="flex justify-center">
                  <svg viewBox={`0 0 ${radar.size} ${radar.size}`} className="w-64 h-64 text-slate-200">
                    {radar.gridPolys.map((g) => (
                      <polygon key={g.lvl} points={g.pts} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.9} />
                    ))}
                    {radar.axes.map((a, idx) => (
                      <line key={idx} x1={radar.cx} y1={radar.cy} x2={a.x} y2={a.y} stroke="currentColor" strokeWidth={1} opacity={0.9} />
                    ))}
                    <polygon points={radar.points} fill="currentColor" className="text-primary/20" stroke="currentColor" strokeWidth={2} />
                  </svg>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {radar.keys.map((k) => (
                    <div key={k.key} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-xs text-slate-500">{k.label}</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{summary.pillars[k.key] == null ? '—' : summary.pillars[k.key]!.toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

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
