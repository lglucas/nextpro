import type { PreCadastroGuardian } from '@/features/preCadastro/types'

export function GuardianStep({
  value,
  onChange,
}: {
  value: PreCadastroGuardian
  onChange: (next: PreCadastroGuardian) => void
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700">Nome completo</label>
        <input
          value={value.fullName}
          onChange={(e) => onChange({ ...value, fullName: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Nome do responsável"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">CPF</label>
        <input
          value={value.cpf}
          onChange={(e) => onChange({ ...value, cpf: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Somente números"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">WhatsApp</label>
        <input
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="(DDD) 9xxxx-xxxx"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="email@exemplo.com"
          type="email"
        />
      </div>
    </div>
  )
}

