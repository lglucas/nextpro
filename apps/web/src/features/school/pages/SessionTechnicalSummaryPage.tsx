import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, ClipboardList } from 'lucide-react'

type SeasonRow = { id: string; year: number }
type StudentRow = { id: string; full_name: string }
type ClassRow = { id: string; name: string }
type SessionRow = { id: string; date: string; topic: string | null; start_time: string; end_time: string }

type EngineEventRow = {
  id: string
  created_at: string
  student_id: string
  actor_id: string | null
  event_key: string | null
  value: number | null
  meta: unknown
  source_id: string
}

type SlotSummary = { prompt: string; value: number | null; slot: 1 | 2 | 3 }
type StudentSummary = { studentId: string; studentName: string; group: 'best' | 'worst'; slots: SlotSummary[] }

function labelFromValue(value: number | null) {
  if (value == null) return '—'
  if (value < 4) return 'Atenção'
  if (value < 7) return 'Em evolução'
  return 'Destaque'
}

export function SessionTechnicalSummaryPage() {
  const navigate = useNavigate()
  const { id: classId, sessionId } = useParams()
  const { role } = useAuth()

  const canAccess = role === 'coach' || role === 'school_admin' || role === 'super_admin'

  const [loading, setLoading] = useState(true)
  const [season, setSeason] = useState<SeasonRow | null>(null)
  const [classRow, setClassRow] = useState<ClassRow | null>(null)
  const [session, setSession] = useState<SessionRow | null>(null)
  const [studentsById, setStudentsById] = useState<Record<string, StudentRow>>({})
  const [events, setEvents] = useState<EngineEventRow[]>([])

  const fetchSeason = useCallback(async () => {
    const { data, error } = await supabase.from('seasons').select('id, year').eq('is_active', true).maybeSingle()
    if (error) {
      alert(error.message)
      setSeason(null)
      return
    }
    setSeason((data as unknown as SeasonRow) ?? null)
  }, [])

  const fetchContext = useCallback(async () => {
    if (!classId || !sessionId) return
    setLoading(true)
    const [{ data: classData, error: classError }, { data: sessionData, error: sessionError }] = await Promise.all([
      supabase.from('classes').select('id, name').eq('id', classId).maybeSingle(),
      supabase.from('class_sessions').select('id, date, topic, start_time, end_time').eq('id', sessionId).maybeSingle(),
    ])

    if (classError) alert(classError.message)
    if (sessionError) alert(sessionError.message)

    setClassRow((classData as unknown as ClassRow) ?? null)
    setSession((sessionData as unknown as SessionRow) ?? null)
    setLoading(false)
  }, [classId, sessionId])

  const fetchEvents = useCallback(async () => {
    if (!season?.id) return
    if (!sessionId) return

    const { data, error } = await supabase
      .from('engine_events')
      .select('id, created_at, student_id, actor_id, event_key, value, meta, source_id')
      .eq('engine', 'technical')
      .eq('season_id', season.id)
      .eq('source_type', 'technical_daily')
      .like('source_id', `${sessionId}:%`)
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      alert(error.message)
      setEvents([])
      setStudentsById({})
      return
    }

    const list = (data || []) as unknown as EngineEventRow[]
    setEvents(list)

    const studentIds = Array.from(new Set(list.map((e) => e.student_id)))
    if (!studentIds.length) {
      setStudentsById({})
      return
    }

    const { data: studentsData, error: studentsError } = await supabase.from('students').select('id, full_name').in('id', studentIds)
    if (studentsError) {
      alert(studentsError.message)
      setStudentsById({})
      return
    }

    const map: Record<string, StudentRow> = {}
    ;((studentsData || []) as unknown as StudentRow[]).forEach((s) => {
      map[s.id] = s
    })
    setStudentsById(map)
  }, [season, sessionId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSeason()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSeason])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchContext()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchContext])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchEvents()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchEvents])

  const summaries = useMemo(() => {
    const byKey = new Map<string, EngineEventRow>()
    events.forEach((e) => {
      const meta = e.meta as { group?: unknown; slot?: unknown } | null
      const group = meta?.group === 'best' || meta?.group === 'worst' ? meta.group : null
      const slot = meta?.slot === 1 || meta?.slot === 2 || meta?.slot === 3 ? meta.slot : null
      if (!group || !slot) return
      const key = `${e.student_id}:${group}:${slot}`
      if (!byKey.has(key)) byKey.set(key, e)
    })

    const out: StudentSummary[] = []
    for (const e of byKey.values()) {
      const meta = e.meta as { group?: unknown; slot?: unknown; prompt?: unknown } | null
      const group = meta?.group === 'best' || meta?.group === 'worst' ? meta.group : null
      const slot = meta?.slot === 1 || meta?.slot === 2 || meta?.slot === 3 ? meta.slot : null
      if (!group || !slot) continue
      const prompt = typeof meta?.prompt === 'string' ? meta.prompt : e.event_key || 'Pergunta'
      const studentName = studentsById[e.student_id]?.full_name || 'Aluno'

      const existing = out.find((x) => x.studentId === e.student_id && x.group === group) || null
      if (!existing) {
        out.push({
          studentId: e.student_id,
          studentName,
          group,
          slots: [{ prompt, value: e.value, slot }],
        })
      } else {
        existing.slots.push({ prompt, value: e.value, slot })
      }
    }

    out.forEach((s) => {
      s.slots.sort((a, b) => a.slot - b.slot)
    })

    out.sort((a, b) => a.studentName.localeCompare(b.studentName))
    return out
  }, [events, studentsById])

  const worst = useMemo(() => summaries.filter((s) => s.group === 'worst'), [summaries])
  const best = useMemo(() => summaries.filter((s) => s.group === 'best'), [summaries])

  if (!canAccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-600">Acesso restrito ao professor/gestor.</p>
        </div>
      </div>
    )
  }

  const titleDate = session ? new Date(session.date).toLocaleDateString('pt-BR') : 'Sessão'
  const titleTopic = session?.topic || 'Treino'

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Resumo técnico do treino</h1>
          <p className="mt-1 text-sm text-slate-600">
            {classRow?.name ? `${classRow.name} • ` : ''}
            {titleDate} • {titleTopic}
            {season ? ` • Temporada ${season.year}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!classId || !sessionId) return
            navigate(`/dashboard/classes/${classId}/sessions/${sessionId}/post-treino`)
          }}
          className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          Abrir pós‑treino
        </button>
      </div>

      {loading ? <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">Carregando...</div> : null}

      {!season ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-slate-900">Nenhuma temporada ativa encontrada.</p>
          <p className="mt-2 text-sm text-slate-600">Defina uma temporada ativa no Cantinho do CTO → Engines → Temporadas.</p>
        </div>
      ) : null}

      {season && !events.length ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-slate-900">Sem avaliações técnicas para esta sessão.</p>
          <p className="mt-2 text-sm text-slate-600">Use o botão “Abrir pós‑treino” para registrar 3 piores e 3 melhores.</p>
        </div>
      ) : null}

      {season && events.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">3 piores</p>
              <p className="text-sm text-slate-600">Pontos de atenção do treino.</p>
            </div>
            {worst.length === 0 ? <p className="text-sm text-slate-500">Nenhum registro.</p> : null}
            <div className="space-y-3">
              {worst.map((s) => (
                <div key={`${s.group}:${s.studentId}`} className="p-4 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{s.studentName}</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {s.slots.map((slot) => (
                      <div key={slot.slot} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                        <p className="text-xs font-semibold text-slate-500">Slot {slot.slot}</p>
                        <p className="mt-1 text-sm text-slate-900 line-clamp-2">{slot.prompt}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {labelFromValue(slot.value)}
                          {slot.value != null ? ` • ${Number(slot.value).toFixed(1)}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">3 melhores</p>
              <p className="text-sm text-slate-600">Destaques do treino.</p>
            </div>
            {best.length === 0 ? <p className="text-sm text-slate-500">Nenhum registro.</p> : null}
            <div className="space-y-3">
              {best.map((s) => (
                <div key={`${s.group}:${s.studentId}`} className="p-4 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{s.studentName}</p>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {s.slots.map((slot) => (
                      <div key={slot.slot} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                        <p className="text-xs font-semibold text-slate-500">Slot {slot.slot}</p>
                        <p className="mt-1 text-sm text-slate-900 line-clamp-2">{slot.prompt}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {labelFromValue(slot.value)}
                          {slot.value != null ? ` • ${Number(slot.value).toFixed(1)}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

