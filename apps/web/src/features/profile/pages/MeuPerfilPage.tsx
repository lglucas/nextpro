import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type StudentRow = { id: string; full_name: string; photo_url: string | null }
type StudentProgressRow = { student_id: string; xp_total: number; level: number }

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

export function MeuPerfilPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [progressByStudentId, setProgressByStudentId] = useState<Record<string, StudentProgressRow>>({})

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (!user) return

      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name, photo_url')
        .eq('user_id', user.id)
        .order('full_name')

      if (!mounted) return

      if (studentsError) {
        setStudents([])
        setProgressByStudentId({})
        return
      }

      const list = (studentsData ?? []) as StudentRow[]
      setStudents(list)

      const studentIds = list.map((s) => s.id)
      if (!studentIds.length) {
        setProgressByStudentId({})
        return
      }

      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select('student_id, xp_total, level')
        .in('student_id', studentIds)

      if (!mounted) return

      if (progressError) {
        setProgressByStudentId({})
        return
      }

      const nextMap: Record<string, StudentProgressRow> = {}
      ;((progressData ?? []) as StudentProgressRow[]).forEach((row) => {
        nextMap[row.student_id] = row
      })
      setProgressByStudentId(nextMap)
    }

    run()

    return () => {
      mounted = false
    }
  }, [user])

  const cards = useMemo(() => {
    return students.map((s) => {
      const progress = progressByStudentId[s.id]
      const xpTotal = progress?.xp_total ?? 0
      const storedLevel = progress?.level ?? 1
      const info = getLevelInfo(xpTotal)
      const level = Math.max(storedLevel, info.level)
      const pct = Math.max(0, Math.min(100, Math.round((info.xpIntoLevel / info.xpForNext) * 100)))
      const initials = s.full_name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('')
      return { student: s, level, xpTotal, pct, xpIntoLevel: info.xpIntoLevel, xpForNext: info.xpForNext, initials }
    })
  }, [progressByStudentId, students])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Meu perfil</h1>
        <p className="mt-2 text-slate-600">Página inicial. Vamos evoluir com dados e preferências.</p>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-900 break-all">{user?.email || '—'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500">User ID</p>
            <p className="mt-1 font-semibold text-slate-900 break-all">{user?.id || '—'}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900">Atleta</h2>
          {!cards.length ? (
            <p className="mt-2 text-sm text-slate-600">
              Nenhum atleta vinculado ao seu usuário ainda. Peça para a escolinha vincular seu User ID ao atleta.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {cards.map(({ student, level, xpTotal, pct, xpIntoLevel, xpForNext, initials }) => (
                <div
                  key={student.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center text-white font-bold">
                          {student.photo_url ? (
                            <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{initials || 'NP'}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-bold truncate">{student.full_name}</p>
                          <p className="text-white/70 text-xs">FUT Card • NextPro</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 text-xs">Nível</p>
                        <p className="text-white text-2xl font-extrabold leading-none">{level}</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs text-white/80">
                        <span>{xpTotal} XP</span>
                        <span>
                          {xpIntoLevel}/{xpForNext}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-2 bg-amber-400" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
