import { useCallback, useEffect, useMemo, useState } from 'react'
import { Download, MessageSquareText, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

type ProfileSchoolRow = { school_id: string | null }

type ChargeEventRow = {
  id: string
  created_at: string
  channel: string
  template: string | null
  status_at_time: string | null
  actor_id: string | null
  student: { full_name: string } | null
  guardian: { full_name: string | null; phone: string | null } | null
  school: { name: string } | null
}

export function FinancialChargeReportPage() {
  const { user, role } = useAuth()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [rows, setRows] = useState<ChargeEventRow[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [channel, setChannel] = useState<'all' | 'whatsapp' | 'clipboard'>('all')
  const [template, setTemplate] = useState<'all' | 'default' | 'warning' | 'blocked' | 'active'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const canUsePage = role === 'school_admin' || role === 'super_admin' || role === 'partner'

  const loadSchoolId = useCallback(async () => {
    if (!user) return
    if (role !== 'school_admin') {
      setSchoolId(null)
      return
    }
    const { data, error } = await supabase.from('profiles').select('school_id').eq('id', user.id).single()
    if (error) return
    const row = data as unknown as ProfileSchoolRow
    setSchoolId(row.school_id ?? null)
  }, [role, user])

  const fetchRows = useCallback(async () => {
    if (!canUsePage) return
    setLoading(true)
    setLoadError(null)

    const base = supabase
      .from('financial_charge_events')
      .select('id, created_at, channel, template, status_at_time, actor_id, student:students(full_name), guardian:guardians(full_name, phone), school:schools(name)')
      .order('created_at', { ascending: false })
      .limit(500)

    let q = base
    if (schoolId) q = q.eq('school_id', schoolId)
    if (channel !== 'all') q = q.eq('channel', channel)
    if (template !== 'all') q = q.eq('template', template)

    if (dateFrom) {
      q = q.gte('created_at', new Date(`${dateFrom}T00:00:00`).toISOString())
    }
    if (dateTo) {
      const end = new Date(`${dateTo}T00:00:00`)
      end.setDate(end.getDate() + 1)
      q = q.lt('created_at', end.toISOString())
    }

    const { data, error } = await q
    if (error) {
      setRows([])
      setLoading(false)
      setLoadError(error.message)
      return
    }

    setRows((data || []) as unknown as ChargeEventRow[])
    setLoading(false)
  }, [canUsePage, channel, dateFrom, dateTo, schoolId, template])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSchoolId()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [loadSchoolId])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchRows()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [fetchRows])

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const studentName = r.student?.full_name || ''
      const guardianName = r.guardian?.full_name || ''
      const guardianPhone = r.guardian?.phone || ''
      const schoolName = r.school?.name || ''
      return (
        studentName.toLowerCase().includes(q) ||
        guardianName.toLowerCase().includes(q) ||
        guardianPhone.toLowerCase().includes(q) ||
        schoolName.toLowerCase().includes(q)
      )
    })
  }, [query, rows])

  const summary = useMemo(() => {
    const byChannel: Record<string, number> = {}
    const byTemplate: Record<string, number> = {}
    const byStatus: Record<string, number> = {}
    const students = new Set<string>()

    for (const r of filteredRows) {
      byChannel[r.channel] = (byChannel[r.channel] || 0) + 1
      byTemplate[r.template ?? '—'] = (byTemplate[r.template ?? '—'] || 0) + 1
      byStatus[r.status_at_time ?? '—'] = (byStatus[r.status_at_time ?? '—'] || 0) + 1
      if (r.student?.full_name) students.add(r.student.full_name)
    }

    const pick = (obj: Record<string, number>, key: string) => obj[key] || 0
    return {
      total: filteredRows.length,
      students: students.size,
      whatsapp: pick(byChannel, 'whatsapp'),
      clipboard: pick(byChannel, 'clipboard'),
      tmplDefault: pick(byTemplate, 'default'),
      tmplWarning: pick(byTemplate, 'warning'),
      tmplBlocked: pick(byTemplate, 'blocked'),
      tmplActive: pick(byTemplate, 'active'),
      statusActive: pick(byStatus, 'active'),
      statusWarning: pick(byStatus, 'warning'),
      statusBlocked: pick(byStatus, 'blocked'),
    }
  }, [filteredRows])

  const downloadCsv = async () => {
    const header = ['data_hora', 'canal', 'template', 'status', 'aluno', 'responsavel', 'telefone', 'escola', 'actor_id']
    const lines = filteredRows.map((r) => [
      new Date(r.created_at).toLocaleString('pt-BR'),
      r.channel,
      r.template ?? '',
      r.status_at_time ?? '',
      r.student?.full_name ?? '',
      r.guardian?.full_name ?? '',
      r.guardian?.phone ?? '',
      r.school?.name ?? '',
      r.actor_id ?? '',
    ])

    const csv = [header, ...lines]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cobrancas_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  if (!canUsePage) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <p className="text-sm text-slate-700">Você não tem acesso a esta página.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
            <MessageSquareText className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cobranças</h1>
            <p className="text-slate-500">Histórico de mensagens de cobrança registradas no sistema</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void downloadCsv()}
          disabled={filteredRows.length === 0}
          className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {loadError ? (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-900">{loadError}</div>
      ) : null}

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as typeof channel)}
              className="text-sm border border-slate-200 rounded px-3 py-2 bg-white"
              aria-label="Filtro de canal"
            >
              <option value="all">Canal: todos</option>
              <option value="whatsapp">Canal: WhatsApp</option>
              <option value="clipboard">Canal: copiar</option>
            </select>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as typeof template)}
              className="text-sm border border-slate-200 rounded px-3 py-2 bg-white"
              aria-label="Filtro de template"
            >
              <option value="all">Template: todos</option>
              <option value="default">Template: padrão</option>
              <option value="warning">Template: aviso</option>
              <option value="blocked">Template: bloqueio</option>
              <option value="active">Template: em dia</option>
            </select>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border border-slate-200 rounded px-3 py-2 bg-white"
              aria-label="Data inicial"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border border-slate-200 rounded px-3 py-2 bg-white"
              aria-label="Data final"
            />
            <button
              type="button"
              onClick={() => void fetchRows()}
              className="text-sm border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50"
            >
              Atualizar
            </button>
          </div>

          <div className="relative lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar aluno/responsável..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs text-slate-500">Registros</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{summary.total}</p>
          <p className="mt-1 text-xs text-slate-500">Alunos: {summary.students}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs text-slate-500">Canais</p>
          <p className="mt-1 text-sm text-slate-700">WhatsApp: <span className="font-semibold text-slate-900">{summary.whatsapp}</span></p>
          <p className="mt-1 text-sm text-slate-700">Copiar: <span className="font-semibold text-slate-900">{summary.clipboard}</span></p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs text-slate-500">Templates</p>
          <p className="mt-1 text-sm text-slate-700">Padrão: <span className="font-semibold text-slate-900">{summary.tmplDefault}</span></p>
          <p className="mt-1 text-sm text-slate-700">Aviso: <span className="font-semibold text-slate-900">{summary.tmplWarning}</span></p>
          <p className="mt-1 text-sm text-slate-700">Bloqueio: <span className="font-semibold text-slate-900">{summary.tmplBlocked}</span></p>
          <p className="mt-1 text-sm text-slate-700">Em dia: <span className="font-semibold text-slate-900">{summary.tmplActive}</span></p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <p className="text-xs text-slate-500">Status no momento</p>
          <p className="mt-1 text-sm text-slate-700">Em dia: <span className="font-semibold text-slate-900">{summary.statusActive}</span></p>
          <p className="mt-1 text-sm text-slate-700">Aviso: <span className="font-semibold text-slate-900">{summary.statusWarning}</span></p>
          <p className="mt-1 text-sm text-slate-700">Bloqueado: <span className="font-semibold text-slate-900">{summary.statusBlocked}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Canal</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Template</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aluno</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Responsável</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Escola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-600" colSpan={6}>
                    Carregando…
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-sm text-slate-600" colSpan={6}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(r.created_at).toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.channel}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.template || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{r.student?.full_name || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{r.guardian?.full_name || '—'}</div>
                      <div className="text-xs text-slate-500">{r.guardian?.phone || '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{r.school?.name || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
