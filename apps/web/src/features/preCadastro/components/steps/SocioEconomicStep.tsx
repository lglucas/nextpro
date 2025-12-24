import type { PreCadastroSocioEconomic } from '@/features/preCadastro/types'

const YES_NO = ['', 'Sim', 'Não']
const HEALTH_PLAN = ['', 'Não', 'Sim — básico', 'Sim — completo']
const SAVINGS = ['', 'Não', 'Sim — pouco', 'Sim — moderado', 'Sim — alto']
const HOUSING = ['', 'Própria', 'Alugada', 'Cedida', 'Outra']
const CONTRIBUTORS = ['', '1', '2', '3', '4+']
const INCOME = ['', 'Até 1 salário', '1–2 salários', '2–3 salários', '3–5 salários', '5+ salários', 'Prefiro não informar']
const BENEFITS = ['', 'Sim', 'Não', 'Prefiro não informar']

export function SocioEconomicStep({
  value,
  onChange,
}: {
  value: PreCadastroSocioEconomic
  onChange: (next: PreCadastroSocioEconomic) => void
}) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Renda familiar (faixa)</label>
        <select
          value={value.householdIncomeRange}
          onChange={(e) => onChange({ ...value, householdIncomeRange: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {INCOME.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Pessoas que contribuem com renda</label>
        <select
          value={value.contributorsRange}
          onChange={(e) => onChange({ ...value, contributorsRange: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {CONTRIBUTORS.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Situação de moradia</label>
        <select
          value={value.housingStatus}
          onChange={(e) => onChange({ ...value, housingStatus: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {HOUSING.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Benefícios sociais</label>
        <select
          value={value.hasBenefits}
          onChange={(e) => onChange({ ...value, hasBenefits: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {BENEFITS.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Plano de saúde</label>
        <select
          value={value.healthPlanLevel}
          onChange={(e) => onChange({ ...value, healthPlanLevel: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {HEALTH_PLAN.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Poupança / investimentos</label>
        <select
          value={value.savingsLevel}
          onChange={(e) => onChange({ ...value, savingsLevel: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {SAVINGS.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Tem carro?</label>
        <select
          value={value.hasCar}
          onChange={(e) => onChange({ ...value, hasCar: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {YES_NO.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Tem moto?</label>
        <select
          value={value.hasMotorcycle}
          onChange={(e) => onChange({ ...value, hasMotorcycle: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {YES_NO.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Tem computador?</label>
        <select
          value={value.hasComputer}
          onChange={(e) => onChange({ ...value, hasComputer: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {YES_NO.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Internet em casa?</label>
        <select
          value={value.hasInternet}
          onChange={(e) => onChange({ ...value, hasInternet: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
        >
          {YES_NO.map((v) => (
            <option key={v || 'empty'} value={v}>
              {v || 'Selecione'}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700">Principal desafio para manter a criança no esporte</label>
        <input
          value={value.mainChallenge}
          onChange={(e) => onChange({ ...value, mainChallenge: e.target.value })}
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Opcional"
        />
      </div>
    </div>
  )
}

