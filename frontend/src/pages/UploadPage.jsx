import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import ImageUploadCard from '../components/ImageUploadCard'
import { getScreeningState, saveScreeningState, addToHistory } from '../utils/storage'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function UploadPage() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(event) {
    setSelectedFile(event.target.files?.[0] || null)
    setError('')
  }

  async function handleSubmit() {
    if (!selectedFile) return

    const screeningState = getScreeningState()
    const symptomId = screeningState?.screeningId
    const token = localStorage.getItem('skinshield_token')

    if (!symptomId) {
      setError(t('symptom_missing'))
      return
    }
    if (!token) {
      setError(t('login_required'))
      return
    }

    setIsUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('skinImage', selectedFile)
      formData.append('symptomId', symptomId)
      
      const userLang = i18n.language?.startsWith('hi') ? 'Hindi' : 'English'
      formData.append('language', userLang)

      const ashaPatientRaw = sessionStorage.getItem('asha_patient')
      if (ashaPatientRaw) {
        const ashaPatient = JSON.parse(ashaPatientRaw)
        formData.append('patientName', ashaPatient.patientName)
        formData.append('age', ashaPatient.age)
        formData.append('gender', ashaPatient.gender)
        formData.append('village', ashaPatient.village)
        if (ashaPatient.phone) formData.append('phone', ashaPatient.phone)
      }

      const response = await axios.post(`${API_BASE}/api/scan`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        const scan = response.data.scan
        
        addToHistory({
          scanId: scan._id,
          disease: scan.mlResult?.disease || 'Unknown',
          confidence: scan.mlResult?.confidence ? Math.round(scan.mlResult.confidence) : 0,
          riskLevel: scan.riskLevel || 'low',
          pdfUrl: scan.pdfUrl
        })

        saveScreeningState({
          ...screeningState,
          scanId: scan._id,
          prediction: {
            conditionName: scan.mlResult?.disease || 'Unknown',
            confidence: scan.mlResult?.confidence
              ? Math.round(scan.mlResult.confidence)
              : 0,
            riskLevel: scan.riskLevel || 'low',
          },
          pdfUrl: scan.pdfUrl,
          report: scan.report,
        })
        navigate('/screening/result')
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t('upload_failed')
      setError(msg)
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          {t('step2_of2')}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{t('upload_title')}</h1>
        <p className="mt-1 text-sm text-slate-600">{t('upload_desc')}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>{t('error_label')}</strong> {error}
        </div>
      )}

      <ImageUploadCard
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        isUploading={isUploading}
        canSubmit={Boolean(selectedFile)}
      />
    </div>
  )
}

export default UploadPage