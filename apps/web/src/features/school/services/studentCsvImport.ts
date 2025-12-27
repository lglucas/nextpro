import { supabase } from '@/lib/supabase'
import { normalizeCpf, normalizeCsvHeader, normalizePhone, toIsoDate } from '@/features/school/utils/csv'

export type ImportRow = {
  school_id: string
  student_full_name: string
  student_birth_date: string
  blood_type: string
  allergies: string
  guardian_full_name: string
  guardian_phone: string
  guardian_cpf: string
  guardian_email: string
}

export type ImportResult = {
  insertedStudents: number
  createdGuardians: number
  skippedDuplicates: number
}

export function buildCsvTemplate(delimiter: ',' | ';') {
  const header = [
    'school_id',
    'student_full_name',
    'student_birth_date',
    'blood_type',
    'allergies',
    'guardian_full_name',
    'guardian_phone',
    'guardian_cpf',
    'guardian_email',
  ].join(delimiter)

  const example = [
    '',
    'João da Silva',
    '15/03/2014',
    'O+',
    'Rinite',
    'Maria da Silva',
    '(11) 99999-9999',
    '123.456.789-00',
    'maria@email.com',
  ].join(delimiter)

  return `${header}\n${example}\n`
}

export function calculateCategory(birthDateIso: string) {
  if (!birthDateIso) return 'N/A'
  const year = new Date(birthDateIso).getFullYear()
  const currentYear = new Date().getFullYear()
  const age = currentYear - year
  return `Sub-${Math.ceil(age / 2) * 2}`
}

export function mapImportRow(raw: Record<string, string>, role: string | null, fallbackSchoolId: string): ImportRow {
  const normalized: Record<string, string> = {}
  Object.keys(raw).forEach((k) => {
    normalized[normalizeCsvHeader(k)] = raw[k]
  })

  const pick = (keys: string[]) => {
    for (const k of keys) {
      const val = normalized[k]
      if (typeof val === 'string' && val.trim() !== '') return val.trim()
    }
    return ''
  }

  const schoolIdFromCsv = pick(['school_id', 'escola_id'])
  const schoolId = role === 'super_admin' ? (schoolIdFromCsv || fallbackSchoolId) : fallbackSchoolId

  return {
    school_id: schoolId,
    student_full_name: pick(['student_full_name', 'aluno_nome', 'nome_aluno', 'full_name', 'nome']),
    student_birth_date: pick(['student_birth_date', 'aluno_nascimento', 'data_nascimento', 'birth_date', 'nascimento']),
    blood_type: pick(['blood_type', 'tipo_sanguineo']),
    allergies: pick(['allergies', 'alergias']),
    guardian_full_name: pick(['guardian_full_name', 'responsavel_nome', 'nome_responsavel', 'guardian_name']),
    guardian_phone: pick(['guardian_phone', 'responsavel_telefone', 'telefone_responsavel', 'phone']),
    guardian_cpf: pick(['guardian_cpf', 'responsavel_cpf', 'cpf_responsavel', 'cpf']),
    guardian_email: pick(['guardian_email', 'responsavel_email', 'email_responsavel', 'email']),
  }
}

export function validateImportRows(rows: ImportRow[]) {
  const localErrors: string[] = []
  rows.forEach((r, idx) => {
    const line = idx + 2
    if (!r.school_id) localErrors.push(`Linha ${line}: school_id ausente`)
    if (!r.student_full_name) localErrors.push(`Linha ${line}: nome do aluno ausente`)
    if (!toIsoDate(r.student_birth_date)) localErrors.push(`Linha ${line}: data de nascimento inválida`)
    if (!r.guardian_full_name) localErrors.push(`Linha ${line}: nome do responsável ausente`)
    if (!r.guardian_phone && !r.guardian_cpf) localErrors.push(`Linha ${line}: informe telefone ou CPF do responsável`)
  })
  return localErrors
}

