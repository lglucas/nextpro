import type { NucleusRow, SchoolNucleusRow, SchoolRow, SeasonRow } from '@/features/admin/components/engines/types'

export function SchoolNucleiMapPanel({
  seasons,
  nuclei,
  schools,
  schoolNuclei,
  selectedSeasonId,
  onSeasonChange,
  onUpsert,
}: {
  seasons: SeasonRow[]
  nuclei: NucleusRow[]
  schools: SchoolRow[]
  schoolNuclei: SchoolNucleusRow[]
  selectedSeasonId: string | null
  onSeasonChange: (id: string | null) => void
  onUpsert: (schoolId: string, nucleusId: string | null) => void
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Vínculo escola → núcleo</p>
        <select value={selectedSeasonId || ''} onChange={(e) => onSeasonChange(e.target.value || null)} className="text-sm border border-slate-200 rounded-lg px-2 py-2">
          <option value="">Selecione a temporada</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.year}
              {s.is_active ? ' (ativa)' : ''}
            </option>
          ))}
        </select>
      </div>

      {!selectedSeasonId ? <p className="text-sm text-slate-500">Selecione uma temporada para configurar os núcleos.</p> : null}

      {selectedSeasonId ? (
        <div className="space-y-2">
          {schools.map((school) => {
            const current = schoolNuclei.find((r) => r.school_id === school.id && r.season_id === selectedSeasonId) || null
            return (
              <div key={school.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-900">{school.name}</p>
                <select
                  value={current?.nucleus_id || ''}
                  onChange={(e) => onUpsert(school.id, e.target.value || null)}
                  className="text-sm border border-slate-200 rounded-lg px-2 py-2 min-w-[200px]"
                >
                  <option value="">Sem núcleo</option>
                  {nuclei
                    .filter((n) => n.active)
                    .map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                </select>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

