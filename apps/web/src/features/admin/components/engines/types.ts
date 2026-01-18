export type SeasonRow = {
  id: string
  year: number
  starts_at: string
  ends_at: string
  is_active: boolean
}

export type NucleusRow = {
  id: string
  name: string
  uf: string | null
  city: string | null
  active: boolean
}

export type SchoolRow = {
  id: string
  name: string
}

export type SchoolNucleusRow = {
  id: string
  school_id: string
  nucleus_id: string
  season_id: string
}

export type TechnicalQuestionRow = {
  id: string
  season_id: string
  kind: 'base' | 'position'
  slot: 1 | 2 | 3
  position: string | null
  key: string
  prompt: string
  active: boolean
  sort_order: number
}

export type TechnicalMonthlyQuestionRow = {
  id: string
  season_id: string
  kind: 'base' | 'position'
  position: string | null
  pillar: 'tecnica' | 'tatica' | 'mental' | 'fisico'
  key: string
  prompt: string
  active: boolean
  sort_order: number
}

export const POSITIONS = [
  { key: 'goleiro', label: 'Goleiro' },
  { key: 'zagueiro', label: 'Zagueiro' },
  { key: 'lateral', label: 'Lateral' },
  { key: 'volante', label: 'Volante' },
  { key: 'meia', label: 'Meia' },
  { key: 'ponta', label: 'Ponta' },
  { key: 'atacante', label: 'Atacante' },
]

export const PILLARS = [
  { key: 'tecnica', label: 'Técnica' },
  { key: 'tatica', label: 'Tática' },
  { key: 'mental', label: 'Mental' },
  { key: 'fisico', label: 'Físico' },
] as const

export function toIsoDateInput(value: string) {
  return value ? value.slice(0, 10) : ''
}
