import { useMemo, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { GraduationCap, Plus, Edit, Save, X, Clock, Calendar, Users, ClipboardList, UserPlus, Trash2, Search } from 'lucide-react'

interface Class {
  id: string
  school_id: string
  name: string
  category: string
  days: string[]
  start_time: string
  end_time: string
  active: boolean
  _count?: {
    class_students: number
  }
}

interface School {
  id: string
  name: string
}

type StudentRow = {
  id: string
  full_name: string
  birth_date: string | null
}

type EnrollmentRow = {
  id: string
  student_id: string
  student: StudentRow | null
}

const CATEGORIES = ['Sub-6', 'Sub-8', 'Sub-10', 'Sub-12', 'Sub-14', 'Sub-16', 'Sub-18', 'Sub-20']
const DAYS_OF_WEEK = [
  { value: 'Seg', label: 'Segunda' },
  { value: 'Ter', label: 'Terça' },
  { value: 'Qua', label: 'Quarta' },
  { value: 'Qui', label: 'Quinta' },
  { value: 'Sex', label: 'Sexta' },
  { value: 'Sab', label: 'Sábado' },
  { value: 'Dom', label: 'Domingo' }
]

export function ClassesPage() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [isStudentManagerOpen, setIsStudentManagerOpen] = useState(false)
  const [studentManagerClass, setStudentManagerClass] = useState<Class | null>(null)
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([])
  const [availableStudents, setAvailableStudents] = useState<StudentRow[]>([])
  const [studentSearch, setStudentSearch] = useState('')
  const [studentManagerBusy, setStudentManagerBusy] = useState(false)

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    days: [] as string[],
    start_time: '',
    end_time: '',
    school_id: ''
  })

  const effectiveSchoolId = userSchoolId || formData.school_id

  const fetchClasses = useCallback(async () => {
    try {
      let query = supabase.from('classes').select('*, _count:class_students(count)').order('created_at', { ascending: false })

      if (role !== 'super_admin' && effectiveSchoolId) {
        query = query.eq('school_id', effectiveSchoolId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar turmas:', error)
        setClasses([])
        alert(`Erro ao buscar turmas: ${error.message}`)
        return
      }

      const formattedData = (data || []).map(d => ({
        ...d,
        _count: { class_students: d._count?.[0]?.count || 0 } 
      }))
      
      setClasses(formattedData)
    } catch (err) {
      console.error('Erro ao processar turmas:', err)
      setClasses([])
      const error = err as { message?: string }
      alert(`Erro ao buscar turmas: ${error?.message || 'tente novamente.'}`)
    }
  }, [effectiveSchoolId, role])

  const fetchProfileAndData = useCallback(async () => {
    try {
      setLoading(true)
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('school_id')
          .eq('id', user.id)
          .single()
        
        if (profile?.school_id) {
          setUserSchoolId(profile.school_id)
          setFormData(prev => ({ ...prev, school_id: profile.school_id }))
        }
      }

      if (role === 'super_admin') {
        const { data: schoolsData } = await supabase.from('schools').select('id, name')
        if (schoolsData) setSchools(schoolsData)
      }

      await fetchClasses()

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchClasses, role, user])

  useEffect(() => {
    fetchProfileAndData()
  }, [fetchProfileAndData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDayToggle = (day: string) => {
    setFormData(prev => {
      const days = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
      return { ...prev, days }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!effectiveSchoolId) {
        alert('Seu usuário precisa estar vinculado a uma escola para criar turmas.')
        return
      }

      if (!formData.school_id && role === 'super_admin') {
        alert('Selecione uma escola')
        return
      }

      const payload = {
        ...formData,
        school_id: effectiveSchoolId,
        teacher_id: role === 'coach' ? user?.id : null,
      }

      const { error } = await supabase.from('classes').insert(payload)

      if (error) throw error

      alert('Turma criada com sucesso!')
      setIsCreating(false)
      fetchClasses()
      setFormData({
        name: '',
        category: '',
        days: [],
        start_time: '',
        end_time: '',
        school_id: userSchoolId || ''
      })

    } catch (error) {
      console.error('Erro ao salvar:', error)
      const err = error as { message?: string; code?: string }
      alert(err?.message ? `Erro ao criar turma: ${err.message}` : 'Erro ao criar turma.')
    }
  }

  const loadStudentManagerData = useCallback(async (cls: Class) => {
    setStudentManagerBusy(true)
    try {
      const { data: enrollmentRows, error: enrollmentsError } = await supabase
        .from('class_students')
        .select('id, student_id, student:students(id, full_name, birth_date)')
        .eq('class_id', cls.id)
        .order('created_at', { ascending: true })

      if (enrollmentsError) throw enrollmentsError

      const safeEnrollments = (enrollmentRows || []) as unknown as EnrollmentRow[]
      setEnrollments(safeEnrollments)

      const { data: studentsRows, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name, birth_date')
        .eq('school_id', cls.school_id)
        .order('full_name', { ascending: true })

      if (studentsError) throw studentsError

      const allStudents = (studentsRows || []) as unknown as StudentRow[]
      const enrolledIds = new Set(safeEnrollments.map((e) => e.student_id))
      setAvailableStudents(allStudents.filter((s) => !enrolledIds.has(s.id)))
    } catch (error) {
      console.error('Erro ao carregar gestão de alunos:', error)
      alert('Erro ao carregar alunos da turma.')
    } finally {
      setStudentManagerBusy(false)
    }
  }, [])

  const handleOpenStudentManager = async (cls: Class) => {
    setStudentManagerClass(cls)
    setStudentSearch('')
    setIsStudentManagerOpen(true)
    await loadStudentManagerData(cls)
  }

  const handleCloseStudentManager = () => {
    setIsStudentManagerOpen(false)
    setStudentManagerClass(null)
    setEnrollments([])
    setAvailableStudents([])
    setStudentSearch('')
    setStudentManagerBusy(false)
  }

  const handleEnrollStudent = async (studentId: string) => {
    if (!studentManagerClass) return
    setStudentManagerBusy(true)
    try {
      const { error } = await supabase.from('class_students').insert({ class_id: studentManagerClass.id, student_id: studentId })
      if (error) throw error
      await loadStudentManagerData(studentManagerClass)
      await fetchClasses()
    } catch (error) {
      console.error('Erro ao matricular aluno:', error)
      const err = error as { code?: string; message?: string }
      if (err?.code === '23505') {
        alert('Este aluno já está matriculado nesta turma.')
        return
      }
      alert(err?.message || 'Erro ao matricular aluno.')
    } finally {
      setStudentManagerBusy(false)
    }
  }

  const handleUnenrollStudent = async (enrollmentId: string) => {
    if (!studentManagerClass) return
    if (!confirm('Remover este aluno da turma?')) return
    setStudentManagerBusy(true)
    try {
      const { error } = await supabase.from('class_students').delete().eq('id', enrollmentId)
      if (error) throw error
      await loadStudentManagerData(studentManagerClass)
      await fetchClasses()
    } catch (error) {
      console.error('Erro ao remover matrícula:', error)
      const err = error as { message?: string }
      alert(err?.message || 'Erro ao remover aluno.')
    } finally {
      setStudentManagerBusy(false)
    }
  }

  const filteredAvailableStudents = useMemo(() => {
    const term = studentSearch.trim().toLowerCase()
    if (!term) return availableStudents
    return availableStudents.filter((s) => s.full_name.toLowerCase().includes(term))
  }, [availableStudents, studentSearch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Turmas</h1>
          <p className="text-slate-500">Gerencie horários e categorias de treino.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Turma
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Nova Turma</h3>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {role === 'super_admin' && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Escola</label>
                  <select 
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  >
                    <option value="">Selecione uma escola...</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Turma</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Manhã Iniciante"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horário Início</label>
                <input 
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horário Fim</label>
                <input 
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Dias da Semana</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.days.includes(day.value)
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Turma
              </button>
            </div>
          </form>
        </div>
      )}

      {classes.length === 0 && !loading && !isCreating ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma turma cadastrada</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Crie turmas para organizar seus alunos por categoria (Sub-10, Sub-13, etc).
          </p>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Criar Primeira Turma
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {cls.category}
                  </span>
                </div>
                <div className="flex gap-2">
                   <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{cls.days?.join(', ') || 'Nenhum dia'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{cls.start_time?.slice(0, 5)} - {cls.end_time?.slice(0, 5)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{cls._count?.class_students || 0} alunos</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleOpenStudentManager(cls)}
                    className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <Users className="w-3 h-3" />
                    Alunos
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/classes/${cls.id}/attendance`)}
                    className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <ClipboardList className="w-3 h-3" />
                    Chamada
                  </button>
                </div>
                <span className={`text-xs font-medium ${cls.active ? 'text-green-600' : 'text-red-600'}`}>
                  {cls.active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isStudentManagerOpen && studentManagerClass ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Alunos da turma</p>
                <p className="text-xs text-slate-500">{studentManagerClass.name}</p>
              </div>
              <button type="button" onClick={handleCloseStudentManager} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Matriculados</p>
                  <p className="text-xs text-slate-500">{enrollments.length}</p>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  {studentManagerBusy ? (
                    <div className="p-4 text-sm text-slate-600 bg-slate-50">Carregando…</div>
                  ) : enrollments.length === 0 ? (
                    <div className="p-4 text-sm text-slate-600 bg-slate-50">Nenhum aluno matriculado nesta turma.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {enrollments.map((e) => (
                        <div key={e.id} className="p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{e.student?.full_name || 'Aluno'}</p>
                            <p className="text-xs text-slate-500">
                              {e.student?.birth_date ? new Date(e.student.birth_date).toLocaleDateString('pt-BR') : 'Data de nascimento —'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnenrollStudent(e.id)}
                            disabled={studentManagerBusy}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Adicionar aluno</p>
                  <p className="text-xs text-slate-500">{availableStudents.length} disponíveis</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Buscar por nome..."
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  />
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[320px] overflow-y-auto">
                  {studentManagerBusy ? (
                    <div className="p-4 text-sm text-slate-600 bg-slate-50">Carregando…</div>
                  ) : filteredAvailableStudents.length === 0 ? (
                    <div className="p-4 text-sm text-slate-600 bg-slate-50">Nenhum aluno disponível.</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {filteredAvailableStudents.map((s) => (
                        <div key={s.id} className="p-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{s.full_name}</p>
                            <p className="text-xs text-slate-500">
                              {s.birth_date ? new Date(s.birth_date).toLocaleDateString('pt-BR') : 'Data de nascimento —'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEnrollStudent(s.id)}
                            disabled={studentManagerBusy}
                            className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 text-sm"
                          >
                            <UserPlus className="w-4 h-4" />
                            Adicionar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleCloseStudentManager}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
