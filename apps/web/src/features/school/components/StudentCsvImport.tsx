import { useMemo, useState } from 'react'
import { Download, FileUp, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { inferCsvDelimiter, parseCsv, toIsoDate } from '@/features/school/utils/csv'
import { buildCsvTemplate, importStudentCsvRows, mapImportRow, validateImportRows } from '@/features/school/services/studentCsvImport'

type SchoolOption = { id: string; name: string }

function downloadTemplate() {
  const content = buildCsvTemplate(';')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-import-alunos.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function readFileAsText(file: File) {
  return await file.text()
}

export function StudentCsvImport({
  role,
  userSchoolId,
  schools,
  onImported,
}: {
  role: string | null
  userSchoolId: string | null
  schools: SchoolOption[]
  onImported: () => Promise<void>
}) {
  const [selectedSchoolId, setSelectedSchoolId] = useState('')
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([])
  const [runtimeErrors, setRuntimeErrors] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<null | { insertedStudents: number; createdGuardians: number; skippedDuplicates: number }>(null)

  const effectiveSchoolId = role === 'super_admin' ? selectedSchoolId : userSchoolId || ''
  const rows = useMemo(() => parsedRows.map((r) => mapImportRow(r, role, effectiveSchoolId)), [effectiveSchoolId, parsedRows, role])
  const validationErrors = useMemo(() => validateImportRows(rows), [rows])
  const missingSchoolForSuperAdmin = role === 'super_admin' && !effectiveSchoolId && parsedRows.length > 0
  const errors = useMemo(() => {
    const filteredValidationErrors = missingSchoolForSuperAdmin
      ? validationErrors.filter((e) => !e.includes('school_id ausente'))
      : validationErrors

    const merged = [...filteredValidationErrors, ...runtimeErrors]
    if (missingSchoolForSuperAdmin) {
      merged.unshift('Selecione uma escola acima (ou preencha a coluna school_id no CSV).')
    }
    return merged
  }, [missingSchoolForSuperAdmin, runtimeErrors, validationErrors])
  const previewRows = useMemo(() => rows.slice(0, 10), [rows])

  const handleFile = async (file: File) => {
    setResult(null)
    setRuntimeErrors([])
    setParsedRows([])

    const text = await readFileAsText(file)
    const firstLine = text.split(/\r?\n/)[0] || ''
    const delimiter = inferCsvDelimiter(firstLine)
    const parsed = parseCsv(text, delimiter)

    if (parsed.headers.length === 0) {
      setRuntimeErrors(['CSV vazio ou inválido.'])
      return
    }

    setParsedRows(parsed.rows)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Importação via CSV</h2>
          <p className="text-sm text-slate-600">Importa alunos e cria responsáveis quando necessário.</p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50"
        >
          <Download className="w-4 h-4" />
          Baixar template
        </button>
      </div>

      {role === 'super_admin' ? (
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Escola padrão (se o CSV não tiver school_id)</label>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value="">Selecione uma escola...</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Arquivo CSV</label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void handleFile(f)
            }}
            className="block w-full text-sm text-slate-700"
          />
          <FileUp className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {errors.length > 0 ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Ajustes necessários</p>
              <ul className="mt-2 text-sm text-amber-800 list-disc pl-5 space-y-1">
                {errors.slice(0, 8).map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              {errors.length > 8 ? <p className="mt-2 text-xs text-amber-700">+{errors.length - 8} erros</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-900">Preview (10 primeiras linhas)</p>
          <div className="mt-3 overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-2">Aluno</th>
                  <th className="px-4 py-2">Nascimento</th>
                  <th className="px-4 py-2">Responsável</th>
                  <th className="px-4 py-2">Telefone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewRows.map((r, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{r.student_full_name}</td>
                    <td className="px-4 py-2">{toIsoDate(r.student_birth_date) || r.student_birth_date}</td>
                    <td className="px-4 py-2">{r.guardian_full_name}</td>
                    <td className="px-4 py-2">{r.guardian_phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Linhas carregadas: <span className="font-semibold text-slate-900">{rows.length}</span>
            </p>
            <button
              type="button"
              disabled={busy || errors.length > 0 || (role === 'super_admin' && !effectiveSchoolId)}
              onClick={async () => {
                setBusy(true)
                setResult(null)
                try {
                  const res = await importStudentCsvRows(rows)
                  setResult(res)
                  await onImported()
                } catch (e: unknown) {
                  const message = e instanceof Error ? e.message : 'Erro ao importar CSV'
                  setRuntimeErrors([message])
                } finally {
                  setBusy(false)
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {busy ? 'Importando...' : 'Importar agora'}
            </button>
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-900">Importação concluída</p>
          <p className="mt-2 text-sm text-green-800">
            Alunos inseridos: <span className="font-semibold">{result.insertedStudents}</span> • Responsáveis criados:{' '}
            <span className="font-semibold">{result.createdGuardians}</span> • Duplicados no CSV:{' '}
            <span className="font-semibold">{result.skippedDuplicates}</span>
          </p>
        </div>
      ) : null}
    </div>
  )
}

