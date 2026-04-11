import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import RiskBadge from '../components/RiskBadge'
import { getScreeningState } from '../utils/storage'

function ResultPage() {
  const screeningState = useMemo(() => getScreeningState(), [])

  const prediction = screeningState?.prediction
  const pdfUrl = screeningState?.pdfUrl
  const scanId = screeningState?.scanId

  if (!prediction) {
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

      {/* Report text preview */}
      {screeningState?.report && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-3">AI Analysis</h2>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {screeningState.report}
          </p>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        {/* Download PDF if available */}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110"
          >
            Download Full PDF Report
          </a>
        )}

        <a
          href="https://esanjeevani.mohfw.gov.in/"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
        >
          Consult on eSanjeevani
        </a>
        <a
          href="https://www.google.com/maps/search/dermatologist+near+me"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
        >
          Find Nearby Hospital
        </a>

        <Link
          to="/screening/questionnaire"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
        >
          New Screening
        </Link>
      </div>
    </div>
  )
}

export default ResultPage