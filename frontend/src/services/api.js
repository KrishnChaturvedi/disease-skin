import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

function extractScreeningId(payload) {
  if (!payload || typeof payload !== 'object') return null

  return (
    payload.screeningId ||
    payload.id ||
    payload._id ||
    payload?.data?.screeningId ||
    payload?.data?.id ||
    payload?.data?._id ||
    null
  )
}

export async function createScreeningSession(symptoms) {
  let response

  // Support both backend payload styles:
  // 1) { symptoms: {...} }
  // 2) { ...symptoms }
  try {
    response = await api.post('/screenings', { symptoms })
  } catch (error) {
    if (error?.response?.status && error.response.status < 500) {
      response = await api.post('/screenings', symptoms)
    } else {
      throw error
    }
  }

  const screeningId = extractScreeningId(response.data)
  if (!screeningId) {
    throw new Error('screening_id_missing_in_response')
  }

  return {
    ...response.data,
    screeningId,
  }
}

export async function uploadSkinImage(screeningId, imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)

  const response = await api.post(`/screenings/${screeningId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

export async function runPrediction(screeningId) {
  const response = await api.post(`/screenings/${screeningId}/predict`)
  return response.data
}

export async function getScreeningResult(screeningId) {
  const response = await api.get(`/screenings/${screeningId}/result`)
  return response.data
}

export async function generateReport(screeningId) {
  const response = await api.post(`/screenings/${screeningId}/report`)
  return response.data
}

export async function getReportByScreeningId(screeningId) {
  const response = await api.get(`/screenings/${screeningId}/report`)
  return response.data
}

export default api
