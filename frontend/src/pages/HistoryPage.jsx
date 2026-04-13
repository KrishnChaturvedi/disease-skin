import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import axios from 'axios'
import RiskBadge from '../components/RiskBadge'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function HistoryPage() {
  const { t } = useTranslation()
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchCloudHistory() {
      const token = localStorage.getItem('skinshield_token')
      
      if (!token) {
        setError("You must be logged in to view your history.")
        setIsLoading(false)
        return
      }

      try {
        // Fetch from MongoDB via Node backend
        const response = await axios.get(`${API_BASE}/api/scan/history`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.success) {
          setHistory(response.data.history)
        }
      } catch (err) {
        console.error("Failed to fetch history:", err)
        setError("Failed to load history from the server.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCloudHistory()
  }, [])

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          {t('dashboard', 'Your Dashboard')}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{t('scan_history', 'Scan History')}</h1>
      </div>

      {isLoading && (
        <div className="text-center text-slate-500 py-10">Loading your history from the cloud...</div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!isLoading && !error && history.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600 mb-4">{t('no_history', "You haven't completed any scans yet.")}</p>
          <Link
            to="/screening/questionnaire"
            className="inline-flex rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
          >
            Start Your First Scan
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {history.map((item) => (
            <article key={item._id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500">
                    {/* Format the MongoDB createdAt timestamp */}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <RiskBadge riskLevel={item.riskLevel} />
                </div>
                {/* Pull disease and confidence from MongoDB structure */}
                <h3 className="text-lg font-bold text-slate-900">
                  {item.mlResult?.disease || 'Unknown Condition'}
                </h3>
                <p className="text-sm text-slate-600">
                  Confidence: {item.mlResult?.confidence ? Math.round(item.mlResult.confidence) : 0}%
                </p>
              </div>
              
              <div className="mt-5 flex gap-2">
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 justify-center rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="inline-flex flex-1 justify-center rounded-xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400">
                    No PDF
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPage