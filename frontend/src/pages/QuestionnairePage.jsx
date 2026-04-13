import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import SymptomForm from '../components/SymptomForm'
import { initialSymptoms } from '../constants/symptoms'
import { saveScreeningState } from '../utils/storage'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function QuestionnairePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
        t('server_failed')
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
          {t('step1_of2')}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{t('symptom_title')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('symptom_desc')}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>{t('error_label')}</strong> {error}
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
