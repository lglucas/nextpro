import type { PreCadastroDraftData } from '@/features/preCadastro/types'

export function getPreCadastroLocalKey(userId: string) {
  return `@NextPro:pre_cadastro:${userId}:v1`
}

export function loadPreCadastroFromLocalStorage(userId: string) {
  const key = getPreCadastroLocalKey(userId)
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PreCadastroDraftData
  } catch {
    return null
  }
}

export function savePreCadastroToLocalStorage(userId: string, draft: PreCadastroDraftData) {
  const key = getPreCadastroLocalKey(userId)
  localStorage.setItem(key, JSON.stringify(draft))
}

export function clearPreCadastroLocalStorage(userId: string) {
  const key = getPreCadastroLocalKey(userId)
  localStorage.removeItem(key)
}

