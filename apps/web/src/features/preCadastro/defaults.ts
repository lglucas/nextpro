import type { PreCadastroDraftData } from '@/features/preCadastro/types'

export function createEmptyPreCadastroDraft(userEmail?: string | null): PreCadastroDraftData {
  return {
    guardian: {
      fullName: '',
      cpf: '',
      phone: '',
      email: userEmail || '',
    },
    school: {
      uf: '',
      city: '',
      name: '',
    },
    children: [],
    socio: {
      householdIncomeRange: '',
      contributorsRange: '',
      housingStatus: '',
      hasBenefits: '',
      healthPlanLevel: '',
      savingsLevel: '',
      hasCar: '',
      hasMotorcycle: '',
      hasComputer: '',
      hasInternet: '',
      mainChallenge: '',
    },
    consent: {
      accepted: false,
    },
  }
}

