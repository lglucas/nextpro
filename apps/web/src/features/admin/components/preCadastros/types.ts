export type PreCadastroStatus = 'draft' | 'submitted'

export type PreRegistrationRow = {
  id: string
  user_id: string
  status: PreCadastroStatus
  data: unknown
  submitted_at: string | null
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

