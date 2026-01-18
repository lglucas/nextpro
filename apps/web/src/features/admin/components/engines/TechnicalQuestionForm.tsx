import { PILLARS, POSITIONS } from '@/features/admin/components/engines/types'

export function TechnicalQuestionForm({
  value,
  selectedPosition,
  disabled,
  onChange,
  onSubmit,
}: {
  value: {
    kind: 'base' | 'position'
    slot: 1 | 2 | 3
    position: string
    pillar: 'tecnica' | 'tatica' | 'mental' | 'fisico'
    key: string
    prompt: string
    sort_order: number
    active: boolean
  }
  selectedPosition: string
  disabled: boolean
  onChange: (next: {
    kind: 'base' | 'position'
    slot: 1 | 2 | 3
    position: string
    pillar: 'tecnica' | 'tatica' | 'mental' | 'fisico'
    key: string
    prompt: string
    sort_order: number
    active: boolean
  }) => void
  onSubmit: () => void
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Adicionar pergunta</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500">Tipo</label>
          <select
            value={value.kind}
            onChange={(e) => {
              const kind = e.target.value as 'base' | 'position'
              onChange({ ...value, kind, slot: kind === 'base' ? 1 : 2 })
            }}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            disabled={disabled}
          >
            <option value="base">Base</option>
            <option value="position">Por posição</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500">Slot</label>
          <select
            value={value.kind === 'base' ? 1 : value.slot}
            onChange={(e) => onChange({ ...value, slot: parseInt(e.target.value) as 1 | 2 | 3 })}
            disabled={disabled || value.kind === 'base'}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm disabled:opacity-50"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>

        {value.kind === 'position' ? (
          <div className="sm:col-span-2">
            <label className="block text-xs text-slate-500">Posição</label>
            <select
              value={value.position || selectedPosition}
              onChange={(e) => onChange({ ...value, position: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              disabled={disabled}
            >
              {POSITIONS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-500">Pilar</label>
          <select
            value={value.pillar}
            onChange={(e) => onChange({ ...value, pillar: e.target.value as 'tecnica' | 'tatica' | 'mental' | 'fisico' })}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            disabled={disabled}
          >
            {PILLARS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-500">Key</label>
          <input
            value={value.key}
            onChange={(e) => onChange({ ...value, key: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            disabled={disabled}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-500">Pergunta</label>
          <input
            value={value.prompt}
            onChange={(e) => onChange({ ...value, prompt: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Ordem</label>
          <input
            type="number"
            value={value.sort_order}
            onChange={(e) => onChange({ ...value, sort_order: parseInt(e.target.value) })}
            className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            disabled={disabled}
          />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={value.active} onChange={(e) => onChange({ ...value, active: e.target.checked })} className="rounded border-slate-300" disabled={disabled} />
            Ativa
          </label>
        </div>
      </div>
      <div className="mt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
        >
          Salvar pergunta
        </button>
      </div>
    </div>
  )
}
