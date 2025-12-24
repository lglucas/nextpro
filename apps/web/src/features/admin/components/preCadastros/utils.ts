import type { PreCadastroSummary, PreRegistrationRow } from '@/features/admin/components/preCadastros/types'

function getString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function parseSafeJson(value: unknown) {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

export function extractPreCadastroSummary(row: PreRegistrationRow): PreCadastroSummary {
  const data = parseSafeJson(row.data)
  const guardian = parseSafeJson(data.guardian)
  const school = parseSafeJson(data.school)
  const children = Array.isArray(data.children) ? data.children : []

  return {
    guardianName: getString(guardian.fullName),
    guardianEmail: getString(guardian.email),
    uf: getString(school.uf),
    city: getString(school.city),
    schoolName: getString(school.name),
    childrenCount: children.length,
  }
}

export function preCadastroMatchesQuery(row: PreRegistrationRow, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const s = extractPreCadastroSummary(row)
  const haystack = [
    row.user_id,
    row.status,
    s.guardianName,
    s.guardianEmail,
    s.uf,
    s.city,
    s.schoolName,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

