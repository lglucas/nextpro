import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'

type StudentProgressRow = { student_id: string; xp_total: number; level: number }

type StudentRow = {
  id: string
  full_name: string
  birth_date: string | null
  category: string | null
  active: boolean | null
  photo_url: string | null
  blood_type: string | null
  allergies: string | null
  school: { name: string } | null
  guardian: { full_name: string | null; phone: string | null; email: string | null } | null
}

function getLevelInfo(totalXp: number) {
  let level = 1
  let nextCost = 100
  let remaining = Math.max(0, Math.trunc(totalXp))

  while (remaining >= nextCost) {
    remaining -= nextCost
    level += 1
    nextCost = Math.max(1, Math.ceil(nextCost * 2.5))
  }

  return { level, xpIntoLevel: remaining, xpForNext: nextCost }
}

export function StudentCardPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentRow | null>(null)
  const [progress, setProgress] = useState<StudentProgressRow | null>(null)

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (!id) return
      setLoading(true)

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select(
          `
          id,
          full_name,
          birth_date,
          category,
          active,
          photo_url,
          blood_type,
          allergies,
          school:schools(name),
          guardian:guardians(full_name, phone, email)
        `,
        )
        .eq('id', id)
        .maybeSingle()

      if (!mounted) return

      if (studentError || !studentData) {
        setStudent(null)
        setProgress(null)
        setLoading(false)
        return
      }

      setStudent(studentData as unknown as StudentRow)

      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('student_id, xp_total, level')
        .eq('student_id', id)
        .maybeSingle()

      if (!mounted) return

      if (progressError) {
        setProgress(null)
      } else {
        setProgress((progressData as unknown as StudentProgressRow) ?? null)
      }

      setLoading(false)
    }

    void run()

    return () => {
      mounted = false
    }
  }, [id])

  const card = useMemo(() => {
    if (!student) return null
    const xpTotal = progress?.xp_total ?? 0
    const storedLevel = progress?.level ?? 1
    const info = getLevelInfo(xpTotal)
    const level = Math.max(storedLevel, info.level)
    const pct = Math.max(0, Math.min(100, Math.round((info.xpIntoLevel / info.xpForNext) * 100)))
    const initials = student.full_name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('')
    return { xpTotal, level, pct, xpIntoLevel: info.xpIntoLevel, xpForNext: info.xpForNext, initials }
  }, [progress, student])

  const birthLabel = student?.birth_date ? new Date(student.birth_date).toLocaleDateString('pt-BR') : '—'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-sm text-slate-600">Carregando…</div>
      ) : !student || !card ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Aluno não encontrado ou sem permissão.</p>
          <p className="mt-2 text-sm text-slate-600">Verifique se você tem acesso a este atleta.</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center text-white font-bold">
                    {student.photo_url ? (
                      <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{card.initials || 'NP'}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold truncate">{student.full_name}</p>
                    <p className="text-white/70 text-xs">
                      FUT Card • {student.school?.name || '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">Nível</p>
                  <p className="text-white text-3xl font-extrabold leading-none">{card.level}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <span>{card.xpTotal} XP</span>
                  <span>
                    {card.xpIntoLevel}/{card.xpForNext}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-2 bg-amber-400" style={{ width: `${card.pct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Ficha do atleta</h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">Data de nascimento</p>
                <p className="mt-1 font-semibold text-slate-900">{birthLabel}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">Categoria</p>
                <p className="mt-1 font-semibold text-slate-900">{student.category || '—'}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 font-semibold text-slate-900">{student.active ? 'Ativo' : 'Inativo'}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">Tipo sanguíneo</p>
                <p className="mt-1 font-semibold text-slate-900">{student.blood_type || '—'}</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-slate-500">Alergias</p>
              <p className="mt-1 text-sm text-slate-900">{student.allergies || '—'}</p>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-900">Responsável</h3>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Nome</p>
                  <p className="mt-1 font-semibold text-slate-900">{student.guardian?.full_name || '—'}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Telefone</p>
                  <p className="mt-1 font-semibold text-slate-900">{student.guardian?.phone || '—'}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 font-semibold text-slate-900 break-all">{student.guardian?.email || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

