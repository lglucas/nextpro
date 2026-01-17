export type PreCadastroStatus = 'draft' | 'submitted'

export type PreCadastroOnboardingStatus = 'draft' | 'pendente_escola' | 'aguardando_contrato' | 'ativo' | 'rejeitado'

export type PreRegistrationRow = {
  id: string
  user_id: string
  school_id?: string | null
  status: PreCadastroStatus
  onboarding_status?: PreCadastroOnboardingStatus
  data: unknown
  submitted_at: string | null
  consented_at?: string | null
  consent_version?: string | null
  submitted_meta?: unknown
  school_reviewed_at?: string | null
  school_reviewed_by?: string | null
  school_review_note?: string | null
  created_at: string
  updated_at: string
}

export type PreCadastroSummary = {
  guardianName: string
  guardianEmail: string
  uf: string
  city: string
  schoolName: string
  childrenCount: number
}
