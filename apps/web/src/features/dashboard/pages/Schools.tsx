import { useCallback, useEffect, useState } from 'react'
import { Plus, Search, FileDown, MapPin, Building2, Pencil, Trash2, X } from 'lucide-react'
import { generateSchoolsReport } from '@/utils/pdf'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface School {
  id: string
  name: string
  document: string | null
  address: string | null
  active: boolean
  studentsCount: number
}

export function SchoolsPage() {
  const { role } = useAuth()
  const canManage = role === 'super_admin'
  const [schools, setSchools] = useState<School[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Form States
  const [formData, setFormData] = useState({ name: '', document: '', address: '' })

  const fetchSchools = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    const { data, error } = await supabase
      .from('schools')
      .select('id, name, document, address, active, students(count)')
      .order('created_at', { ascending: false })

    if (error) {
      setSchools([])
      setLoadError(error.message)
      setLoading(false)
      return
    }

    const rows = (data || []) as unknown as Array<{
      id: string
      name: string
      document: string | null
      address: string | null
      active: boolean | null
      students?: Array<{ count: number }>
    }>

    setSchools(
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        document: r.document ?? null,
        address: r.address ?? null,
        active: r.active ?? true,
        studentsCount: r.students?.[0]?.count ?? 0,
      }))
    )

    setLoading(false)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchSchools()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSchools])

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.document || '').includes(searchTerm)
  )

  const handleExportPDF = () => {
    generateSchoolsReport(filteredSchools)
  }

  const handleDelete = async (id: string) => {
    if (!canManage) {
      alert('Você não tem permissão para excluir escolas.')
      return
    }
    if (confirm('Tem certeza que deseja excluir esta escola?')) {
      setSaving(true)
      const { error } = await supabase.from('schools').delete().eq('id', id)
      setSaving(false)
      if (error) {
        alert(`Erro ao excluir: ${error.message}`)
        return
      }
      await fetchSchools()
    }
  }

  const handleEdit = (school: School) => {
    if (!canManage) return
    setEditingSchool(school)
    setFormData({ name: school.name, document: school.document || '', address: school.address || '' })
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    if (!canManage) return
    setEditingSchool(null)
    setFormData({ name: '', document: '', address: '' })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canManage) {
      alert('Você não tem permissão para criar/editar escolas.')
      return
    }

    const payload = {
      name: formData.name.trim(),
      document: formData.document.trim() || null,
      address: formData.address.trim() || null,
    }

    setSaving(true)
    if (editingSchool) {
      const { error } = await supabase.from('schools').update(payload).eq('id', editingSchool.id)
      setSaving(false)
      if (error) {
        alert(`Erro ao salvar: ${error.message}`)
        return
      }
    } else {
      const { error } = await supabase.from('schools').insert({ ...payload, active: true })
      setSaving(false)
      if (error) {
        alert(`Erro ao criar: ${error.message}`)
        return
      }
    }
    setIsModalOpen(false)
    await fetchSchools()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Escolas & Unidades</h1>
          <p className="text-slate-500">Gerencie as unidades registradas na plataforma</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Exportar PDF
          </button>
          {canManage ? (
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Escola
            </button>
          ) : null}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou documento..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600">Carregando escolas...</p>
          </div>
        ) : null}

        {!loading && loadError ? (
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
            <p className="text-sm font-semibold text-amber-900">Não foi possível carregar as escolas</p>
            <p className="mt-1 text-sm text-amber-800">{loadError}</p>
          </div>
        ) : null}

        {filteredSchools.map(school => (
          <div key={school.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{school.name}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${school.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                    {school.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {school.address || '---'}
                  </span>
                  <span>•</span>
                  <span>{school.studentsCount} alunos</span>
                </div>
              </div>
            </div>

            {canManage ? (
              <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                <button 
                  onClick={() => handleEdit(school)}
                  disabled={saving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button 
                  onClick={() => void handleDelete(school.id)}
                  disabled={saving}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            ) : null}
          </div>
        ))}

        {!loading && !loadError && filteredSchools.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Nenhuma escola encontrada</h3>
            <p className="text-slate-500">Tente buscar com outros termos ou adicione uma nova.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-lg text-slate-900">
                {editingSchool ? 'Editar Escola' : 'Nova Escola'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Unidade</label>
                <input 
                  type="text" 
                  required
                  disabled={saving}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Documento (CNPJ/CPF)</label>
                <input 
                  type="text" 
                  disabled={saving}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.document}
                  onChange={e => setFormData(prev => ({ ...prev, document: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                <input 
                  type="text" 
                  disabled={saving}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
