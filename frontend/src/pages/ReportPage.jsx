import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import ReportSection from '../components/ReportSection'
import { getReportByScreeningId } from '../services/api'

function ReportPage() {
  const { screeningId } = useParams()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function fetchReport() {
      try {
        const data = await getReportByScreeningId(screeningId)
        if (!ignore) setReport(data)
      } catch {
        if (!ignore) setError('Could not load report. Please retry later.')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    fetchReport()

    return () => {
      ignore = true
    }
  }, [screeningId])

  if (isLoading) return <Loader label="Loading your report..." />

  if (error) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
        <Link
          to="/screening/questionnaire"
          className="inline-flex rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40"
        >
          Start New Screening
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">AI Triage Report</h1>

      <ReportSection title="What was detected?" content={report?.summary} />
      <ReportSection title="What could this indicate?" content={report?.interpretation} />
      <ReportSection title="Recommended next step" content={report?.nextSteps} />

      <div className="flex flex-wrap gap-3">
        <a
          href="https://esanjeevani.mohfw.gov.in/"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110"
        >
          Consult on eSanjeevani
        </a>
        <a
          href={`https://www.google.com/maps/search/hospital+near+me`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
        >
          Find Nearby Hospital
        </a>
      </div>
    </div>
  )
}

export default ReportPage
