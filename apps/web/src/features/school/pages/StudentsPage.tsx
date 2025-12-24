import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { UserPlus, Search, Edit, Save, X, Phone, UserCheck, Shield } from 'lucide-react'

interface Guardian {
  id: string
  full_name: string
  cpf: string
  phone: string
  email: string
}

interface Student {
  id: string
  full_name: string
  birth_date: string
  guardian_id: string
  guardian?: Guardian // Join
  category: string
  active: boolean
  class_students?: Array<{
    class?: {
      name: string
    } | null
  }>
}

interface School {
  id: string
  name: string
}

export function StudentsPage() {
  const { user, role } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null)
  const [schools, setSchools] = useState<School[]>([]) 
  
  // State para Busca de Responsável
  const [guardianSearchTerm, setGuardianSearchTerm] = useState('')
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null)
  const [isCreatingGuardian, setIsCreatingGuardian] = useState(false)

  // Form Data (Aluno)
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    blood_type: '',
    allergies: '',
    school_id: ''
  })

  // Form Data (Novo Responsável)
  const [guardianForm, setGuardianForm] = useState({
    full_name: '',
    cpf: '',
    phone: '',
    email: ''
  })

  const fetchStudents = useCallback(async () => {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        guardian:guardians (
          id,
          full_name,
          phone,
          email
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) console.error('Erro ao buscar alunos:', error)
    else setStudents(data || [])
  }, [])

  const fetchGuardians = useCallback(async () => {
    const { data, error } = await supabase
      .from('guardians')
      .select('*')
      .order('full_name', { ascending: true })
      
    if (!error && data) setGuardians(data)
  }, [])

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

      await fetchStudents()
      await fetchGuardians()

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchGuardians, fetchStudents, role, user])

  useEffect(() => {
    fetchProfileAndData()
  }, [fetchProfileAndData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGuardianInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGuardianForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateGuardian = async () => {
    // Validação básica
    if (!guardianForm.full_name || !guardianForm.phone) {
      alert('Nome e Telefone do responsável são obrigatórios')
      return
    }

    try {
      const payload = {
        ...guardianForm,
        school_id: userSchoolId || formData.school_id
      }
      
      const { data, error } = await supabase
        .from('guardians')
        .insert(payload)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setGuardians(prev => [...prev, data])
        setSelectedGuardian(data)
        setIsCreatingGuardian(false)
        alert('Responsável criado e selecionado!')
      }
    } catch (error) {
      console.error('Erro ao criar responsável:', error)
      alert('Erro ao criar responsável. Verifique se o CPF já existe.')
    }
  }

  const validateForm = () => {
    if (!formData.full_name.trim()) return 'Nome completo é obrigatório'
    if (!formData.birth_date) return 'Data de nascimento é obrigatória'
    if (!selectedGuardian) return 'Selecione um responsável para o aluno'
    
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
        school_id: userSchoolId || formData.school_id,
        guardian_id: selectedGuardian?.id,
        category: calculateCategory(formData.birth_date)
      }

      const { error } = await supabase.from('students').insert(payload)

      if (error) throw error

      alert('Aluno cadastrado com sucesso!')
      setIsCreating(false)
      setSelectedGuardian(null)
      fetchStudents()
      
      // Reset form
      setFormData({
        full_name: '',
        birth_date: '',
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
    return `Sub-${Math.ceil(age / 2) * 2}`
  }

  // Filter guardians for search
  const filteredGuardians = guardians.filter(g => 
    g.full_name.toLowerCase().includes(guardianSearchTerm.toLowerCase()) ||
    g.cpf?.includes(guardianSearchTerm)
  )

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
            <h3 className="text-lg font-semibold text-slate-900">Novo Cadastro de Aluno</h3>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ETAPA 1: RESPONSÁVEL */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                1. Responsável Legal
              </h4>
              
              {!selectedGuardian ? (
                <div className="space-y-4">
                  {!isCreatingGuardian ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Buscar Responsável (Nome ou CPF)</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input 
                              type="text"
                              value={guardianSearchTerm}
                              onChange={(e) => setGuardianSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                              placeholder="Digite para buscar..."
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsCreatingGuardian(true)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
                          >
                            + Novo
                          </button>
                        </div>
                      </div>
                      
                      {/* Resultados da Busca */}
                      {guardianSearchTerm && (
                        <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white divide-y divide-slate-100">
                          {filteredGuardians.length > 0 ? filteredGuardians.map(g => (
                            <div 
                              key={g.id} 
                              onClick={() => setSelectedGuardian(g)}
                              className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-900">{g.full_name}</p>
                                <p className="text-xs text-slate-500">CPF: {g.cpf || 'N/A'} • Tel: {g.phone}</p>
                              </div>
                              <UserCheck className="w-4 h-4 text-slate-400" />
                            </div>
                          )) : (
                            <div className="p-4 text-center text-sm text-slate-500">Nenhum responsável encontrado.</div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    // Form de Criação Rápida de Responsável
                    <div className="bg-white p-4 rounded border border-slate-200 space-y-3 animate-in fade-in">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-semibold text-slate-800">Novo Responsável</h5>
                        <button type="button" onClick={() => setIsCreatingGuardian(false)} className="text-xs text-slate-500 hover:text-red-500">Cancelar</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          name="full_name"
                          placeholder="Nome Completo *"
                          value={guardianForm.full_name}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                        <input 
                          name="cpf"
                          placeholder="CPF"
                          value={guardianForm.cpf}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                        <input 
                          name="phone"
                          placeholder="Telefone *"
                          value={guardianForm.phone}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                        <input 
                          name="email"
                          placeholder="Email"
                          value={guardianForm.email}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleCreateGuardian}
                        className="w-full py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-900"
                      >
                        Salvar Responsável
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Card do Responsável Selecionado
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                      {selectedGuardian.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedGuardian.full_name}</p>
                      <p className="text-xs text-slate-600">CPF: {selectedGuardian.cpf || '---'} • {selectedGuardian.phone}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedGuardian(null)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 hover:bg-red-50 rounded"
                  >
                    Trocar
                  </button>
                </div>
              )}
            </div>

            {/* ETAPA 2: DADOS DO ALUNO */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" />
                2. Dados do Aluno
              </h4>
              
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

              {/* Saúde (Opcional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                Concluir Cadastro
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
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Turmas</th>
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
                      <div className="flex flex-wrap gap-1">
                        {student.class_students && student.class_students.length > 0 ? (
                          student.class_students.map((cs, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded border border-purple-100">
                              {cs.class?.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Sem turma</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{student.guardian?.full_name || '---'}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {student.guardian?.phone || '---'}
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
