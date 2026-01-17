import { supabase } from '@/lib/supabase'
import type { PreCadastroDraftData, PreCadastroOnboardingStatus, PreCadastroStatus, PreRegistrationRow } from '@/features/preCadastro/types'

export async function getMyPreCadastroDraft(userId: string) {
  const { data, error } = await supabase
    .from('pre_registrations')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message)
  }

  return data as unknown as PreRegistrationRow
}

export async function upsertMyPreCadastroDraft(
  userId: string,
  status: PreCadastroStatus,
  draft: PreCadastroDraftData,
  options?: {
    onboardingStatus?: PreCadastroOnboardingStatus
    consentedAt?: string | null
    consentVersion?: string | null
    submittedMeta?: Record<string, unknown>
    schoolId?: string | null
  },
) {
  const onboardingStatus: PreCadastroOnboardingStatus = options?.onboardingStatus ?? (status === 'submitted' ? 'pendente_escola' : 'draft')
  const consentedAt = options?.consentedAt ?? (status === 'submitted' ? new Date().toISOString() : null)
  const consentVersion = options?.consentVersion ?? (status === 'submitted' ? '2025-12-26-v1' : null)
  const submittedMeta =
    options?.submittedMeta ??
    (status === 'submitted'
      ? {
          userAgent: typeof navigator === 'undefined' ? null : navigator.userAgent,
          language: typeof navigator === 'undefined' ? null : navigator.language,
          timezoneOffsetMinutes: new Date().getTimezoneOffset(),
          submittedAtClient: new Date().toISOString(),
        }
      : {})
  const payload = {
    user_id: userId,
    school_id: options?.schoolId ?? null,
    status,
    onboarding_status: onboardingStatus,
    data: draft as unknown,
    submitted_at: status === 'submitted' ? new Date().toISOString() : null,
    consented_at: consentedAt,
    consent_version: consentVersion,
    submitted_meta: submittedMeta as unknown,
  }

  const { data, error } = await supabase
    .from('pre_registrations')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return data as unknown as PreRegistrationRow
}

export async function insertSchoolSuggestion(userId: string, school: { uf: string; city: string; name: string }) {
  const { error } = await supabase.from('school_suggestions').insert({
    created_by: userId,
    uf: school.uf,
    city: school.city,
    name: school.name,
  })

  if (error) throw new Error(error.message)
}

export function isSubmittedStatus(status: string | null | undefined): status is PreCadastroStatus {
  return status === 'submitted' || status === 'draft'
}
