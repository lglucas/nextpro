import type { PreCadastroSchoolInfo } from '@/features/preCadastro/types'

const UF_OPTIONS = [
  '', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export function SchoolStep({
  value,
  onChange,
  disabled,
}: {
  value: PreCadastroSchoolInfo
  onChange: (next: PreCadastroSchoolInfo) => void
  disabled?: boolean
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">UF</label>
        <select
          value={value.uf}
          onChange={(e) => onChange({ ...value, uf: e.target.value })}
          disabled={disabled}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {UF_OPTIONS.map((uf) => (
            <option key={uf || 'empty'} value={uf}>
              {uf || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Cidade</label>
        <input
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          disabled={disabled}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Cidade"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700">Nome da escolinha</label>
        <input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          disabled={disabled}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Nome da escolinha"
        />
        <p className="mt-2 text-xs text-slate-500">
          Se a escolinha ainda não existir no sistema, registramos esta informação e o projeto valida depois.
        </p>
      </div>
    </div>
  )
}
