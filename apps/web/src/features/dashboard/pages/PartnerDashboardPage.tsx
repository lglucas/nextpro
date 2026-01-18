import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Building2, GraduationCap, Users } from 'lucide-react'

export function PartnerDashboardPage() {
  const [stats, setStats] = useState({
    schools: 0,
    students: 0,
    classes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      setLoading(true)
      const [{ count: schoolsCount }, { count: studentsCount }, { count: classesCount }] = await Promise.all([
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('classes').select('id', { count: 'exact', head: true }),
      ])

      if (!mounted) return

      setStats({
        schools: schoolsCount ?? 0,
        students: studentsCount ?? 0,
        classes: classesCount ?? 0,
      })
      setLoading(false)
    }
    void run()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard (Partner)</h1>
        <p className="text-slate-500">Visão macro do ecossistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
              <Building2 className="w-6 h-6 text-slate-700" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{loading ? '—' : stats.schools}</h3>
          <p className="text-sm text-slate-500">Escolas</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
              <Users className="w-6 h-6 text-slate-700" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{loading ? '—' : stats.students}</h3>
          <p className="text-sm text-slate-500">Alunos</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
              <GraduationCap className="w-6 h-6 text-slate-700" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-1">{loading ? '—' : stats.classes}</h3>
          <p className="text-sm text-slate-500">Turmas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Próximos módulos</h3>
        </div>
        <div className="p-6 text-sm text-slate-600 space-y-2">
          <p>Marketplace e benefícios (V1.1–V1.2).</p>
          <p>Dashboard pais e evolução técnica (V1.3–V1.4).</p>
          <p>Social e notificações (sprints dedicados).</p>
        </div>
      </div>
    </div>
  )
}

