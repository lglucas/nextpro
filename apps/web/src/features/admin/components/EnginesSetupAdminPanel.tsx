import { useState } from 'react'
import { SeasonsPanel } from '@/features/admin/components/engines/SeasonsPanel'
import { NucleiPanel } from '@/features/admin/components/engines/NucleiPanel'
import { TechnicalRubricsPanel } from '@/features/admin/components/engines/TechnicalRubricsPanel'

export function EnginesSetupAdminPanel() {
  const [tab, setTab] = useState<'seasons' | 'nuclei' | 'rubrics'>('seasons')

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-slate-900">Engines (Fundações)</h2>
        <p className="text-sm text-slate-600">Temporadas, núcleos e rubricas técnicas versionadas</p>
      </div>

      <div className="flex gap-3 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setTab('seasons')}
          className={`pb-3 px-1 text-sm font-semibold ${tab === 'seasons' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Temporadas
        </button>
        <button
          type="button"
          onClick={() => setTab('nuclei')}
          className={`pb-3 px-1 text-sm font-semibold ${tab === 'nuclei' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Núcleos
        </button>
        <button
          type="button"
          onClick={() => setTab('rubrics')}
          className={`pb-3 px-1 text-sm font-semibold ${tab === 'rubrics' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Rubricas técnicas
        </button>
      </div>

      {tab === 'seasons' ? <SeasonsPanel /> : null}
      {tab === 'nuclei' ? <NucleiPanel /> : null}
      {tab === 'rubrics' ? <TechnicalRubricsPanel /> : null}
    </div>
  )
}

