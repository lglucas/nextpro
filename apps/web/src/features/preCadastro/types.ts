export type PreCadastroStatus = 'draft' | 'submitted'

export interface PreCadastroSchoolInfo {
  uf: string
  city: string
  name: string
}

export interface PreCadastroChild {
  id: string
  fullName: string
  birthDate: string
  gender: 'M' | 'F' | 'O' | ''
  position: string
  schoolName: string
  schoolGrade: string
  trainsAtSchool: boolean
}

export interface PreCadastroSocioEconomic {
  householdIncomeRange: string
  contributorsRange: string
  housingStatus: string
  hasBenefits: string
  healthPlanLevel: string
  savingsLevel: string
  hasCar: string
  hasMotorcycle: string
  hasComputer: string
  hasInternet: string
  mainChallenge: string
}

export interface PreCadastroGuardian {
  fullName: string
  cpf: string
  phone: string
  email: string
}

export interface PreCadastroDraftData {
  guardian: PreCadastroGuardian
  school: PreCadastroSchoolInfo
  children: PreCadastroChild[]
  socio: PreCadastroSocioEconomic
  consent: {
    accepted: boolean
  }
}

export interface PreRegistrationRow {
  id: string
  user_id: string
  status: PreCadastroStatus
  data: unknown
  submitted_at: string | null
  created_at: string
  updated_at: string
}

