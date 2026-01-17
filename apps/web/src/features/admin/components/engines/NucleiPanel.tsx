import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { NucleusRow, SchoolNucleusRow, SchoolRow, SeasonRow } from '@/features/admin/components/engines/types'
import { NucleiCreatePanel } from '@/features/admin/components/engines/NucleiCreatePanel'
import { SchoolNucleiMapPanel } from '@/features/admin/components/engines/SchoolNucleiMapPanel'

export function NucleiPanel() {
  const [loading, setLoading] = useState(false)
  const [seasons, setSeasons] = useState<SeasonRow[]>([])
  const [nuclei, setNuclei] = useState<NucleusRow[]>([])
  const [schools, setSchools] = useState<SchoolRow[]>([])
  const [schoolNuclei, setSchoolNuclei] = useState<SchoolNucleusRow[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    uf: '',
    city: '',
    active: true,
  })

  const fetchBase = useCallback(async () => {
    setLoading(true)
    const [{ data: seasonsData, error: seasonsError }, { data: nucleiData, error: nucleiError }, { data: schoolsData, error: schoolsError }] = await Promise.all([
      supabase.from('seasons').select('*').order('year', { ascending: false }),
      supabase.from('nuclei').select('*').order('name', { ascending: true }),
      supabase.from('schools').select('id, name').order('name', { ascending: true }),
    ])

    if (seasonsError) alert(seasonsError.message)
    if (nucleiError) alert(nucleiError.message)
    if (schoolsError) alert(schoolsError.message)

    const nextSeasons = (seasonsData || []) as unknown as SeasonRow[]
    setSeasons(nextSeasons)
    setNuclei((nucleiData || []) as unknown as NucleusRow[])
    setSchools((schoolsData || []) as unknown as SchoolRow[])
    if (!selectedSeasonId) {
      const nextActive = nextSeasons.find((s) => s.is_active)
      if (nextActive) setSelectedSeasonId(nextActive.id)
    }
    setLoading(false)
  }, [selectedSeasonId])

  const fetchSchoolNuclei = useCallback(async (seasonId: string) => {
    const { data, error } = await supabase.from('school_nuclei').select('*').eq('season_id', seasonId)
    if (error) {
      alert(error.message)
      setSchoolNuclei([])
      return
    }
    setSchoolNuclei((data || []) as unknown as SchoolNucleusRow[])
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchBase()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchBase])

  useEffect(() => {
    if (!selectedSeasonId) return
    const timeoutId = window.setTimeout(() => {
      void fetchSchoolNuclei(selectedSeasonId)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchSchoolNuclei, selectedSeasonId])

  const saveNucleus = async () => {
    if (!form.name.trim()) {
      alert('Nome é obrigatório.')
      return
    }

    const payload = {
      name: form.name.trim(),
      uf: form.uf.trim() ? form.uf.trim() : null,
      city: form.city.trim() ? form.city.trim() : null,
      active: form.active,
    }

    const { error } = await supabase.from('nuclei').insert(payload)
    if (error) {
      alert(error.message)
      return
    }

    await fetchBase()
    setForm({ name: '', uf: '', city: '', active: true })
  }

  const upsertSchoolNucleus = async (schoolId: string, nucleusId: string | null) => {
    if (!selectedSeasonId) return
    const existing = schoolNuclei.find((r) => r.school_id === schoolId && r.season_id === selectedSeasonId) || null

    if (!nucleusId) {
      if (!existing) return
      const { error } = await supabase.from('school_nuclei').delete().eq('id', existing.id)
      if (error) {
        alert(error.message)
        return
      }
      await fetchSchoolNuclei(selectedSeasonId)
      return
    }

    const payload = {
      id: existing?.id,
      school_id: schoolId,
      nucleus_id: nucleusId,
      season_id: selectedSeasonId,
    }

    const { error } = await supabase.from('school_nuclei').upsert(payload, { onConflict: 'school_id,season_id' })
    if (error) {
      alert(error.message)
      return
    }
    await fetchSchoolNuclei(selectedSeasonId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <NucleiCreatePanel form={form} nuclei={nuclei} loading={loading} onChange={setForm} onRefresh={fetchBase} onSave={saveNucleus} />
      <SchoolNucleiMapPanel
        seasons={seasons}
        nuclei={nuclei}
        schools={schools}
        schoolNuclei={schoolNuclei}
        selectedSeasonId={selectedSeasonId}
        onSeasonChange={setSelectedSeasonId}
        onUpsert={(schoolId, nucleusId) => void upsertSchoolNucleus(schoolId, nucleusId)}
      />
    </div>
  )
}

