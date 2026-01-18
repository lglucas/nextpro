import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react'

type ClassSessionRow = {
  id: string
  date: string
  start_time: string
  end_time: string
  topic: string | null
}

type StudentRow = {
  id: string
  full_name: string
}

type SeasonRow = {
  id: string
  year: number
}

type TechnicalQuestionRow = {
  id: string
  kind: 'base' | 'position'
  slot: 1 | 2 | 3
  position: string | null
  key: string
  prompt: string
  active: boolean
  sort_order: number
}

type DraftAnswer = {
  position: string
  q1Key: string
  q1Score: number | null
  q2Key: string
  q2Score: number | null
  q3Key: string
  q3Score: number | null
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

export function PostTrainingEvaluationPage() {
  const navigate = useNavigate()
  const { id: classId, sessionId } = useParams()
  const { role, user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [className, setClassName] = useState<string>('')
  const [session, setSession] = useState<ClassSessionRow | null>(null)
  const [season, setSeason] = useState<SeasonRow | null>(null)
  const [presentStudents, setPresentStudents] = useState<StudentRow[]>([])
  const [questions, setQuestions] = useState<TechnicalQuestionRow[]>([])

  const [step, setStep] = useState<'worst_select' | 'worst_rate' | 'best_select' | 'best_rate' | 'done'>('worst_select')
  const [worstIds, setWorstIds] = useState<string[]>([])
  const [bestIds, setBestIds] = useState<string[]>([])

  const [draft, setDraft] = useState<Record<string, DraftAnswer>>({})
  const [saving, setSaving] = useState(false)

  const baseQuestions = useMemo(() => questions.filter((q) => q.active && q.kind === 'base' && q.slot === 1), [questions])
  const positionQuestions = useMemo(() => questions.filter((q) => q.active && q.kind === 'position'), [questions])

  const canAccess = role === 'coach' || role === 'school_admin' || role === 'super_admin'

  const fetchContext = useCallback(async () => {
    if (!classId || !sessionId) return
    setLoading(true)

    const [{ data: classData, error: classError }, { data: sessionData, error: sessionError }] = await Promise.all([
      supabase.from('classes').select('name').eq('id', classId).maybeSingle(),
      supabase.from('class_sessions').select('id, date, start_time, end_time, topic').eq('id', sessionId).maybeSingle(),
    ])

    if (classError) alert(classError.message)
    if (sessionError) alert(sessionError.message)

    setClassName(classData?.name ?? '')
    setSession((sessionData as unknown as ClassSessionRow) ?? null)
    setLoading(false)
  }, [classId, sessionId])

  const fetchSeason = useCallback(async () => {
    const { data, error } = await supabase.from('seasons').select('id, year').eq('is_active', true).maybeSingle()
    if (error) {
      alert(error.message)
      setSeason(null)
      return
    }
    setSeason((data as unknown as SeasonRow) ?? null)
  }, [])

  const fetchPresentStudents = useCallback(async () => {
    if (!sessionId) return
    const { data, error } = await supabase
      .from('attendances')
      .select('student:students(id, full_name)')
      .eq('session_id', sessionId)
      .eq('status', 'present')

    if (error) {
      alert(error.message)
      setPresentStudents([])
      return
    }

    const list = (data as unknown as Array<{ student: StudentRow | null }>)
      .map((d) => d.student)
      .filter((s): s is StudentRow => Boolean(s))
      .sort((a, b) => a.full_name.localeCompare(b.full_name))

    setPresentStudents(list)
  }, [sessionId])

  const fetchQuestions = useCallback(async () => {
    if (!season?.id) return
    const { data, error } = await supabase
      .from('technical_questions')
      .select('id, kind, slot, position, key, prompt, active, sort_order')
      .eq('season_id', season.id)
      .order('kind', { ascending: true })
      .order('slot', { ascending: true })
      .order('sort_order', { ascending: true })

    if (error) {
      alert(error.message)
      setQuestions([])
      return
    }

    setQuestions((data as unknown as TechnicalQuestionRow[]) ?? [])
  }, [season])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchContext()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchContext])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSeason()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSeason])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPresentStudents()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchPresentStudents])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchQuestions()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchQuestions])

  const buildDraftDefaults = useCallback(
    (positionKey: string) => {
      const q2First = positionQuestions.find((q) => q.position === positionKey && q.slot === 2)?.key ?? ''
      const q3First = positionQuestions.find((q) => q.position === positionKey && q.slot === 3)?.key ?? ''
      return { q2First, q3First }
    },
    [positionQuestions],
  )

  const ensureDraft = useCallback(
    async (group: 'worst' | 'best', studentId: string) => {
      const draftKey = `${group}:${studentId}`
      if (draft[draftKey]) return
      if (!season?.id) return
      const firstBase = baseQuestions[0]?.key ?? ''

      const { data } = await supabase
        .from('engine_events')
        .select('meta')
        .eq('engine', 'technical')
        .eq('season_id', season.id)
        .eq('student_id', studentId)
        .eq('source_type', 'technical_daily')
        .order('created_at', { ascending: false })
        .limit(20)

      const positions: string[] = []
      ;((data as unknown as Array<{ meta: unknown }>) ?? []).forEach((row) => {
        const meta = row.meta as { position?: unknown } | null
        const p = typeof meta?.position === 'string' ? meta.position : null
        if (p) positions.push(p)
      })

      const counts = new Map<string, number>()
      positions.forEach((p) => counts.set(p, (counts.get(p) ?? 0) + 1))
      let suggested = 'atacante'
      let bestCount = -1
      for (const [p, c] of counts.entries()) {
        if (c > bestCount) {
          suggested = p
          bestCount = c
        }
      }

      const { q2First, q3First } = buildDraftDefaults(suggested)

      setDraft((prev) => {
        if (prev[draftKey]) return prev
        return {
          ...prev,
          [draftKey]: {
            position: suggested,
            q1Key: firstBase,
            q1Score: null,
            q2Key: q2First,
            q2Score: null,
            q3Key: q3First,
            q3Score: null,
          },
        }
      })
    },
    [baseQuestions, buildDraftDefaults, draft, season],
  )

  const toggleSelection = (ids: string[], setIds: (next: string[]) => void, studentId: string) => {
    if (ids.includes(studentId)) {
      setIds(ids.filter((id) => id !== studentId))
      return
    }
    if (ids.length >= 3) return
    setIds([...ids, studentId])
  }

  const updateDraft = (group: 'worst' | 'best', studentId: string, patch: Partial<DraftAnswer>) => {
    const key = `${group}:${studentId}`
    setDraft((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as DraftAnswer), ...patch },
    }))
  }

  const getPositionOptionsForSlot = useCallback(
    (positionKey: string, slot: 2 | 3) =>
      positionQuestions
        .filter((q) => q.position === positionKey && q.slot === slot)
        .map((q) => ({ key: q.key, prompt: q.prompt })),
    [positionQuestions],
  )

  const canProceedRate = useCallback(
    (group: 'worst' | 'best', ids: string[]) => {
      if (ids.length !== 3) return false
      return ids.every((studentId) => {
        const item = draft[`${group}:${studentId}`]
        if (!item) return false
        if (!item.q1Key || item.q1Score == null) return false
        if (!item.q2Key || item.q2Score == null) return false
        if (!item.q3Key || item.q3Score == null) return false
        return true
      })
    },
    [draft],
  )

  const saveAll = async () => {
    if (!user?.id) return
    if (!season?.id) {
      alert('Nenhuma temporada ativa encontrada.')
      return
    }
    if (!classId || !sessionId) return

    const allIds = [...worstIds.map((id) => ({ group: 'worst' as const, id })), ...bestIds.map((id) => ({ group: 'best' as const, id }))]
    if (worstIds.length !== 3 || bestIds.length !== 3) {
      alert('Selecione 3 piores e 3 melhores.')
      return
    }
    if (!canProceedRate('worst', worstIds) || !canProceedRate('best', bestIds)) {
      alert('Preencha todas as perguntas com notas 0–10.')
      return
    }

    const baseByKey = new Map(baseQuestions.map((q) => [q.key, q.prompt]))
    const posByKey = new Map(positionQuestions.map((q) => [q.key, q.prompt]))

    const rows = allIds.flatMap(({ group, id: studentId }) => {
      const item = draft[`${group}:${studentId}`] as DraftAnswer
      const position = item.position
      return [
        {
          engine: 'technical',
          season_id: season.id,
          student_id: studentId,
          actor_id: user.id,
          source_type: 'technical_daily',
          source_id: `${sessionId}:${user.id}:${group}:1`,
          event_key: item.q1Key,
          value: clampScore(item.q1Score ?? 0),
          meta: {
            class_id: classId,
            session_id: sessionId,
            group,
            slot: 1,
            kind: 'base',
            position,
            prompt: baseByKey.get(item.q1Key) ?? null,
          },
        },
        {
          engine: 'technical',
          season_id: season.id,
          student_id: studentId,
          actor_id: user.id,
          source_type: 'technical_daily',
          source_id: `${sessionId}:${user.id}:${group}:2`,
          event_key: item.q2Key,
          value: clampScore(item.q2Score ?? 0),
          meta: {
            class_id: classId,
            session_id: sessionId,
            group,
            slot: 2,
            kind: 'position',
            position,
            prompt: posByKey.get(item.q2Key) ?? null,
          },
        },
        {
          engine: 'technical',
          season_id: season.id,
          student_id: studentId,
          actor_id: user.id,
          source_type: 'technical_daily',
          source_id: `${sessionId}:${user.id}:${group}:3`,
          event_key: item.q3Key,
          value: clampScore(item.q3Score ?? 0),
          meta: {
            class_id: classId,
            session_id: sessionId,
            group,
            slot: 3,
            kind: 'position',
            position,
            prompt: posByKey.get(item.q3Key) ?? null,
          },
        },
      ]
    })

    setSaving(true)
    const { error } = await supabase.from('engine_events').upsert(rows, { onConflict: 'engine,season_id,student_id,source_type,source_id' })
    setSaving(false)

    if (error) {
      alert(error.message)
      return
    }

    setStep('done')
  }

  if (!canAccess) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-600">Acesso restrito ao professor/gestor.</p>
        </div>
      </div>
    )
  }

  const headerTitle = session ? `${new Date(session.date).toLocaleDateString('pt-BR')} • ${session.topic || 'Sem tema'}` : 'Pós‑treino'

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Pós‑treino</h1>
          <p className="mt-1 text-sm text-slate-600">
            {className ? `${className} • ` : ''}
            {headerTitle}
            {season ? ` • Temporada ${season.year}` : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">Carregando...</div>
      ) : null}

      {!season ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-700 font-semibold">Nenhuma temporada ativa encontrada.</p>
          <p className="mt-2 text-sm text-slate-600">Defina uma temporada ativa no Cantinho do CTO → Engines → Temporadas.</p>
        </div>
      ) : null}

      {season && baseQuestions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-700 font-semibold">Rubricas base não cadastradas.</p>
          <p className="mt-2 text-sm text-slate-600">Cadastre perguntas base (slot 1) no Cantinho do CTO → Engines → Rubricas técnicas.</p>
        </div>
      ) : null}

      {season && baseQuestions.length > 0 ? (
        <>
          {step === 'worst_select' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">1) Selecione os 3 piores</p>
                <p className="text-sm text-slate-600">Obrigatório escolher 3 para avançar.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {presentStudents.map((s) => {
                  const checked = worstIds.includes(s.id)
                  const disabled = !checked && worstIds.length >= 3
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSelection(worstIds, setWorstIds, s.id)}
                      disabled={disabled}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        checked ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:bg-slate-50'
                      } ${disabled ? 'opacity-50' : ''}`}
                    >
                      <p className="text-sm font-semibold text-slate-900">{s.full_name}</p>
                      <p className="text-xs text-slate-500">{checked ? 'Selecionado' : worstIds.length >= 3 ? 'Limite atingido' : 'Toque para selecionar'}</p>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    for (const id of worstIds) {
                      await ensureDraft('worst', id)
                    }
                    setStep('worst_rate')
                  }}
                  disabled={worstIds.length !== 3}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : null}

          {step === 'worst_rate' ? (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-sm font-semibold text-slate-900">2) Avalie os 3 piores (0–10)</p>
                <p className="text-sm text-slate-600">Escolha as perguntas e informe a nota.</p>
              </div>
              {worstIds.map((studentId) => {
                const student = presentStudents.find((s) => s.id === studentId)
                const item = draft[`worst:${studentId}`]
                if (!student || !item) return null
                const slot2Options = getPositionOptionsForSlot(item.position, 2)
                const slot3Options = getPositionOptionsForSlot(item.position, 3)

                return (
                  <div key={studentId} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{student.full_name}</p>
                      <select
                        value={item.position}
                        onChange={(e) => updateDraft('worst', studentId, { position: e.target.value, q2Key: '', q3Key: '' })}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-2"
                      >
                        {POSITIONS.map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500">Base (slot 1)</p>
                        <select value={item.q1Key} onChange={(e) => updateDraft('worst', studentId, { q1Key: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2">
                          {baseQuestions.map((q) => (
                            <option key={q.key} value={q.key}>
                              {q.prompt}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={item.q1Score ?? ''}
                          onChange={(e) => updateDraft('worst', studentId, { q1Score: e.target.value === '' ? null : clampScore(parseFloat(e.target.value)) })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          placeholder="Nota (0–10)"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500">Posição (slot 2)</p>
                        <select
                          value={item.q2Key}
                          onChange={(e) => updateDraft('worst', studentId, { q2Key: e.target.value })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          disabled={slot2Options.length === 0}
                        >
                          <option value="">{slot2Options.length === 0 ? 'Cadastre rubricas (slot 2)' : 'Selecione'}</option>
                          {slot2Options.map((q) => (
                            <option key={q.key} value={q.key}>
                              {q.prompt}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={item.q2Score ?? ''}
                          onChange={(e) => updateDraft('worst', studentId, { q2Score: e.target.value === '' ? null : clampScore(parseFloat(e.target.value)) })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          placeholder="Nota (0–10)"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500">Posição (slot 3)</p>
                        <select
                          value={item.q3Key}
                          onChange={(e) => updateDraft('worst', studentId, { q3Key: e.target.value })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          disabled={slot3Options.length === 0}
                        >
                          <option value="">{slot3Options.length === 0 ? 'Cadastre rubricas (slot 3)' : 'Selecione'}</option>
                          {slot3Options.map((q) => (
                            <option key={q.key} value={q.key}>
                              {q.prompt}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={item.q3Score ?? ''}
                          onChange={(e) => updateDraft('worst', studentId, { q3Score: e.target.value === '' ? null : clampScore(parseFloat(e.target.value)) })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          placeholder="Nota (0–10)"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setStep('worst_select')} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50">
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep('best_select')}
                  disabled={!canProceedRate('worst', worstIds)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  Continuar para os 3 melhores
                </button>
              </div>
            </div>
          ) : null}

          {step === 'best_select' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">3) Selecione os 3 melhores</p>
                <p className="text-sm text-slate-600">Obrigatório escolher 3 para salvar.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {presentStudents.map((s) => {
                  const checked = bestIds.includes(s.id)
                  const disabled = !checked && bestIds.length >= 3
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSelection(bestIds, setBestIds, s.id)}
                      disabled={disabled}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        checked ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:bg-slate-50'
                      } ${disabled ? 'opacity-50' : ''}`}
                    >
                      <p className="text-sm font-semibold text-slate-900">{s.full_name}</p>
                      <p className="text-xs text-slate-500">{checked ? 'Selecionado' : bestIds.length >= 3 ? 'Limite atingido' : 'Toque para selecionar'}</p>
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setStep('worst_rate')} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50">
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    for (const id of bestIds) {
                      await ensureDraft('best', id)
                    }
                    setStep('best_rate')
                  }}
                  disabled={bestIds.length !== 3}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            </div>
          ) : null}

          {step === 'best_rate' ? (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <p className="text-sm font-semibold text-slate-900">4) Avalie os 3 melhores (0–10)</p>
                <p className="text-sm text-slate-600">Escolha as perguntas e informe a nota.</p>
              </div>
              {bestIds.map((studentId) => {
                const student = presentStudents.find((s) => s.id === studentId)
                const item = draft[`best:${studentId}`]
                if (!student || !item) return null
                const slot2Options = getPositionOptionsForSlot(item.position, 2)
                const slot3Options = getPositionOptionsForSlot(item.position, 3)

                return (
                  <div key={studentId} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{student.full_name}</p>
                      <select
                        value={item.position}
                        onChange={(e) => updateDraft('best', studentId, { position: e.target.value, q2Key: '', q3Key: '' })}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-2"
                      >
                        {POSITIONS.map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500">Base (slot 1)</p>
                        <select value={item.q1Key} onChange={(e) => updateDraft('best', studentId, { q1Key: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2">
                          {baseQuestions.map((q) => (
                            <option key={q.key} value={q.key}>
                              {q.prompt}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={item.q1Score ?? ''}
                          onChange={(e) => updateDraft('best', studentId, { q1Score: e.target.value === '' ? null : clampScore(parseFloat(e.target.value)) })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          placeholder="Nota (0–10)"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500">Posição (slot 2)</p>
                        <select
                          value={item.q2Key}
                          onChange={(e) => updateDraft('best', studentId, { q2Key: e.target.value })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          disabled={slot2Options.length === 0}
                        >
                          <option value="">{slot2Options.length === 0 ? 'Cadastre rubricas (slot 2)' : 'Selecione'}</option>
                          {slot2Options.map((q) => (
                            <option key={q.key} value={q.key}>
                              {q.prompt}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={item.q2Score ?? ''}
                          onChange={(e) => updateDraft('best', studentId, { q2Score: e.target.value === '' ? null : clampScore(parseFloat(e.target.value)) })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          placeholder="Nota (0–10)"
                        />
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500">Posição (slot 3)</p>
                        <select
                          value={item.q3Key}
                          onChange={(e) => updateDraft('best', studentId, { q3Key: e.target.value })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          disabled={slot3Options.length === 0}
                        >
                          <option value="">{slot3Options.length === 0 ? 'Cadastre rubricas (slot 3)' : 'Selecione'}</option>
                          {slot3Options.map((q) => (
                            <option key={q.key} value={q.key}>
                              {q.prompt}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={item.q3Score ?? ''}
                          onChange={(e) => updateDraft('best', studentId, { q3Score: e.target.value === '' ? null : clampScore(parseFloat(e.target.value)) })}
                          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                          placeholder="Nota (0–10)"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="flex items-center justify-between">
                <button type="button" onClick={() => setStep('best_select')} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50">
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={saveAll}
                  disabled={saving || !canProceedRate('best', bestIds)}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Salvando...' : 'Salvar avaliação'}
                </button>
              </div>
            </div>
          ) : null}

          {step === 'done' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-900">Avaliação salva</p>
              <p className="text-sm text-slate-600">Os eventos técnicos foram registrados para a temporada ativa.</p>
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/classes/${classId}/sessions/${sessionId}/resumo-tecnico`)}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                  >
                    Ver resumo técnico
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/classes/${classId}/attendance`)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                  >
                    Voltar para a chamada
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
