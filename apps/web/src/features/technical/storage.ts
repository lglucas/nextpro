export function getTechnicalSeenLocalKey(userId: string, studentId: string) {
  return `@NextPro:technical_seen:${userId}:${studentId}:v1`
}

export function loadTechnicalLastSeenIso(userId: string, studentId: string) {
  const key = getTechnicalSeenLocalKey(userId, studentId)
  const raw = localStorage.getItem(key)
  if (!raw) return null
  const iso = raw.trim()
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return iso
}

export function saveTechnicalLastSeenIso(userId: string, studentId: string, iso: string) {
  const key = getTechnicalSeenLocalKey(userId, studentId)
  localStorage.setItem(key, iso)
}

