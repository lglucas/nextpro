import { supabase } from '@/lib/supabase'

export type SeasonRow = { id: string; year: number }

type EngineEventRow = {
  created_at: string
  actor_id: string | null
  event_key: string | null
  value: number | null
  meta: unknown
}

export type MonthlySummary = {
  month: string
  actorId: string | null
  position: string | null
  classId: string | null
  criteriaCount: number
  avg: number
  baseAvg: number | null
  positionAvg: number | null
  pillars: Record<PillarKey, number | null>
  top: Array<{ label: string; value: number }>
  bottom: Array<{ label: string; value: number }>
}

export type MonthlyAveragePoint = { month: string; avg: number }

export type PillarKey = 'tecnica' | 'tatica' | 'mental' | 'fisico'

export type MonthlyNormalizationRow = {
  avg_raw: number | null
  avg_norm: number | null
  pillars: Record<PillarKey, number | null>
}

export function monthLabel(month: string) {
  const [y, m] = month.split('-')
  const date = new Date(Number(y), Math.max(0, Number(m) - 1), 1)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function toNumber(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return null
  return n
}

function detectPillar(label: string): PillarKey {
  const text = label.toLowerCase()

  if (
    text.includes('mental') ||
    text.includes('emocional') ||
    text.includes('coragem') ||
    text.includes('confiança') ||
    text.includes('confianca') ||
    text.includes('maturidade') ||
    text.includes('competitiv') ||
    text.includes('liderança') ||
    text.includes('lideranca') ||
    text.includes('comunica') ||
    text.includes('profissional') ||
    text.includes('disciplina') ||
    text.includes('assiduidade') ||
    text.includes('pontual') ||
    text.includes('compromiss') ||
    text.includes('aprend') ||
    text.includes('constân') ||
    text.includes('constan') ||
    text.includes('regular') ||
    text.includes('calma')
  ) {
    return 'mental'
  }

  if (
    text.includes('veloc') ||
    text.includes('acelera') ||
    text.includes('força') ||
    text.includes('forca') ||
    text.includes('resist') ||
    text.includes('explos') ||
    text.includes('agilid')
  ) {
    return 'fisico'
  }

  if (
    text.includes('tática') ||
    text.includes('tatica') ||
    text.includes('posicion') ||
    text.includes('compact') ||
    text.includes('press') ||
    text.includes('transi') ||
    text.includes('linha') ||
    text.includes('cobertura') ||
    text.includes('balanço') ||
    text.includes('balanco') ||
    text.includes('organiza') ||
    text.includes('gatilho') ||
    text.includes('recompos') ||
    text.includes('marcação') ||
    text.includes('marcacao') ||
    text.includes('leitura') ||
    text.includes('gestão') ||
    text.includes('gestao') ||
    text.includes('ritmo')
  ) {
    return 'tatica'
  }

  return 'tecnica'
}

function toPillar(value: unknown): PillarKey | null {
  return value === 'tecnica' || value === 'tatica' || value === 'mental' || value === 'fisico' ? value : null
}

function summarizeMonthly(
  events: EngineEventRow[],
  fallbackMonth: string,
  actorId: string | null,
  pillarByKey?: Record<string, PillarKey | null>,
) {
  const rows = events ?? []
  let month: string | null = null
  let position: string | null = null
  let classId: string | null = null

  const values: number[] = []
  const baseValues: number[] = []
  const positionValues: number[] = []
  const byPillar: Record<PillarKey, number[]> = { tecnica: [], tatica: [], mental: [], fisico: [] }

  const items: Array<{ label: string; value: number }> = []

  rows.forEach((r) => {
    const meta = r.meta as { month?: unknown; position?: unknown; kind?: unknown; prompt?: unknown; class_id?: unknown; pillar?: unknown } | null
    const m = typeof meta?.month === 'string' ? meta.month : null
    if (m) month = month ?? m
    const p = typeof meta?.position === 'string' ? meta.position : null
    if (p) position = position ?? p
    const c = typeof meta?.class_id === 'string' ? meta.class_id : null
    if (c) classId = classId ?? c
    const kind = typeof meta?.kind === 'string' ? meta.kind : null

    const v = toNumber(r.value)
    if (v == null) return

    values.push(v)
    if (kind === 'base') baseValues.push(v)
    if (kind === 'position') positionValues.push(v)

    const label = typeof meta?.prompt === 'string' ? meta.prompt : r.event_key || 'Rubrica'
    items.push({ label, value: v })

    const metaPillar = toPillar(meta?.pillar)
    const keyPillar = r.event_key ? toPillar(pillarByKey?.[r.event_key] ?? null) : null
    byPillar[(metaPillar ?? keyPillar ?? detectPillar(label))].push(v)
  })

  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
  const baseAvg = baseValues.length ? baseValues.reduce((a, b) => a + b, 0) / baseValues.length : null
  const posAvg = positionValues.length ? positionValues.reduce((a, b) => a + b, 0) / positionValues.length : null
  const pillars: Record<PillarKey, number | null> = {
    tecnica: byPillar.tecnica.length ? byPillar.tecnica.reduce((a, b) => a + b, 0) / byPillar.tecnica.length : null,
    tatica: byPillar.tatica.length ? byPillar.tatica.reduce((a, b) => a + b, 0) / byPillar.tatica.length : null,
    mental: byPillar.mental.length ? byPillar.mental.reduce((a, b) => a + b, 0) / byPillar.mental.length : null,
    fisico: byPillar.fisico.length ? byPillar.fisico.reduce((a, b) => a + b, 0) / byPillar.fisico.length : null,
  }

  const dedup = new Map<string, number>()
  items.forEach((it) => {
    const key = it.label.trim()
    if (!key) return
    if (!dedup.has(key)) dedup.set(key, it.value)
  })

  const list = Array.from(dedup.entries()).map(([label, value]) => ({ label, value }))
  list.sort((a, b) => b.value - a.value)
  const top = list.slice(0, 5)
  const bottom = [...list].reverse().slice(0, 5)

  return {
    month: month ?? fallbackMonth,
    actorId,
    position,
    classId,
    criteriaCount: values.length,
    avg,
    baseAvg,
    positionAvg: posAvg,
    pillars,
    top,
    bottom,
  } satisfies MonthlySummary
}

export async function listStudentMonthlyMonths(seasonId: string, studentId: string) {
  const { data } = await supabase
    .from('engine_events')
    .select('created_at, meta')
    .eq('engine', 'technical')
    .eq('season_id', seasonId)
    .eq('student_id', studentId)
    .eq('source_type', 'technical_monthly')
    .order('created_at', { ascending: false })
    .limit(5000)

  const rows = (data as unknown as Array<{ meta: unknown }>) ?? []
  const out: string[] = []
  const seen = new Set<string>()

  rows.forEach((r) => {
    const meta = r.meta as { month?: unknown } | null
    const m = typeof meta?.month === 'string' ? meta.month : null
    if (!m) return
    if (seen.has(m)) return
    seen.add(m)
    out.push(m)
  })

  return out
}

export async function getStudentMonthlyAverages(seasonId: string, studentId: string, limitMonths = 12) {
  const { data } = await supabase
    .from('engine_events')
    .select('value, meta')
    .eq('engine', 'technical')
    .eq('season_id', seasonId)
    .eq('student_id', studentId)
    .eq('source_type', 'technical_monthly')
    .order('created_at', { ascending: false })
    .limit(5000)

  const rows = (data as unknown as Array<{ value: unknown; meta: unknown }>) ?? []
  const byMonth = new Map<string, number[]>()

  rows.forEach((r) => {
    const meta = r.meta as { month?: unknown } | null
    const month = typeof meta?.month === 'string' ? meta.month : null
    if (!month) return
    const v = toNumber(r.value)
    if (v == null) return
    const list = byMonth.get(month) ?? []
    list.push(v)
    byMonth.set(month, list)
  })

  const months = Array.from(byMonth.keys())
  months.sort((a, b) => a.localeCompare(b))

  const points: MonthlyAveragePoint[] = months.map((m) => {
    const values = byMonth.get(m) ?? []
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
    return { month: m, avg }
  })

  return points.slice(Math.max(0, points.length - Math.max(1, limitMonths)))
}

export async function getStudentMonthlySummary(seasonId: string, studentId: string, month: string) {
  const { data: lastRow } = await supabase
    .from('engine_events')
    .select('created_at, actor_id, meta')
    .eq('engine', 'technical')
    .eq('season_id', seasonId)
    .eq('student_id', studentId)
    .eq('source_type', 'technical_monthly')
    .eq('meta->>month', month)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const actorId = (lastRow as unknown as EngineEventRow | null)?.actor_id ?? null

  const query = supabase
    .from('engine_events')
    .select('created_at, actor_id, event_key, value, meta')
    .eq('engine', 'technical')
    .eq('season_id', seasonId)
    .eq('student_id', studentId)
    .eq('source_type', 'technical_monthly')
    .eq('meta->>month', month)
    .limit(5000)

  const { data: monthRows } = actorId ? await query.eq('actor_id', actorId) : await query
  const rows = (monthRows as unknown as EngineEventRow[]) ?? []

  const keys = Array.from(new Set(rows.map((r) => r.event_key).filter((k): k is string => Boolean(k))))
  const pillarByKey: Record<string, PillarKey | null> = {}
  if (keys.length) {
    const { data: questionRows } = await supabase.from('technical_monthly_questions').select('key, pillar').eq('season_id', seasonId).in('key', keys)
    ;((questionRows as unknown as Array<{ key: string; pillar: unknown }>) ?? []).forEach((q) => {
      pillarByKey[q.key] = toPillar(q.pillar)
    })
  }

  return summarizeMonthly(rows, month, actorId, pillarByKey)
}

export async function getStudentMonthlyNormalization(seasonId: string, classId: string, month: string, studentId: string) {
  const { data } = await supabase.rpc('compute_technical_monthly_class_normalization', {
    target_season_id: seasonId,
    target_class_id: classId,
    target_month: month,
  })

  const rows =
    (data as unknown as Array<{
      student_id: string
      avg_raw: number | null
      avg_norm: number | null
      pillars: unknown
    }>) ?? []

  const found = rows.find((r) => r.student_id === studentId)
  if (!found) return null

  const p = (found.pillars as Record<string, unknown> | null) ?? null
  const pillars: Record<PillarKey, number | null> = {
    tecnica: toNumber(p?.tecnica) ?? null,
    tatica: toNumber(p?.tatica) ?? null,
    mental: toNumber(p?.mental) ?? null,
    fisico: toNumber(p?.fisico) ?? null,
  }

  return {
    avg_raw: found.avg_raw == null ? null : Number(found.avg_raw),
    avg_norm: found.avg_norm == null ? null : Number(found.avg_norm),
    pillars,
  } satisfies MonthlyNormalizationRow
}
