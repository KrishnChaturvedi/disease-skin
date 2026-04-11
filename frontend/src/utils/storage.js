const SCREENING_STORAGE_KEY = 'skinshield_screening_state'
const TOKEN_KEY = 'skinshield_token'

// ── Screening state ──────────────────────────────────────────────────────────

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

// ── Auth token ───────────────────────────────────────────────────────────────

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}