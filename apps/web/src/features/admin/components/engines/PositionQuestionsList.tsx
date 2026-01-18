import { PILLARS, POSITIONS } from '@/features/admin/components/engines/types'
import type { TechnicalQuestionRow } from '@/features/admin/components/engines/types'

export function PositionQuestionsList({
  positionKey,
  questions,
  onToggleActive,
  onDelete,
}: {
  positionKey: string
  questions: TechnicalQuestionRow[]
  onToggleActive: (id: string, next: boolean) => void
  onDelete: (id: string) => void
}) {
  const label = POSITIONS.find((p) => p.key === positionKey)?.label || positionKey
  const slot2 = questions.filter((q) => q.slot === 2)
  const slot3 = questions.filter((q) => q.slot === 3)

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Por posição: {label}</p>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {[
          { slot: 2 as const, list: slot2 },
          { slot: 3 as const, list: slot3 },
        ].map(({ slot, list }) => (
          <div key={slot}>
            <p className="text-xs font-semibold text-slate-500">Slot {slot}</p>
            <div className="mt-2 space-y-2">
              {list.length === 0 ? <p className="text-sm text-slate-500">Nenhuma pergunta cadastrada.</p> : null}
              {list.map((q) => (
                <div key={q.id} className="p-3 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-900 truncate">{q.prompt}</p>
                    <p className="text-xs text-slate-500">
                      {q.key} • {PILLARS.find((p) => p.key === q.pillar)?.label || q.pillar} • ordem {q.sort_order} • {q.active ? 'ativa' : 'inativa'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => onToggleActive(q.id, !q.active)} className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-50">
                      {q.active ? 'Desativar' : 'Ativar'}
                    </button>
                    <button type="button" onClick={() => onDelete(q.id)} className="text-xs px-2 py-1 rounded border border-slate-200 text-red-700 hover:bg-red-50">
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
