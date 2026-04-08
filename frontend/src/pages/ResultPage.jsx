import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import RiskBadge from '../components/RiskBadge'
import { generateReport } from '../services/api'
import { getScreeningState, saveScreeningState } from '../utils/storage'

function ResultPage() {
  const navigate = useNavigate()
  const screeningState = useMemo(() => getScreeningState(), [])
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [error, setError] = useState('')

  const prediction = screeningState?.prediction
  const screeningId = screeningState?.screeningId

  async function handleGenerateReport() {
    if (!screeningId) return

    setError('')
    setIsGeneratingReport(true)

    try {
      const reportData = await generateReport(screeningId)
      saveScreeningState({
        ...screeningState,
        report: reportData,
      })
      navigate(`/screening/report/${screeningId}`)
    } catch {
      setError('Report generation failed. Please try again.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  if (!screeningId || !prediction) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        No prediction found. Complete questionnaire and upload steps first.
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">Screening Result</h1>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">Predicted condition</p>
          <RiskBadge riskLevel={prediction.riskLevel} />
        </div>
        <p className="text-xl font-semibold text-slate-900">{prediction.conditionName}</p>
        <p className="text-sm text-slate-600">
          Confidence: <span className="font-semibold">{prediction.confidence}%</span>
        </p>
      </section>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {isGeneratingReport ? <Loader label="Generating AI report..." /> : null}

      <button
        type="button"
        onClick={handleGenerateReport}
        disabled={isGeneratingReport}
  className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        View Full Report
      </button>
    </div>
  )
}

export default ResultPage
