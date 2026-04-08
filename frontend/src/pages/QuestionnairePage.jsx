import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios' // Ensure axios is installed: npm install axios
import SymptomForm from '../components/SymptomForm'
import { initialSymptoms } from '../constants/symptoms'
import { saveScreeningState } from '../utils/storage'

function QuestionnairePage() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState(initialSymptoms)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null) // State to display backend errors

  // Updates local state when user types/selects
  function handleFieldChange(field, value) {
    setSymptoms((prev) => ({ ...prev, [field]: value }))
  }

  // The logic to send data to your MongoDB backend
  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Send data to backend
      const response = await axios.post('http://localhost:5000/api/submit-symptoms', symptoms)

      // 2. Check for success based on your backend response structure
      if (response.data.success) {
        console.log('Saved successfully:', response.data.data)

        // 3. Save state locally (includes the MongoDB _id) for Step 3
        saveScreeningState({
          symptoms: response.data.data,
          screeningId: response.data.data._id,
        })

        // 4. Move to the next page
        navigate('/screening/upload')
      }
    } catch (err) {
      // 5. Catch validation errors (like "painLevel is required")
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

      {/* Error Alert: This will show the "painLevel is required" message to the user */}
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