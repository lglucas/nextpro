import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ClipboardList, GraduationCap, Trophy, UserPlus } from 'lucide-react'

type TopStudent = {
  id: string
  full_name: string
  photo_url: string | null
  xp_total: number
  level: number
}

export function OperationsHomePage() {
  const { user, role } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [topStudents, setTopStudents] = useState<TopStudent[]>([])

  const canSeePreCadastros = role === 'school_admin' || role === 'super_admin'

  const fetchSchoolId = useCallback(async () => {
    if (!user?.id) {
      setSchoolId(null)
      return
    }
    const { data } = await supabase.from('profiles').select('school_id').eq('id', user.id).maybeSingle()
    setSchoolId((data as unknown as { school_id?: string | null } | null)?.school_id ?? null)
  }, [user])

  const fetchTopStudents = useCallback(async () => {
    const { data } = await supabase
      .from('student_progress')
      .select('student_id, xp_total, level, student:students(id, full_name, photo_url, school_id)')
      .order('xp_total', { ascending: false })
      .limit(50)

    const safeRows =
      (data as unknown as Array<{
        student_id: string
        xp_total: number | null
        level: number | null
        student: { id: string; full_name: string; photo_url: string | null; school_id: string | null } | null
      }>) ?? []

    const filtered = schoolId ? safeRows.filter((r) => r.student?.school_id === schoolId) : safeRows
    const top = filtered
      .filter((r) => r.student?.id)
      .slice(0, 3)
      .map((r) => ({
        id: r.student?.id || r.student_id,
        full_name: r.student?.full_name || 'Aluno',
        photo_url: r.student?.photo_url ?? null,
        xp_total: r.xp_total ?? 0,
        level: r.level ?? 1,
      }))

    setTopStudents(top)
  }, [schoolId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSchoolId()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSchoolId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchTopStudents()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchTopStudents])

  const quickActions = useMemo(() => {
    const items = [
      { title: 'Turmas', desc: 'Chamada, sessões, pós‑treino e mensal', to: '/dashboard/classes', icon: GraduationCap },
      { title: 'Alunos', desc: 'Cadastro e ficha do atleta', to: '/dashboard/students', icon: UserPlus },
    ]
    if (canSeePreCadastros) items.push({ title: 'Pré‑cadastros', desc: 'Aprovar e acompanhar onboarding', to: '/dashboard/pre-cadastros', icon: ClipboardList })
    return items
  }, [canSeePreCadastros])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Operação</h1>
        <p className="text-slate-500">Atalhos para o dia a dia do técnico e da escolinha.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((a) => (
          <Link key={a.title} to={a.to} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 border border-slate-200">
              <a.icon className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{a.title}</h3>
            <p className="text-sm text-slate-500">{a.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Top 3 (XP)</h3>
          <Trophy className="w-4 h-4 text-amber-500" />
        </div>
        <div className="divide-y divide-slate-100">
          {topStudents.length === 0 ? (
            <div className="px-6 py-6 text-sm text-slate-600">Sem ranking disponível.</div>
          ) : (
            topStudents.map((s, idx) => (
              <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-700 text-xs font-bold">
                    {s.photo_url ? <img src={s.photo_url} alt={s.full_name} className="w-full h-full object-cover" /> : <span>{idx + 1}</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {idx + 1}º • {s.full_name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      Nível {s.level} • {s.xp_total} XP
                    </p>
                  </div>
                </div>
                <Link to={`/dashboard/students/${s.id}/card`} className="text-xs font-semibold text-primary hover:underline whitespace-nowrap">
                  Ver card
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
