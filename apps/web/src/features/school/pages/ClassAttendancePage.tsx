import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  ArrowLeft,
  MoreVertical,
  Save,
  Trash
} from 'lucide-react'

interface ClassSession {
  id: string
  date: string
  start_time: string
  end_time: string
  topic: string
  notes: string
  _count?: {
    attendances: number
  }
}

interface Student {
  id: string
  full_name: string
  photo_url?: string
}

interface Attendance {
  student_id: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

export function ClassAttendancePage() {
  const { id: classId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [className, setClassName] = useState('')
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [students, setStudents] = useState<Student[]>([])
  
  // State for Creating Session
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [newSessionData, setNewSessionData] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '10:30',
    topic: '',
    notes: ''
  })

  // State for Taking Attendance
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null)
  const [attendanceData, setAttendanceData] = useState<Record<string, Attendance>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (classId) {
      fetchClassDetails()
      fetchSessions()
      fetchStudents()
    }
  }, [classId])

  const fetchClassDetails = async () => {
    const { data } = await supabase.from('classes').select('name').eq('id', classId).single()
    if (data) setClassName(data.name)
  }

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('class_sessions')
      .select('*, attendances(count)')
      .eq('class_id', classId)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })

    if (!error && data) {
      setSessions(data.map(s => ({
        ...s,
        _count: { attendances: s.attendances?.[0]?.count || 0 }
      })))
    }
    setLoading(false)
  }

  const fetchStudents = async () => {
    const { data } = await supabase
      .from('class_students')
      .select('student:students(id, full_name, photo_url)')
      .eq('class_id', classId)
      .order('student(full_name)')
    
    if (data) {
      const studentsList = data.map((d: any) => d.student).filter(Boolean)
      setStudents(studentsList)
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('class_sessions')
        .insert({
          class_id: classId,
          ...newSessionData
        })
        .select()
        .single()

      if (error) throw error

      setSessions(prev => [data, ...prev])
      setIsCreatingSession(false)
      // Auto-select to start attendance immediately
      handleSelectSession(data)
    } catch (error) {
      console.error('Erro ao criar aula:', error)
      alert('Erro ao criar aula.')
    }
  }

  const handleSelectSession = async (session: ClassSession) => {
    setSelectedSession(session)
    // Fetch existing attendance
    const { data } = await supabase
      .from('attendances')
      .select('*')
      .eq('session_id', session.id)

    const initialData: Record<string, Attendance> = {}
    
    // Initialize with 'present' for all students if no data exists
    students.forEach(s => {
      initialData[s.id] = {
        student_id: s.id,
        status: 'present'
      }
    })

    // Override with existing data
    if (data) {
      data.forEach(a => {
        initialData[a.student_id] = a
      })
    }

    setAttendanceData(initialData)
  }

  const updateStatus = (studentId: string, status: Attendance['status']) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }))
  }

  const saveAttendance = async () => {
    if (!selectedSession) return
    setIsSaving(true)

    try {
      const upsertData = Object.values(attendanceData).map(a => ({
        session_id: selectedSession.id,
        student_id: a.student_id,
        status: a.status,
        notes: a.notes
      }))

      const { error } = await supabase
        .from('attendances')
        .upsert(upsertData, { onConflict: 'session_id,student_id' })

      if (error) throw error

      alert('Chamada salva com sucesso!')
      setSelectedSession(null)
      fetchSessions() // Update counts
    } catch (error) {
      console.error('Erro ao salvar chamada:', error)
      alert('Erro ao salvar chamada.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Tem certeza? Isso apagará todos os registros de presença desta aula.')) return

    try {
      const { error } = await supabase.from('class_sessions').delete().eq('id', sessionId)
      if (error) throw error
      
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      if (selectedSession?.id === sessionId) setSelectedSession(null)
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir aula.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard/classes')} className="p-2 hover:bg-slate-100 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{className}</h1>
          <p className="text-slate-500">Gestão de Frequência e Aulas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sessions List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Aulas Realizadas</h3>
            <button 
              onClick={() => setIsCreatingSession(true)}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              title="Nova Aula"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* New Session Form */}
          {isCreatingSession && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
              <form onSubmit={handleCreateSession} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-500">Data</label>
                  <input 
                    type="date" 
                    required
                    value={newSessionData.date}
                    onChange={e => setNewSessionData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Início</label>
                    <input 
                      type="time" 
                      required
                      value={newSessionData.start_time}
                      onChange={e => setNewSessionData(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Fim</label>
                    <input 
                      type="time" 
                      required
                      value={newSessionData.end_time}
                      onChange={e => setNewSessionData(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-full px-2 py-1.5 border rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500">Conteúdo (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Passe e Controle"
                    value={newSessionData.topic}
                    onChange={e => setNewSessionData(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full px-2 py-1.5 border rounded text-sm"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsCreatingSession(false)} className="flex-1 py-1.5 text-xs text-slate-500 border rounded hover:bg-slate-50">Cancelar</button>
                  <button type="submit" className="flex-1 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary-dark">Criar Aula</button>
                </div>
              </form>
            </div>
          )}

          {/* Sessions List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {sessions.map(session => (
              <div 
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedSession?.id === session.id 
                    ? 'bg-primary/5 border-primary ring-1 ring-primary' 
                    : 'bg-white border-slate-200 hover:border-primary/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-slate-900 font-medium">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {new Date(session.date).toLocaleDateString('pt-BR')}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                    className="text-slate-300 hover:text-red-500"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <Clock className="w-3 h-3" />
                  {session.start_time.slice(0, 5)} - {session.end_time.slice(0, 5)}
                </div>

                {session.topic && (
                  <p className="text-sm text-slate-700 mb-3 line-clamp-2">{session.topic}</p>
                )}

                <div className="flex items-center justify-between text-xs">
                  <span className={`${(session._count?.attendances || 0) > 0 ? 'text-green-600 bg-green-50' : 'text-slate-500 bg-slate-100'} px-2 py-1 rounded-full`}>
                    {(session._count?.attendances || 0) > 0 ? 'Chamada Realizada' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}

            {sessions.length === 0 && !loading && (
              <div className="text-center py-8 text-slate-500 text-sm">
                Nenhuma aula registrada.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Attendance Sheet */}
        <div className="lg:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="font-bold text-slate-900">Lista de Presença</h2>
                  <p className="text-xs text-slate-500">
                    {new Date(selectedSession.date).toLocaleDateString('pt-BR')} • {selectedSession.topic || 'Sem tema definido'}
                  </p>
                </div>
                <button 
                  onClick={saveAttendance}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Salvando...' : 'Salvar Chamada'}
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[600px]">
                <table className="w-full">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Aluno</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-left">Obs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(student => {
                      const status = attendanceData[student.id]?.status || 'present'
                      
                      return (
                        <tr key={student.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{student.full_name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => updateStatus(student.id, 'present')}
                                className={`p-2 rounded-lg transition-colors flex flex-col items-center gap-1 ${
                                  status === 'present' ? 'bg-green-100 text-green-700 ring-2 ring-green-500 ring-offset-1' : 'text-slate-400 hover:bg-slate-100'
                                }`}
                                title="Presente"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-[10px] font-bold">P</span>
                              </button>
                              
                              <button
                                onClick={() => updateStatus(student.id, 'absent')}
                                className={`p-2 rounded-lg transition-colors flex flex-col items-center gap-1 ${
                                  status === 'absent' ? 'bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-1' : 'text-slate-400 hover:bg-slate-100'
                                }`}
                                title="Ausente"
                              >
                                <XCircle className="w-5 h-5" />
                                <span className="text-[10px] font-bold">F</span>
                              </button>

                              <button
                                onClick={() => updateStatus(student.id, 'excused')}
                                className={`p-2 rounded-lg transition-colors flex flex-col items-center gap-1 ${
                                  status === 'excused' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500 ring-offset-1' : 'text-slate-400 hover:bg-slate-100'
                                }`}
                                title="Justificado"
                              >
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-[10px] font-bold">J</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text"
                              placeholder="Obs..."
                              value={attendanceData[student.id]?.notes || ''}
                              onChange={(e) => setAttendanceData(prev => ({
                                ...prev,
                                [student.id]: { ...prev[student.id], notes: e.target.value }
                              }))}
                              className="w-full text-xs border-b border-transparent focus:border-primary outline-none bg-transparent py-1"
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-8">
              <Calendar className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">Selecione uma aula para fazer a chamada</p>
              <p className="text-sm">Ou crie uma nova aula no menu ao lado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
