import { useState } from 'react'
import { Plus, Search, FileDown, MapPin, Building2, Pencil, Trash2, X } from 'lucide-react'
import { generateSchoolsReport } from '@/utils/pdf'

// Mock Data Type
interface School {
  id: string
  name: string
  document: string
  address: string
  active: boolean
  studentsCount: number
}

const MOCK_SCHOOLS: School[] = [
  { id: '1', name: 'Escolinha do Zico - Unidade RJ', document: '12.345.678/0001-90', address: 'Av. das Américas, 1000', active: true, studentsCount: 150 },
  { id: '2', name: 'Ronaldo Academy - SP', document: '98.765.432/0001-10', address: 'Rua Funchal, 500', active: true, studentsCount: 85 },
  { id: '3', name: 'NextPro Training Center', document: '45.678.901/0001-23', address: 'Centro Esportivo, S/N', active: false, studentsCount: 0 },
]

export function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>(MOCK_SCHOOLS)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  
  // Form States
  const [formData, setFormData] = useState({ name: '', document: '', address: '' })

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.document.includes(searchTerm)
  )

  const handleExportPDF = () => {
    generateSchoolsReport(filteredSchools)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta escola?')) {
      setSchools(prev => prev.filter(s => s.id !== id))
    }
  }

  const handleEdit = (school: School) => {
    setEditingSchool(school)
    setFormData({ name: school.name, document: school.document, address: school.address })
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingSchool(null)
    setFormData({ name: '', document: '', address: '' })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingSchool) {
      // Edit
      setSchools(prev => prev.map(s => 
        s.id === editingSchool.id 
          ? { ...s, ...formData }
          : s
      ))
    } else {
      // Add
      const newSchool: School = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        active: true,
        studentsCount: 0
      }
      setSchools(prev => [...prev, newSchool])
    }
    setIsModalOpen(false)
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
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Escola
          </button>
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
                    {school.address}
                  </span>
                  <span>•</span>
                  <span>{school.studentsCount} alunos</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
              <button 
                onClick={() => handleEdit(school)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </button>
              <button 
                onClick={() => handleDelete(school.id)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Excluir
              </button>
            </div>
          </div>
        ))}

        {filteredSchools.length === 0 && (
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
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Documento (CNPJ/CPF)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.document}
                  onChange={e => setFormData(prev => ({ ...prev, document: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
