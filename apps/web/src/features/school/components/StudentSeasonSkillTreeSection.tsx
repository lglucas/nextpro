import { useEffect, useMemo, useState } from 'react'
import { getStudentSeasonSkillTree, type PillarKey, type SeasonSkillTree } from '@/features/school/services/studentSeasonSkillTree'

type SeasonRow = { id: string; year: number }

const POSITIONS = [
  { key: 'goleiro', label: 'Goleiro' },
  { key: 'zagueiro', label: 'Zagueiro' },
  { key: 'lateral', label: 'Lateral' },
  { key: 'volante', label: 'Volante' },
  { key: 'meia', label: 'Meia' },
  { key: 'ponta', label: 'Ponta' },
  { key: 'atacante', label: 'Atacante' },
]

type Props = {
  studentId: string
  season: SeasonRow | null
}

export function StudentSeasonSkillTreeSection({ studentId, season }: Props) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SeasonSkillTree | null>(null)
  const [position, setPosition] = useState<string>('')

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!season?.id) {
        setData(null)
        setPosition('')
        return
      }
      if (!studentId) return
      setLoading(true)
      const next = await getStudentSeasonSkillTree(season.id, studentId)
      if (!mounted) return
      setData(next)
      setPosition((prev) => (prev ? prev : next.defaultPosition || ''))
      setLoading(false)
    }
    void run()
    return () => {
      mounted = false
    }
  }, [season?.id, studentId])

  const values = useMemo(() => {
    if (!data) return null
    if (position && data.byPosition[position]) return data.byPosition[position]
    return data.overall
  }, [data, position])

  const radar = useMemo(() => {
    if (!values) return null
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
      .map((k, idx) => pointFor(idx, values[k.key] == null ? 0 : values[k.key]!))
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

    return { size, cx, cy, keys, points, gridPolys, axes }
  }, [values])

  const positionLabel = useMemo(() => {
    if (!position) return 'Geral'
    return POSITIONS.find((p) => p.key === position)?.label || position
  }, [position])

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Skill tree (temporada)</h2>
          <p className="mt-1 text-sm text-slate-600">{season ? `Temporada ${season.year}` : 'Sem temporada ativa definida.'}</p>
        </div>
        {data?.positions.length ? (
          <div>
            <p className="text-xs font-semibold text-slate-500">Posição</p>
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="mt-2 w-full md:w-[220px] text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
              <option value="">{positionLabel}</option>
              {data.positions.map((p) => (
                <option key={p} value={p}>
                  {POSITIONS.find((x) => x.key === p)?.label || p}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {!season ? null : loading ? (
        <div className="mt-4 text-sm text-slate-600">Carregando…</div>
      ) : !data || !radar ? (
        <p className="mt-4 text-sm text-slate-600">Sem dados técnicos suficientes na temporada.</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
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
                <p className="mt-1 text-sm font-bold text-slate-900">{values?.[k.key] == null ? '—' : values[k.key]!.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
