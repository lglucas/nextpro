type Props = {
  fullName: string
  photoUrl: string | null
  initials: string
  schoolName: string | null
  level: number
  xpTotal: number
  xpIntoLevel: number
  xpForNext: number
  pct: number
}

export function StudentFutCard({ fullName, photoUrl, initials, schoolName, level, xpTotal, xpIntoLevel, xpForNext, pct }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center text-white font-bold">
              {photoUrl ? <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" /> : <span>{initials || 'NP'}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold truncate">{fullName}</p>
              <p className="text-white/70 text-xs">FUT Card • {schoolName || '—'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs">Nível</p>
            <p className="text-white text-3xl font-extrabold leading-none">{level}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>{xpTotal} XP</span>
            <span>
              {xpIntoLevel}/{xpForNext}
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-2 bg-amber-400" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}

