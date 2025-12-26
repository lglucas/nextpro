import { Plus, Trash2 } from 'lucide-react'
import type { PreCadastroChild } from '@/features/preCadastro/types'

function createEmptyChild(): PreCadastroChild {
  return {
    id: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    fullName: '',
    birthDate: '',
    gender: '',
    position: '',
    schoolName: '',
    schoolGrade: '',
    trainsAtSchool: true,
  }
}

export function ChildrenStep({
  value,
  onChange,
}: {
  value: PreCadastroChild[]
  onChange: (next: PreCadastroChild[]) => void
}) {
  const canAdd = value.length < 8

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900">Filhos</p>
          <p className="mt-1 text-sm text-slate-600">Cadastre até 8 filhos no total.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!canAdd) return
            onChange([...value, createEmptyChild()])
          }}
          disabled={!canAdd}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Adicionar filho
        </button>
      </div>

      {value.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-600">Nenhum filho adicionado ainda.</p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {value.map((child, index) => (
          <div key={child.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">Filho {index + 1}</p>
                <p className="mt-1 text-sm text-slate-600">Informações básicas e escolaridade.</p>
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((c) => c.id !== child.id))}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Remover
              </button>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Nome completo</label>
                <input
                  value={child.fullName}
                  onChange={(e) =>
                    onChange(value.map((c) => (c.id === child.id ? { ...c, fullName: e.target.value } : c)))
                  }
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Data de nascimento</label>
                <input
                  value={child.birthDate}
                  onChange={(e) =>
                    onChange(value.map((c) => (c.id === child.id ? { ...c, birthDate: e.target.value } : c)))
                  }
                  type="date"
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Gênero</label>
                <select
                  value={child.gender}
                  onChange={(e) =>
                    onChange(value.map((c) => (c.id === child.id ? { ...c, gender: e.target.value as PreCadastroChild['gender'] } : c)))
                  }
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Posição</label>
                <input
                  value={child.position}
                  onChange={(e) =>
                    onChange(value.map((c) => (c.id === child.id ? { ...c, position: e.target.value } : c)))
                  }
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Ex.: atacante, zagueiro..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Série</label>
                <input
                  value={child.schoolGrade}
                  onChange={(e) =>
                    onChange(value.map((c) => (c.id === child.id ? { ...c, schoolGrade: e.target.value } : c)))
                  }
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Ex.: 6º ano"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Escola onde estuda</label>
                <input
                  value={child.schoolName}
                  onChange={(e) =>
                    onChange(value.map((c) => (c.id === child.id ? { ...c, schoolName: e.target.value } : c)))
                  }
                  className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  id={`trains-${child.id}`}
                  type="checkbox"
                  checked={child.trainsAtSchool}
                  onChange={(e) =>
                    onChange(value.map((c) => (c.id === child.id ? { ...c, trainsAtSchool: e.target.checked } : c)))
                  }
                  className="w-4 h-4"
                />
                <label htmlFor={`trains-${child.id}`} className="text-sm text-slate-700">
                  Treina na escolinha
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
