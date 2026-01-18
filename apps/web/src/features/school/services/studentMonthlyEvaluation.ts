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
  criteriaCount: number
  avg: number
  baseAvg: number | null
  positionAvg: number | null
  top: Array<{ label: string; value: number }>
  bottom: Array<{ label: string; value: number }>
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

function summarizeMonthly(events: EngineEventRow[], fallbackMonth: string, actorId: string | null) {
  const rows = events ?? []
  let month: string | null = null
  let position: string | null = null

  const values: number[] = []
  const baseValues: number[] = []
  const positionValues: number[] = []

  const items: Array<{ label: string; value: number }> = []

  rows.forEach((r) => {
    const meta = r.meta as { month?: unknown; position?: unknown; kind?: unknown; prompt?: unknown } | null
    const m = typeof meta?.month === 'string' ? meta.month : null
    if (m) month = month ?? m
    const p = typeof meta?.position === 'string' ? meta.position : null
    if (p) position = position ?? p
    const kind = typeof meta?.kind === 'string' ? meta.kind : null

    const v = toNumber(r.value)
    if (v == null) return

    values.push(v)
    if (kind === 'base') baseValues.push(v)
    if (kind === 'position') positionValues.push(v)

    const label = typeof meta?.prompt === 'string' ? meta.prompt : r.event_key || 'Rubrica'
    items.push({ label, value: v })
  })

  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
  const baseAvg = baseValues.length ? baseValues.reduce((a, b) => a + b, 0) / baseValues.length : null
  const posAvg = positionValues.length ? positionValues.reduce((a, b) => a + b, 0) / positionValues.length : null

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
    criteriaCount: values.length,
    avg,
    baseAvg,
    positionAvg: posAvg,
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

  return summarizeMonthly(rows, month, actorId)
}

