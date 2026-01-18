import { BarChart3, TrendingUp, Users, GraduationCap, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { generateDashboardReport } from '@/utils/pdf'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Link } from 'react-router-dom'

interface AuditLogEntry {
  action: string
  user: string
  time: string
  detail: string
}

interface RawAuditLog {
  action: string
  user_email?: string | null
  created_at: string
  details?: unknown
  payload?: unknown
}

type TopStudent = {
  id: string
  full_name: string
  photo_url: string | null
  xp_total: number
  level: number
  schoolName: string | null
}

export function DashboardPage() {
  const { user, role } = useAuth()
  const [realStats, setRealStats] = useState({
    students: 0,
    classes: 0,
    evaluations: 0
  })
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [topStudents, setTopStudents] = useState<TopStudent[]>([])

  useEffect(() => {
    async function fetchStats() {
      try {
        let schoolId: string | null = null
        if (user?.id && role !== 'super_admin') {
          const { data: profile } = await supabase.from('profiles').select('school_id').eq('id', user.id).maybeSingle()
          schoolId = (profile as unknown as { school_id?: string | null } | null)?.school_id ?? null
        }

        const { count: studentsCount } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })

        const { count: classesCount } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true })

        setRealStats({
          students: studentsCount || 0,
          classes: classesCount || 0,
          evaluations: 0
        })

        const { data: rankingRows } = await supabase
          .from('student_progress')
          .select('student_id, xp_total, level, student:students(id, full_name, photo_url, school_id, school:schools(name))')
          .order('xp_total', { ascending: false })
          .limit(50)

        const safeRows =
          (rankingRows as unknown as Array<{
            student_id: string
            xp_total: number | null
            level: number | null
            student: { id: string; full_name: string; photo_url: string | null; school_id: string | null; school: { name: string } | null } | null
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
            schoolName: r.student?.school?.name ?? null,
          }))

        setTopStudents(top)

        // Fetch Audit Logs
        const { data: logs } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (logs) {
          const typedLogs = logs as unknown as RawAuditLog[]
          setAuditLogs(
            typedLogs.map((log) => ({
              action: log.action,
              user: log.user_email || 'Sistema',
              time: new Date(log.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              detail:
                log.details == null
                  ? log.payload == null
                    ? ''
                    : JSON.stringify(log.payload)
                  : typeof log.details === 'string'
                    ? log.details
                    : JSON.stringify(log.details),
            }))
          )
        } else {
          setAuditLogs([{ action: 'Sistema Iniciado', user: 'System', time: 'Agora', detail: 'Dashboard carregado' }])
        }

      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      }
    }
    fetchStats()
  }, [role, user?.id])

  const kpiData = {
    students: realStats.students.toString(),
    revenue: '—',
    attendance: '—',
    newEnrollments: '—'
  }

  const stats = [
    { name: 'Total de Alunos', value: kpiData.students, change: '', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Turmas Ativas', value: realStats.classes.toString(), change: '', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Taxa de Presença', value: kpiData.attendance, change: 'Em breve', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Avaliações', value: realStats.evaluations.toString(), change: 'Em breve', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  const handleExportPDF = () => {
    generateDashboardReport(kpiData, auditLogs)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
          <p className="text-slate-500">Bem-vindo de volta, {user?.user_metadata?.full_name?.split(' ')[0] || 'Gestor'}.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.change ? (
                <span className="text-sm font-medium text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-full">
                  {stat.change}
                </span>
              ) : null}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Top 3 alunos</h3>
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
                        Nível {s.level} • {s.xp_total} XP{role === 'super_admin' && s.schoolName ? ` • ${s.schoolName}` : ''}
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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Log de Atividades do Sistema</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Últimas 24h</span>
          </div>
          <div className="divide-y divide-slate-100">
            {auditLogs.map((log, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{log.action}</p>
                    <p className="text-xs text-slate-500">
                      {log.detail} por <span className="font-semibold">{log.user}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
