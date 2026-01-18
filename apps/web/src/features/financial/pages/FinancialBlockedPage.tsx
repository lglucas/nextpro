import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useEffect, useMemo, useState } from 'react'

type BlockedStudent = {
  id: string
  full_name: string
  schoolName: string | null
}

export function FinancialBlockedPage() {
  const { signOut, user, role } = useAuth()
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [blockedStudents, setBlockedStudents] = useState<BlockedStudent[]>([])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!user?.id) {
        if (mounted) setLoadingDetails(false)
        return
      }

      setLoadingDetails(true)
      try {
        const blockedRows: Array<{ id: string; full_name: string; school: { name: string } | null }> = []

        if (role === 'guardian') {
          const { data: guardianData } = await supabase.from('guardians').select('id').eq('user_id', user.id).limit(1)
          const guardianId = (guardianData as unknown as Array<{ id: string }> | null)?.[0]?.id ?? null

          if (guardianId) {
            const { data } = await supabase
              .from('students')
              .select('id, full_name, school:schools(name)')
              .eq('guardian_id', guardianId)
              .eq('financial_status', 'blocked')
            if (data) blockedRows.push(...(data as unknown as typeof blockedRows))
          }
        } else {
          const { data } = await supabase
            .from('students')
            .select('id, full_name, school:schools(name)')
            .eq('user_id', user.id)
            .eq('financial_status', 'blocked')
          if (data) blockedRows.push(...(data as unknown as typeof blockedRows))
        }

        if (!mounted) return
        setBlockedStudents(
          blockedRows.map((s) => ({
            id: s.id,
            full_name: s.full_name,
            schoolName: s.school?.name ?? null,
          })),
        )
      } finally {
        if (mounted) setLoadingDetails(false)
      }
    }

    void run()

    return () => {
      mounted = false
    }
  }, [role, user?.id])

  const schoolsText = useMemo(() => {
    const schools = Array.from(new Set(blockedStudents.map((s) => s.schoolName).filter((n): n is string => Boolean(n))))
    if (schools.length === 0) return null
    return schools.length === 1 ? schools[0] : schools.join(', ')
  }, [blockedStudents])

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Acesso bloqueado</h1>
        <p className="mt-2 text-sm text-slate-600">Existe um bloqueio financeiro ativo no seu acesso.</p>

        {loadingDetails ? (
          <p className="mt-4 text-sm text-slate-600">Carregando detalhes…</p>
        ) : blockedStudents.length > 0 ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Alunos bloqueados</p>
            <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
              {blockedStudents.map((s) => (
                <li key={s.id}>
                  {s.full_name}
                  {s.schoolName ? <span className="text-slate-500"> • {s.schoolName}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-900">Não encontrei nenhum aluno bloqueado vinculado a este usuário.</p>
          </div>
        )}

        <p className="mt-4 text-sm text-slate-600">
          {schoolsText ? `Procure a secretaria da escola: ${schoolsText}. ` : 'Procure a secretaria da sua escola. '}
          Se você já regularizou, saia e entre novamente.
        </p>
        <div className="mt-6">
          <button type="button" onClick={() => void signOut()} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}

