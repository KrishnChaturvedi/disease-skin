export function getApiErrorMessage(error, apiBaseUrl) {
  const status = error?.response?.status
  const backendMessage =
    error?.response?.data?.message || error?.response?.data?.error || ''

  if (status === 403) {
    return `Request blocked with 403. Check backend auth/CORS and confirm API URL (${apiBaseUrl}) is correct.`
  }

  if (status === 404) {
    return `API route not found (404). Check backend endpoint path and API URL (${apiBaseUrl}).`
  }

  if (!status) {
    return `Cannot reach backend server. Confirm backend is running and API URL (${apiBaseUrl}) is correct.`
  }

  return backendMessage || `Request failed with status code ${status}.`

}


