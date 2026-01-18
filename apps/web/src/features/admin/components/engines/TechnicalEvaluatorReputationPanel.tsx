import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type ProfileRow = {
  id: string
  full_name: string | null
  email: string | null
  role: string
}

type ReputationRow = {
  actor_id: string
  weight: number
  shadow_banned: boolean
  updated_at: string
}

export function TechnicalEvaluatorReputationPanel() {
  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [reputations, setReputations] = useState<ReputationRow[]>([])
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [edits, setEdits] = useState<Record<string, { weight: number; shadow_banned: boolean }>>({})

  const fetchAll = useCallback(async () => {
    setLoading(true)
    const [{ data: profilesData }, { data: repsData }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['coach', 'school_admin', 'super_admin'])
        .order('created_at', { ascending: false }),
      supabase.from('technical_evaluator_reputation').select('actor_id, weight, shadow_banned, updated_at').order('updated_at', { ascending: false }),
    ])

    const nextProfiles = (profilesData as unknown as ProfileRow[]) ?? []
    const nextReps = (repsData as unknown as ReputationRow[]) ?? []
    const repByActor = new Map<string, ReputationRow>()
    nextReps.forEach((r) => repByActor.set(r.actor_id, r))

    const nextEdits: Record<string, { weight: number; shadow_banned: boolean }> = {}
    nextProfiles.forEach((p) => {
      const rep = repByActor.get(p.id) ?? null
      nextEdits[p.id] = { weight: rep?.weight ?? 1, shadow_banned: rep?.shadow_banned ?? false }
    })

    setProfiles(nextProfiles)
    setReputations(nextReps)
    setEdits(nextEdits)
    setLoading(false)
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAll()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchAll])

  const byActor = useMemo(() => {
    const map = new Map<string, ReputationRow>()
    reputations.forEach((r) => map.set(r.actor_id, r))
    return map
  }, [reputations])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return profiles
    return profiles.filter((p) => {
      const hay = `${p.full_name ?? ''} ${p.email ?? ''} ${p.role}`.toLowerCase()
      return hay.includes(q)
    })
  }, [profiles, query])

  const saveRow = async (actorId: string, next: { weight: number; shadow_banned: boolean }) => {
    setSaving((prev) => ({ ...prev, [actorId]: true }))
    const payload = { actor_id: actorId, weight: next.weight, shadow_banned: next.shadow_banned, updated_at: new Date().toISOString() }
    const { error } = await supabase.from('technical_evaluator_reputation').upsert(payload, { onConflict: 'actor_id' })
    if (error) alert(error.message)
    await fetchAll()
    setSaving((prev) => ({ ...prev, [actorId]: false }))
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Reputação do avaliador (técnica)</p>
        <p className="mt-1 text-xs text-slate-500">Peso multiplica a contribuição do avaliador. Shadow ban zera o peso silenciosamente.</p>
        <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome/email/role…"
            className="w-full md:w-[360px] px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
          <button type="button" onClick={() => void fetchAll()} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Atualizar
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-4 py-3">Avaliador</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Peso</th>
                <th className="px-4 py-3">Shadow ban</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Carregando…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    Nenhum avaliador encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const rep = byActor.get(p.id) ?? null
                  const weight = rep?.weight ?? 1
                  const shadow = rep?.shadow_banned ?? false
                  const isSaving = Boolean(saving[p.id])
                  const next = edits[p.id] ?? { weight, shadow_banned: shadow }

                  return (
                    <Row
                      key={p.id}
                      profile={p}
                      weight={next.weight}
                      shadowBanned={next.shadow_banned}
                      saving={isSaving}
                      onChange={(patch) => setEdits((prev) => ({ ...prev, [p.id]: { ...(prev[p.id] ?? { weight, shadow_banned: shadow }), ...patch } }))}
                      onSave={(next) => saveRow(p.id, next)}
                    />
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Row({
  profile,
  weight,
  shadowBanned,
  saving,
  onChange,
  onSave,
}: {
  profile: ProfileRow
  weight: number
  shadowBanned: boolean
  saving: boolean
  onChange: (patch: Partial<{ weight: number; shadow_banned: boolean }>) => void
  onSave: (next: { weight: number; shadow_banned: boolean }) => void
}) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <p className="font-medium text-slate-900">{profile.full_name || 'Sem nome'}</p>
        <p className="text-xs text-slate-500">{profile.email || profile.id}</p>
      </td>
      <td className="px-4 py-3 text-slate-600">{profile.role}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => onChange({ weight: Number(e.target.value) })}
          className="w-[120px] px-3 py-2 border border-slate-200 rounded-lg text-sm"
          disabled={saving}
        />
      </td>
      <td className="px-4 py-3">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={shadowBanned} onChange={(e) => onChange({ shadow_banned: e.target.checked })} className="rounded border-slate-300" disabled={saving} />
          Ativo
        </label>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => onSave({ weight: 1, shadow_banned: false })}
            disabled={saving}
            className="text-xs px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => onSave({ weight: Math.max(0, weight), shadow_banned: shadowBanned })}
            disabled={saving}
            className="text-xs px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            Salvar
          </button>
        </div>
      </td>
    </tr>
  )
}
