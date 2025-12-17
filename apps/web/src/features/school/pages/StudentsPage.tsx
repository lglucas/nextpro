import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { UserPlus, Search, Edit, Trash, Save, X, Phone, Calendar, Heart } from 'lucide-react'

interface Student {
  id: string
  full_name: string
  birth_date: string
  guardian_name: string
  guardian_phone: string
  category: string
  active: boolean
}

interface School {
  id: string
  name: string
}

export function StudentsPage() {
  const { user, role } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null)
  const [schools, setSchools] = useState<School[]>([]) // Para SuperAdmin selecionar
  
  // Form Data
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    blood_type: '',
    allergies: '',
    school_id: ''
  })

  useEffect(() => {
    fetchProfileAndData()
  }, [user])

  const fetchProfileAndData = async () => {
    try {
      setLoading(true)
      
      // 1. Buscar School ID do usuário logado
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

      // 2. Se for SuperAdmin, buscar lista de escolas
      if (role === 'super_admin') {
        const { data: schoolsData } = await supabase.from('schools').select('id, name')
        if (schoolsData) setSchools(schoolsData)
      }

      // 3. Buscar Alunos
      fetchStudents()

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error('Erro ao buscar alunos:', error)
    else setStudents(data || [])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.full_name.trim()) return 'Nome completo é obrigatório'
    if (!formData.birth_date) return 'Data de nascimento é obrigatória'
    if (!formData.guardian_name.trim()) return 'Nome do responsável é obrigatório'
    
    // Validação de Telefone (simples)
    const phoneDigits = formData.guardian_phone.replace(/\D/g, '')
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      return 'Telefone inválido (deve ter DDD + número)'
    }

    // Validação de Email (se preenchido)
    if (formData.guardian_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.guardian_email)) {
        return 'Email inválido'
      }
    }

    if (!formData.school_id && role === 'super_admin') {
      return 'Selecione uma escola'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errorMsg = validateForm()
    if (errorMsg) {
      alert(errorMsg)
      return
    }

    try {
      const payload = {
        ...formData,
        school_id: userSchoolId || formData.school_id, // Prioriza o do user, senão o do form
        category: calculateCategory(formData.birth_date) // Função helper
      }

      const { error } = await supabase.from('students').insert(payload)

      if (error) throw error

      alert('Aluno cadastrado com sucesso!')
      setIsCreating(false)
      fetchStudents()
      setFormData({
        full_name: '',
        birth_date: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_email: '',
        blood_type: '',
        allergies: '',
        school_id: userSchoolId || ''
      })

    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao cadastrar aluno.')
    }
  }

  const calculateCategory = (birthDate: string) => {
    if (!birthDate) return 'N/A'
    const year = new Date(birthDate).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - year
    return `Sub-${Math.ceil(age / 2) * 2}` // Ex: 9 anos -> Sub-10, 11 anos -> Sub-12
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Alunos</h1>
          <p className="text-slate-500">
            {role === 'super_admin' ? 'Gerencie alunos de todas as unidades.' : 'Gerencie os atletas da sua escola.'}
          </p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Novo Aluno
          </button>
        )}
      </div>

      {/* Form de Criação */}
      {isCreating && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Novo Cadastro</h3>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção 1: Dados do Aluno */}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                <input 
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                />
              </div>
            </div>

            {/* Seção 2: Responsáveis */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" /> Contato do Responsável
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Responsável</label>
                  <input 
                    type="text"
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (WhatsApp)</label>
                  <input 
                    type="tel"
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Seção 3: Saúde (Opcional) */}
            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-slate-400" /> Saúde (Opcional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Sanguíneo</label>
                  <select 
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Não sei</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alergias</label>
                  <input 
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Ex: Amendoim, Dipirona..."
                  />
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
                Salvar Aluno
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Alunos */}
      {students.length === 0 && !loading && !isCreating ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum aluno cadastrado</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Comece adicionando os atletas da sua escola para gerenciar presenças e avaliações.
          </p>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Cadastrar Primeiro Aluno
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aluno</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Categoria</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Responsável</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {student.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{student.full_name}</p>
                          <p className="text-xs text-slate-500">{new Date(student.birth_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{student.guardian_name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {student.guardian_phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors mx-1">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
