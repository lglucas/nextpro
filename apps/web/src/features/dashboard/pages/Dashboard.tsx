import { BarChart3, TrendingUp, Users, Wallet, GraduationCap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { generateDashboardReport } from '@/utils/pdf'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function DashboardPage() {
  const { user, role } = useAuth()
  const [realStats, setRealStats] = useState({
    students: 0,
    classes: 0,
    evaluations: 0
  })
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: studentsCount } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })

        const { count: classesCount } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true })

        // Tentativa de buscar avaliações (se a tabela existir)
        const { count: evaluationsCount } = await supabase
          .from('evaluations')
          .select('*', { count: 'exact', head: true })

        setRealStats({
          students: studentsCount || 0,
          classes: classesCount || 0,
          evaluations: evaluationsCount || 0
        })

        // Fetch Audit Logs
        const { data: logs } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        if (logs) {
           // Mapear logs para o formato de exibição se necessário, ou usar direto
           setAuditLogs(logs.map(log => ({
             action: log.action,
             user: log.user_email || 'Sistema', // Fallback se não tiver join
             time: new Date(log.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
             detail: log.details || JSON.stringify(log.payload)
           })))
        } else {
           // Fallback para mock se não tiver logs reais ainda
           setAuditLogs([
            { action: 'Sistema Iniciado', user: 'System', time: 'Agora', detail: 'Dashboard carregado' }
           ])
        }

      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      }
    }
    fetchStats()
  }, [])

  // Mock Data (misturado com real)
  const kpiData = {
    students: realStats.students.toString(),
    revenue: 'R$ 45.200', // Mock (Financeiro ainda não implementado)
    attendance: '94.5%', // Mock (Complexo calcular agora)
    newEnrollments: '48' // Mock
  }

  const stats = [
    { name: 'Total de Alunos', value: kpiData.students, change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Turmas Ativas', value: realStats.classes.toString(), change: '+2', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Taxa de Presença', value: kpiData.attendance, change: '+2.1%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Avaliações', value: realStats.evaluations.toString(), change: '+18%', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-100' },
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
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium shadow-sm">
            Novo Relatório
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
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Audit Logs Widget (Visível para todos, mas gerenciado pelo CTO) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Log de Atividades do Sistema</h3>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Últimas 24h</span>
        </div>
        <div className="divide-y divide-slate-100">
          {/* Mock Logs - Futuramente virá do Supabase */}
          {auditLogs.map((log, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.detail} por <span className="font-semibold">{log.user}</span></p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
