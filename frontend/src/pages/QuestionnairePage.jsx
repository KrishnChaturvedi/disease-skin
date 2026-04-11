import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SymptomForm from '../components/SymptomForm'
import { initialSymptoms } from '../constants/symptoms'
import { saveScreeningState } from '../utils/storage'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function QuestionnairePage() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState(initialSymptoms)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function handleFieldChange(field, value) {
    setSymptoms((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE}/api/submit-symptoms`, symptoms)

      if (response.data.success) {
        // Save the MongoDB _id as screeningId so UploadPage can send it
        saveScreeningState({
          symptoms: response.data.data,
          screeningId: response.data.data._id,
        })
        navigate('/screening/upload')
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Server connection failed. Is the backend running?'
      setError(errorMessage)
      console.error('Submission Error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Step 1 of 2
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Symptom Questionnaire</h1>
        <p className="mt-1 text-sm text-slate-600">
          Complete this form before uploading your skin image.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      <SymptomForm
        values={symptoms}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default QuestionnairePage