export async function importStudentCsvRows(rows: ImportRow[]): Promise<ImportResult> {
  const result: ImportResult = { insertedStudents: 0, createdGuardians: 0, skippedDuplicates: 0 }

  const rowsBySchool = new Map<string, ImportRow[]>()
  for (const row of rows) {
    rowsBySchool.set(row.school_id, [...(rowsBySchool.get(row.school_id) ?? []), row])
  }

  for (const [schoolId, schoolRows] of rowsBySchool.entries()) {
    const { data: existingGuardians, error: guardiansError } = await supabase
      .from('guardians')
      .select('id, cpf, phone')
      .eq('school_id', schoolId)

    if (guardiansError) throw new Error(guardiansError.message)

    const cpfMap = new Map<string, string>()
    const phoneMap = new Map<string, string>()

    ;(existingGuardians || []).forEach((g: { id: string; cpf: string | null; phone: string | null }) => {
      if (g.cpf) cpfMap.set(normalizeCpf(g.cpf), g.id)
      if (g.phone) phoneMap.set(normalizePhone(g.phone), g.id)
    })

    const studentKeys = new Set<string>()
    const studentsToInsert: Array<{
      full_name: string
      birth_date: string
      blood_type: string
      allergies: string
      school_id: string
      guardian_id: string
      category: string
      active: boolean
    }> = []

    for (const row of schoolRows) {
      const birthIso = toIsoDate(row.student_birth_date)
      const studentKey = `${row.student_full_name.trim().toLowerCase()}|${birthIso}|${schoolId}`
      if (studentKeys.has(studentKey)) {
        result.skippedDuplicates += 1
        continue
      }
      studentKeys.add(studentKey)

      const cpfKey = normalizeCpf(row.guardian_cpf)
      const phoneKey = normalizePhone(row.guardian_phone)
      const guardianIdFromCpf = cpfKey ? cpfMap.get(cpfKey) : undefined
      const guardianIdFromPhone = phoneKey ? phoneMap.get(phoneKey) : undefined

      let guardianId = guardianIdFromCpf || guardianIdFromPhone || null

      if (!guardianId) {
        const payload = {
          school_id: schoolId,
          full_name: row.guardian_full_name,
          cpf: cpfKey || null,
          phone: phoneKey || null,
          email: row.guardian_email?.trim() || null,
        }

        const { data: insertedGuardian, error: insertGuardianError } = await supabase
          .from('guardians')
          .insert(payload)
          .select('id, cpf, phone')
          .single()

        if (insertGuardianError) {
          if (cpfKey) {
            const { data: existing, error: existingError } = await supabase
              .from('guardians')
              .select('id, cpf, phone')
              .eq('school_id', schoolId)
              .eq('cpf', cpfKey)
              .maybeSingle()
            if (existingError || !existing?.id) throw new Error(insertGuardianError.message)
            guardianId = existing.id
          } else if (phoneKey) {
            const { data: existing, error: existingError } = await supabase
              .from('guardians')
              .select('id, cpf, phone')
              .eq('school_id', schoolId)
              .eq('phone', phoneKey)
              .maybeSingle()
            if (existingError || !existing?.id) throw new Error(insertGuardianError.message)
            guardianId = existing.id
          } else {
            throw new Error(insertGuardianError.message)
          }
        } else {
          const createdGuardianId = insertedGuardian.id
          guardianId = createdGuardianId
          result.createdGuardians += 1
          const insertedCpf = insertedGuardian.cpf
          const insertedPhone = insertedGuardian.phone
          if (insertedCpf !== null) cpfMap.set(normalizeCpf(insertedCpf), createdGuardianId)
          if (insertedPhone !== null) phoneMap.set(normalizePhone(insertedPhone), createdGuardianId)
        }
      }

      if (!guardianId) throw new Error('Responsável não encontrado para o aluno')

      studentsToInsert.push({
        full_name: row.student_full_name,
        birth_date: birthIso,
        blood_type: row.blood_type || '',
        allergies: row.allergies || '',
        school_id: schoolId,
        guardian_id: guardianId,
        category: calculateCategory(birthIso),
        active: true,
      })
    }

    const chunkSize = 100
    for (let i = 0; i < studentsToInsert.length; i += chunkSize) {
      const chunk = studentsToInsert.slice(i, i + chunkSize)
      const { error: studentsError } = await supabase.from('students').insert(chunk)
      if (studentsError) throw new Error(studentsError.message)
      result.insertedStudents += chunk.length
    }
  }

  return result
}
