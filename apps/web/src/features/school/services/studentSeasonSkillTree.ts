import { supabase } from '@/lib/supabase'

export type PillarKey = 'tecnica' | 'tatica' | 'mental' | 'fisico'

export type SeasonSkillTree = {
  seasonId: string
  positions: string[]
  defaultPosition: string | null
  overall: Record<PillarKey, number | null>
  byPosition: Record<string, Record<PillarKey, number | null>>
}

type EngineEventRow = {
  created_at: string
  source_type: string
  event_key: string | null
  value: number | null
  meta: unknown
}

function toPillar(value: unknown): PillarKey | null {
  return value === 'tecnica' || value === 'tatica' || value === 'mental' || value === 'fisico' ? value : null
}

function avg(values: number[]) {
  if (!values.length) return null
  return values.reduce((a, b) => a + b, 0) / values.length
}

export async function getStudentSeasonSkillTree(seasonId: string, studentId: string): Promise<SeasonSkillTree> {
  const { data } = await supabase
    .from('engine_events')
    .select('created_at, source_type, event_key, value, meta')
    .eq('engine', 'technical')
    .eq('season_id', seasonId)
    .eq('student_id', studentId)
    .in('source_type', ['technical_daily', 'technical_monthly'])
    .order('created_at', { ascending: false })
    .limit(5000)

  const rows = (data as unknown as EngineEventRow[]) ?? []
  const keys = Array.from(new Set(rows.map((r) => r.event_key).filter((k): k is string => Boolean(k))))

  const pillarByKey: Record<string, PillarKey | null> = {}
  if (keys.length) {
    const [{ data: dailyQ }, { data: monthlyQ }] = await Promise.all([
      supabase.from('technical_questions').select('key, pillar').eq('season_id', seasonId).in('key', keys),
      supabase.from('technical_monthly_questions').select('key, pillar').eq('season_id', seasonId).in('key', keys),
    ])

    ;((dailyQ as unknown as Array<{ key: string; pillar: unknown }>) ?? []).forEach((q) => {
      pillarByKey[q.key] = toPillar(q.pillar)
    })
    ;((monthlyQ as unknown as Array<{ key: string; pillar: unknown }>) ?? []).forEach((q) => {
      pillarByKey[q.key] = toPillar(q.pillar)
    })
  }

  const posCount = new Map<string, number>()
  const overallByPillar: Record<PillarKey, number[]> = { tecnica: [], tatica: [], mental: [], fisico: [] }
  const byPosition: Record<string, Record<PillarKey, number[]>> = {}

  rows.forEach((r) => {
    const v = r.value == null ? null : Number(r.value)
    if (v == null || Number.isNaN(v)) return

    const meta = r.meta as { pillar?: unknown; position?: unknown } | null
    const pos = typeof meta?.position === 'string' ? meta.position : null
    const p = toPillar(meta?.pillar) ?? (r.event_key ? toPillar(pillarByKey[r.event_key]) : null) ?? 'tecnica'

    overallByPillar[p].push(v)

    if (pos) {
      posCount.set(pos, (posCount.get(pos) ?? 0) + 1)
      byPosition[pos] = byPosition[pos] ?? { tecnica: [], tatica: [], mental: [], fisico: [] }
      byPosition[pos][p].push(v)
    }
  })

  const positions = Array.from(posCount.keys()).sort((a, b) => (posCount.get(b) ?? 0) - (posCount.get(a) ?? 0))
  const defaultPosition = positions[0] ?? null

  const overall: Record<PillarKey, number | null> = {
    tecnica: avg(overallByPillar.tecnica),
    tatica: avg(overallByPillar.tatica),
    mental: avg(overallByPillar.mental),
    fisico: avg(overallByPillar.fisico),
  }

  const computedByPosition: Record<string, Record<PillarKey, number | null>> = {}
  positions.forEach((pos) => {
    const src = byPosition[pos] ?? { tecnica: [], tatica: [], mental: [], fisico: [] }
    computedByPosition[pos] = {
      tecnica: avg(src.tecnica),
      tatica: avg(src.tatica),
      mental: avg(src.mental),
      fisico: avg(src.fisico),
    }
  })

  return { seasonId, positions, defaultPosition, overall, byPosition: computedByPosition }
}

