import type { TechnicalMonthlyQuestionRow } from '@/features/admin/components/engines/types'
import { PILLARS } from '@/features/admin/components/engines/types'

export function MonthlyQuestionsList({
  title,
  questions,
  onToggleActive,
  onDelete,
}: {
  title: string
  questions: TechnicalMonthlyQuestionRow[]
  onToggleActive: (id: string, next: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <div className="mt-3 space-y-2">
        {questions.length === 0 ? <p className="text-sm text-slate-500">Nenhuma pergunta cadastrada.</p> : null}
        {questions.map((q) => (
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
  )
}
