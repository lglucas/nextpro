import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, Save } from 'lucide-react'

type SeasonRow = { id: string; year: number }
type ClassRow = { id: string; name: string }
type StudentRow = { id: string; full_name: string; active: boolean | null }

type MonthlyQuestionRow = {
  id: string
  kind: 'base' | 'position'
  position: string | null
  key: string
  prompt: string
  active: boolean
  sort_order: number
}

type DraftAnswer = {
  position: string
  values: Record<string, number | null>
}

const POSITIONS = [
  { key: 'goleiro', label: 'Goleiro' },
  { key: 'zagueiro', label: 'Zagueiro' },
  { key: 'lateral', label: 'Lateral' },
  { key: 'volante', label: 'Volante' },
  { key: 'meia', label: 'Meia' },
  { key: 'ponta', label: 'Ponta' },
  { key: 'atacante', label: 'Atacante' },
]

function clampScore(value: number) {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(10, value))
}

function monthIso(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function ClassMonthlyEvaluationPage() {
  const navigate = useNavigate()
  const { id: classId } = useParams()
  const { role, user } = useAuth()

  const canAccess = role === 'coach' || role === 'school_admin' || role === 'super_admin'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [season, setSeason] = useState<SeasonRow | null>(null)
  const [classRow, setClassRow] = useState<ClassRow | null>(null)
  const [students, setStudents] = useState<StudentRow[]>([])
  const [questions, setQuestions] = useState<MonthlyQuestionRow[]>([])
  const [month, setMonth] = useState<string>(monthIso())
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [drafts, setDrafts] = useState<Record<string, DraftAnswer>>({})

  const baseQuestions = useMemo(() => questions.filter((q) => q.active && q.kind === 'base'), [questions])
  const positionQuestions = useMemo(() => questions.filter((q) => q.active && q.kind === 'position'), [questions])

  const fetchSeason = useCallback(async () => {
    const { data, error } = await supabase.from('seasons').select('id, year').eq('is_active', true).maybeSingle()
    if (error) {
      alert(error.message)
      setSeason(null)
      return
    }
    setSeason((data as unknown as SeasonRow) ?? null)
  }, [])

  const fetchClass = useCallback(async () => {
    if (!classId) return
    const { data, error } = await supabase.from('classes').select('id, name').eq('id', classId).maybeSingle()
    if (error) {
      alert(error.message)
      setClassRow(null)
      return
    }
    setClassRow((data as unknown as ClassRow) ?? null)
  }, [classId])

  const fetchStudents = useCallback(async () => {
    if (!classId) return
    const { data, error } = await supabase
      .from('class_students')
      .select('student:students(id, full_name, active)')
      .eq('class_id', classId)
      .order('student(full_name)')

    if (error) {
      alert(error.message)
      setStudents([])
      return
    }

    const list = (data as unknown as Array<{ student: StudentRow | null }>)
      .map((d) => d.student)
      .filter((s): s is StudentRow => Boolean(s))
      .sort((a, b) => a.full_name.localeCompare(b.full_name))

    setStudents(list)
    if (!selectedStudentId && list[0]?.id) setSelectedStudentId(list[0].id)
  }, [classId, selectedStudentId])

  const fetchQuestions = useCallback(async () => {
    if (!season?.id) return
    const { data, error } = await supabase
      .from('technical_monthly_questions')
      .select('id, kind, position, key, prompt, active, sort_order')
      .eq('season_id', season.id)
      .order('kind', { ascending: true })
      .order('sort_order', { ascending: true })

    if (error) {
      alert(error.message)
      setQuestions([])
      return
    }
    setQuestions((data as unknown as MonthlyQuestionRow[]) ?? [])
  }, [season])

  const ensureDraft = useCallback(
    (studentId: string) => {
      setDrafts((prev) => {
        if (prev[studentId]) return prev
        const values: Record<string, number | null> = {}
        baseQuestions.forEach((q) => {
          values[q.key] = null
        })
        return {
          ...prev,
          [studentId]: {
            position: 'atacante',
            values,
          },
        }
      })
    },
    [baseQuestions],
  )

  const loadExisting = useCallback(async () => {
    if (!season?.id) return
    if (!classId) return
    if (!user?.id) return
    if (!month) return

    const { data, error } = await supabase
      .from('engine_events')
      .select('student_id, event_key, value, meta, source_id')
      .eq('engine', 'technical')
      .eq('season_id', season.id)
      .eq('source_type', 'technical_monthly')
      .eq('actor_id', user.id)
      .like('source_id', `${month}:%`)
      .limit(5000)

    if (error) return

    const rows = (data || []) as unknown as Array<{
      student_id: string
      event_key: string | null
      value: number | null
      meta: unknown
    }>

    setDrafts((prev) => {
      const next = { ...prev }
      rows.forEach((r) => {
        if (!r.student_id) return
        const key = r.event_key
        if (!key) return
        const meta = r.meta as { position?: unknown } | null
        const pos = typeof meta?.position === 'string' ? meta.position : null
        const existingDraft = next[r.student_id] ?? { position: pos || 'atacante', values: {} }
        existingDraft.values = { ...existingDraft.values, [key]: r.value == null ? null : Number(r.value) }
        if (pos) existingDraft.position = pos
        next[r.student_id] = existingDraft
      })
      return next
    })
  }, [classId, month, season, user])

  useEffect(() => {
    if (!canAccess) return
    const timeoutId = window.setTimeout(() => {
      void fetchSeason()
      void fetchClass()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [canAccess, fetchClass, fetchSeason])

  useEffect(() => {
    if (!canAccess) return
    const timeoutId = window.setTimeout(() => {
      void fetchStudents()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [canAccess, fetchStudents])

  useEffect(() => {
    if (!canAccess) return
    const timeoutId = window.setTimeout(() => {
      void fetchQuestions()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [canAccess, fetchQuestions])

  useEffect(() => {
    if (!canAccess) return
    const timeoutId = window.setTimeout(() => {
      setLoading(true)
      students.forEach((s) => ensureDraft(s.id))
      void loadExisting().finally(() => setLoading(false))
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [canAccess, ensureDraft, loadExisting, month, students])

  const currentDraft = selectedStudentId ? drafts[selectedStudentId] : null

  const currentPositionQuestions = useMemo(() => {
    if (!currentDraft) return []
    return positionQuestions.filter((q) => q.position === currentDraft.position)
  }, [currentDraft, positionQuestions])

  const updatePosition = (studentId: string, position: string) => {
    setDrafts((prev) => {
      const existing = prev[studentId] ?? { position: 'atacante', values: {} }
      return {
        ...prev,
        [studentId]: { ...existing, position },
      }
    })
  }

  const updateValue = (studentId: string, key: string, value: number | null) => {
    setDrafts((prev) => {
      const existing = prev[studentId] ?? { position: 'atacante', values: {} }
      return {
        ...prev,
        [studentId]: { ...existing, values: { ...existing.values, [key]: value } },
      }
    })
  }

  const saveStudent = async (studentId: string) => {
    if (!user?.id) return
    if (!season?.id) {
      alert('Nenhuma temporada ativa encontrada.')
      return
    }
    if (!classId) return
    if (!month) return
    const student = students.find((s) => s.id === studentId)
    if (!student) return
    const draft = drafts[studentId]
    if (!draft) return

    const missingBase = baseQuestions.filter((q) => draft.values[q.key] == null)
    if (missingBase.length > 0) {
      alert('Preencha todas as perguntas base com notas 0–10.')
      return
    }

    const posQs = positionQuestions.filter((q) => q.position === draft.position)
    const missingPos = posQs.filter((q) => draft.values[q.key] == null)
    if (missingPos.length > 0) {
      alert('Preencha todas as perguntas da posição com notas 0–10.')
      return
    }

    const baseByKey = new Map(baseQuestions.map((q) => [q.key, q.prompt]))
    const posByKey = new Map(positionQuestions.map((q) => [q.key, q.prompt]))

    const payload = [...baseQuestions, ...posQs].map((q) => ({
      engine: 'technical',
      season_id: season.id,
      student_id: studentId,
      actor_id: user.id,
      source_type: 'technical_monthly',
      source_id: `${month}:${user.id}:${q.key}`,
      event_key: q.key,
      value: clampScore(Number(draft.values[q.key] ?? 0)),
      meta: {
        class_id: classId,
        month,
        kind: q.kind,
        position: draft.position,
        prompt: q.kind === 'base' ? baseByKey.get(q.key) ?? null : posByKey.get(q.key) ?? null,
      },
    }))

    setSaving(true)
    const { error } = await supabase.from('engine_events').upsert(payload, { onConflict: 'engine,season_id,student_id,source_type,source_id' })
    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }
  }

  if (!canAccess) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-600">Acesso restrito ao professor/gestor.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Avaliação técnica mensal</h1>
          <p className="mt-1 text-sm text-slate-600">
            {classRow?.name ? `${classRow.name} • ` : ''}
            {season ? `Temporada ${season.year}` : 'Sem temporada ativa'}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500">Aluno</p>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="mt-2 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
                {s.active === false ? ' (inativo)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">Mês</p>
          <input value={month} onChange={(e) => setMonth(e.target.value)} type="month" className="mt-2 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white" />
        </div>
      </div>

      {!season ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-slate-900">Nenhuma temporada ativa encontrada.</p>
          <p className="mt-2 text-sm text-slate-600">Defina uma temporada ativa no Cantinho do CTO → Engines → Temporadas.</p>
        </div>
      ) : null}

      {season && questions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm font-semibold text-slate-900">Rubricas mensais não cadastradas.</p>
          <p className="mt-2 text-sm text-slate-600">Cadastre perguntas em `technical_monthly_questions` para a temporada ativa.</p>
        </div>
      ) : null}

      {loading ? <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">Carregando...</div> : null}

      {season && questions.length > 0 && currentDraft ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Avaliação</p>
              <p className="text-sm text-slate-600">Preencha 0–10 para todas as rubricas.</p>
            </div>
            <button
              type="button"
              onClick={() => saveStudent(selectedStudentId)}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">Posição do atleta no mês</p>
              <select
                value={currentDraft.position}
                onChange={(e) => updatePosition(selectedStudentId, e.target.value)}
                className="mt-2 w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
              >
                {POSITIONS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">Perguntas base</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {baseQuestions.map((q) => (
                <div key={q.key} className="p-4 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-900">{q.prompt}</p>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    value={currentDraft.values[q.key] ?? ''}
                    onChange={(e) => updateValue(selectedStudentId, q.key, e.target.value === '' ? null : clampScore(parseFloat(e.target.value)))}
                    className="mt-2 w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                    placeholder="Nota (0–10)"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-900">Perguntas da posição</p>
            {currentPositionQuestions.length === 0 ? (
              <p className="text-sm text-slate-600">Sem perguntas cadastradas para esta posição.</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {currentPositionQuestions.map((q) => (
                  <div key={q.key} className="p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-900">{q.prompt}</p>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.1}
                      value={currentDraft.values[q.key] ?? ''}
                      onChange={(e) => updateValue(selectedStudentId, q.key, e.target.value === '' ? null : clampScore(parseFloat(e.target.value)))}
                      className="mt-2 w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                      placeholder="Nota (0–10)"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
