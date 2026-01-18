import { Trophy, Calendar, User, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { loadTechnicalLastSeenIso } from '@/features/technical/storage'

type StudentRow = { id: string; full_name: string }

type NextSessionRow = {
  id: string
  date: string
  start_time: string | null
  topic: string | null
}

export function HomePage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<StudentRow[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [nextSession, setNextSession] = useState<NextSessionRow | null>(null)
  const [attendanceTotal, setAttendanceTotal] = useState(0)
  const [attendancePresent, setAttendancePresent] = useState(0)
  const [technicalUnreadCount, setTechnicalUnreadCount] = useState<number | null>(null)

  const attendanceText = useMemo(() => {
    if (!attendanceTotal) return 'Sem treinos suficientes para calcular'
    return `Você compareceu a ${attendancePresent}/${attendanceTotal} treinos`
  }, [attendancePresent, attendanceTotal])

  const attendancePercent = useMemo(() => {
    if (!attendanceTotal) return 0
    return Math.round((attendancePresent / attendanceTotal) * 100)
  }, [attendancePresent, attendanceTotal])

  const fetchStudents = useCallback(async () => {
    if (!user?.id) return
    const { data, error } = await supabase.from('students').select('id, full_name').eq('user_id', user.id).order('full_name')
    if (error) {
      setStudents([])
      setSelectedStudentId('')
      return
    }
    const list = (data || []) as unknown as StudentRow[]
    setStudents(list)
    if (!selectedStudentId && list[0]?.id) setSelectedStudentId(list[0].id)
  }, [selectedStudentId, user])

  const fetchNextSession = useCallback(async () => {
    if (!selectedStudentId) {
      setNextSession(null)
      return
    }
    const { data: enrollments, error: enrollmentsError } = await supabase.from('class_students').select('class_id').eq('student_id', selectedStudentId)
    if (enrollmentsError) {
      setNextSession(null)
      return
    }

    const classIds = ((enrollments || []) as unknown as Array<{ class_id: string }>).map((e) => e.class_id).filter(Boolean)
    if (!classIds.length) {
      setNextSession(null)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const { data: next, error: nextError } = await supabase
      .from('class_sessions')
      .select('id, date, start_time, topic')
      .in('class_id', classIds)
      .gte('date', today)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (nextError) {
      setNextSession(null)
      return
    }

    setNextSession((next as unknown as NextSessionRow) ?? null)
  }, [selectedStudentId])

  const fetchAttendance = useCallback(async () => {
    if (!selectedStudentId) {
      setAttendanceTotal(0)
      setAttendancePresent(0)
      return
    }

    const { data, error } = await supabase
      .from('attendances')
      .select('status, created_at')
      .eq('student_id', selectedStudentId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      setAttendanceTotal(0)
      setAttendancePresent(0)
      return
    }

    const rows = (data || []) as unknown as Array<{ status: string }>
    const total = rows.length
    const present = rows.filter((r) => r.status === 'present' || r.status === 'late').length
    setAttendanceTotal(total)
    setAttendancePresent(present)
  }, [selectedStudentId])

  const fetchTechnicalUnread = useCallback(async () => {
    if (!user?.id) return
    if (!selectedStudentId) {
      setTechnicalUnreadCount(null)
      return
    }

    const lastSeen = loadTechnicalLastSeenIso(user.id, selectedStudentId)
    const query = supabase
      .from('engine_events')
      .select('id', { count: 'exact', head: true })
      .eq('engine', 'technical')
      .eq('student_id', selectedStudentId)
      .eq('source_type', 'technical_daily')

    const { count, error } = lastSeen ? await query.gt('created_at', lastSeen) : await query
    if (error) {
      setTechnicalUnreadCount(null)
      return
    }
    setTechnicalUnreadCount(count ?? 0)
  }, [selectedStudentId, user])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void fetchStudents(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchStudents])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchNextSession()
      void fetchAttendance()
      void fetchTechnicalUnread()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchAttendance, fetchNextSession, fetchTechnicalUnread])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Olá, {user?.user_metadata?.full_name || 'Atleta'}!
            </h1>
            <p className="text-slate-600">
              Bem-vindo ao NextPro. Aqui você acompanha sua evolução no futebol.
            </p>
            {students.length > 1 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500">Atleta</p>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="mt-2 w-full md:w-[320px] text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
          <div className="flex gap-3">
            <Link to="/app/check-in" className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Abrir Check-in
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Próximo Treino</h3>
          <p className="text-sm text-slate-500 mb-4">
            {nextSession
              ? `${new Date(nextSession.date).toLocaleDateString('pt-BR')} • ${nextSession.start_time?.slice(0, 5) || '--:--'} • ${nextSession.topic || 'Treino'}`
              : 'Sem treino agendado'}
          </p>
          <Link to="/app/check-in" className="text-sm text-blue-600 font-medium flex items-center hover:underline">
            Abrir check-in <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Frequência</h3>
          <p className="text-sm text-slate-500 mb-4">{attendanceText}</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${attendancePercent}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Meu Perfil</h3>
          <p className="text-sm text-slate-500 mb-4">Atualize suas estatísticas</p>
          <Link to="/app/meu-perfil" className="text-sm text-purple-600 font-medium flex items-center hover:underline">
            Editar perfil <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-slate-900 mb-1">Histórico técnico</h3>
            {technicalUnreadCount != null && technicalUnreadCount > 0 ? (
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                {technicalUnreadCount} novo{technicalUnreadCount === 1 ? '' : 's'}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-slate-500 mb-4">Acompanhe seu resumo por treino</p>
          <Link to="/app/tecnico" className="text-sm text-amber-700 font-medium flex items-center hover:underline">
            Ver histórico <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
