import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Trophy } from 'lucide-react'

type StudentRow = { id: string; full_name: string }
type SeasonRow = { id: string; year: number }

type EngineEventRow = {
  id: string
  created_at: string
  event_key: string | null
  value: number | null
  meta: unknown
}

type SessionRow = { id: string; date: string; topic: string | null }

function getLabelFromValue(value: number | null) {
  if (value == null) return '—'
  if (value < 4) return 'Atenção'
  if (value < 7) return 'Em evolução'
  return 'Destaque'
}

export function TechnicalHistoryPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [season, setSeason] = useState<SeasonRow | null>(null)
  const [events, setEvents] = useState<EngineEventRow[]>([])
  const [sessionsById, setSessionsById] = useState<Record<string, SessionRow>>({})
  const [loading, setLoading] = useState(true)

  const fetchStudents = useCallback(async () => {
    if (!user?.id) return
    const { data, error } = await supabase.from('students').select('id, full_name').eq('user_id', user.id).order('full_name')
    if (error) {
      setStudents([])
      return
    }
    const list = (data || []) as unknown as StudentRow[]
    setStudents(list)
    if (!selectedStudentId && list[0]?.id) setSelectedStudentId(list[0].id)
  }, [selectedStudentId, user])

  const fetchSeason = useCallback(async () => {
    const { data, error } = await supabase.from('seasons').select('id, year').eq('is_active', true).maybeSingle()
    if (error) {
      setSeason(null)
      return
    }
    setSeason((data as unknown as SeasonRow) ?? null)
  }, [])

  const fetchEvents = useCallback(async () => {
    if (!selectedStudentId) return
    if (!season?.id) return

    setLoading(true)
    const { data, error } = await supabase
      .from('engine_events')
      .select('id, created_at, event_key, value, meta')
      .eq('engine', 'technical')
      .eq('season_id', season.id)
      .eq('student_id', selectedStudentId)
      .eq('source_type', 'technical_daily')
      .order('created_at', { ascending: false })
      .limit(60)

    if (error) {
      setEvents([])
      setSessionsById({})
      setLoading(false)
      return
    }

    const list = (data || []) as unknown as EngineEventRow[]
    setEvents(list)

    const sessionIds = Array.from(
      new Set(
        list
          .map((e) => (e.meta as { session_id?: unknown } | null)?.session_id)
          .filter((v): v is string => typeof v === 'string' && v.length > 0),
      ),
    )

    if (!sessionIds.length) {
      setSessionsById({})
      setLoading(false)
      return
    }

    const { data: sessionsData, error: sessionsError } = await supabase.from('class_sessions').select('id, date, topic').in('id', sessionIds)
    if (sessionsError) {
      setSessionsById({})
      setLoading(false)
      return
    }

    const next: Record<string, SessionRow> = {}
    ;((sessionsData || []) as unknown as SessionRow[]).forEach((s) => {
      next[s.id] = s
    })
    setSessionsById(next)
    setLoading(false)
  }, [season, selectedStudentId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchStudents(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchStudents])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchSeason(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSeason])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchEvents(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchEvents])

  const grouped = useMemo(() => {
    const map = new Map<string, EngineEventRow[]>()
    events.forEach((e) => {
      const sessionId = (e.meta as { session_id?: unknown } | null)?.session_id
      const key = typeof sessionId === 'string' && sessionId ? sessionId : e.created_at.slice(0, 10)
      const list = map.get(key) ?? []
      list.push(e)
      map.set(key, list)
    })
    return Array.from(map.entries()).map(([key, list]) => ({
      key,
      items: list,
    }))
  }, [events])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Histórico técnico</h1>
            <p className="mt-1 text-slate-600 text-sm">Resumo por treino, com foco em conceitos.</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500">Atleta</p>
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} className="mt-2 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Temporada</p>
            <div className="mt-2 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-700 min-w-[140px]">
              {season ? season.year : '—'}
            </div>
          </div>
        </div>
      </div>

      {loading ? <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">Carregando...</div> : null}

      {!loading && !events.length ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-slate-900">Nenhum registro ainda.</p>
          <p className="mt-2 text-sm text-slate-600">Quando o professor fizer o pós‑treino, você verá o resumo aqui.</p>
        </div>
      ) : null}

      {!loading && events.length ? (
        <div className="space-y-4">
          {grouped.map((group) => {
            const session = sessionsById[group.key] ?? null
            const title = session ? `${new Date(session.date).toLocaleDateString('pt-BR')} • ${session.topic || 'Treino'}` : group.key
            return (
              <div key={group.key} className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{group.items.length} itens</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {group.items.slice(0, 6).map((e) => {
                    const meta = e.meta as { prompt?: unknown; group?: unknown } | null
                    const prompt = typeof meta?.prompt === 'string' ? meta.prompt : e.event_key || 'Pergunta'
                    const tag = getLabelFromValue(e.value)
                    const groupLabel = meta?.group === 'best' ? 'Destaque' : meta?.group === 'worst' ? 'Atenção' : 'Treino'
                    return (
                      <div key={e.id} className="p-3 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-900 line-clamp-2">{prompt}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {groupLabel} • {tag}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
