import type { NucleusRow } from '@/features/admin/components/engines/types'

export function NucleiCreatePanel({
  form,
  nuclei,
  loading,
  onChange,
  onRefresh,
  onSave,
}: {
  form: { name: string; uf: string; city: string; active: boolean }
  nuclei: NucleusRow[]
  loading: boolean
  onChange: (next: { name: string; uf: string; city: string; active: boolean }) => void
  onRefresh: () => void
  onSave: () => void
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Criar núcleo</p>
        <button type="button" onClick={onRefresh} className="text-sm text-primary hover:underline">
          Atualizar
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs text-slate-500">Nome</label>
          <input value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500">UF</label>
          <input value={form.uf} onChange={(e) => onChange({ ...form, uf: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs text-slate-500">Cidade</label>
          <input value={form.city} onChange={(e) => onChange({ ...form, city: e.target.value })} className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.active} onChange={(e) => onChange({ ...form, active: e.target.checked })} className="rounded border-slate-300" />
            Ativo
          </label>
        </div>
      </div>
      <button type="button" onClick={onSave} disabled={loading} className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50">
        Salvar núcleo
      </button>

      <div className="pt-3 border-t border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Núcleos cadastrados</p>
        <div className="mt-3 space-y-2">
          {nuclei.length === 0 ? <p className="text-sm text-slate-500">Nenhum núcleo cadastrado.</p> : null}
          {nuclei.map((n) => (
            <div key={n.id} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{n.name}</p>
                <p className="text-xs text-slate-500 truncate">{[n.city, n.uf].filter(Boolean).join(' / ') || '—'}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${n.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {n.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

