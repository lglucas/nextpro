import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import { StudentFutCard } from '@/features/school/components/StudentFutCard'
import { StudentFichaSection } from '@/features/school/components/StudentFichaSection'
import { StudentMonthlyEvaluationSection } from '@/features/school/components/StudentMonthlyEvaluationSection'
import { StudentSeasonSkillTreeSection } from '@/features/school/components/StudentSeasonSkillTreeSection'

type StudentProgressRow = { student_id: string; xp_total: number; level: number }
type SeasonRow = { id: string; year: number }

type StudentRow = {
  id: string
  full_name: string
  birth_date: string | null
  category: string | null
  active: boolean | null
  photo_url: string | null
  financial_status: 'active' | 'warning' | 'blocked' | null
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

function initialsFromName(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function StudentCardPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<StudentRow | null>(null)
  const [season, setSeason] = useState<SeasonRow | null>(null)
  const [progress, setProgress] = useState<StudentProgressRow | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!id) return
      setLoading(true)

      const { data: seasonData } = await supabase.from('seasons').select('id, year').eq('is_active', true).maybeSingle()
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
          financial_status,
          blood_type,
          allergies,
          school:schools(name),
          guardian:guardians(full_name, phone, email)
        `,
        )
        .eq('id', id)
        .maybeSingle()

      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('student_id, xp_total, level')
        .eq('student_id', id)
        .maybeSingle()

      if (!mounted) return

      setSeason((seasonData as unknown as SeasonRow) ?? null)

      if (studentError || !studentData) {
        setStudent(null)
        setProgress(null)
        setLoading(false)
        return
      }

      setStudent(studentData as unknown as StudentRow)
      setProgress(progressError ? null : ((progressData as unknown as StudentProgressRow) ?? null))
      setLoading(false)
    }

    void run()

    return () => {
      mounted = false
    }
  }, [id])

  const fut = useMemo(() => {
    if (!student) return null
    const xpTotal = progress?.xp_total ?? 0
    const storedLevel = progress?.level ?? 1
    const info = getLevelInfo(xpTotal)
    const level = Math.max(storedLevel, info.level)
    const pct = Math.max(0, Math.min(100, Math.round((info.xpIntoLevel / info.xpForNext) * 100)))
    return { xpTotal, level, pct, xpIntoLevel: info.xpIntoLevel, xpForNext: info.xpForNext, initials: initialsFromName(student.full_name) }
  }, [progress, student])

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
      ) : !student || !fut ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Aluno não encontrado ou sem permissão.</p>
          <p className="mt-2 text-sm text-slate-600">Verifique se você tem acesso a este atleta.</p>
        </div>
      ) : (
        <>
          <StudentFutCard
            fullName={student.full_name}
            photoUrl={student.photo_url}
            initials={fut.initials}
            schoolName={student.school?.name ?? null}
            financialStatus={student.financial_status ?? 'active'}
            level={fut.level}
            xpTotal={fut.xpTotal}
            xpIntoLevel={fut.xpIntoLevel}
            xpForNext={fut.xpForNext}
            pct={fut.pct}
          />
          <StudentFichaSection student={student} />
          <StudentSeasonSkillTreeSection studentId={student.id} season={season} />
          <StudentMonthlyEvaluationSection studentId={student.id} season={season} />
        </>
      )}
    </div>
  )
}

