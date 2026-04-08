const SCREENING_STORAGE_KEY = 'skinshield_screening_state'

export function saveScreeningState(payload) {
  localStorage.setItem(SCREENING_STORAGE_KEY, JSON.stringify(payload))
}

export function getScreeningState() {
  const raw = localStorage.getItem(SCREENING_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearScreeningState() {
  localStorage.removeItem(SCREENING_STORAGE_KEY)
}
