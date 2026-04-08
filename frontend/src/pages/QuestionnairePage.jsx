import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SymptomForm from '../components/SymptomForm'
import { initialSymptoms } from '../constants/symptoms'
import { saveScreeningState } from '../utils/storage'

function QuestionnairePage() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState(initialSymptoms)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleFieldChange(field, value) {
    setSymptoms((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    // Frontend-only flow: user will integrate questionnaire backend later.
    saveScreeningState({ symptoms })
    setIsSubmitting(false)
    navigate('/screening/upload')
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
