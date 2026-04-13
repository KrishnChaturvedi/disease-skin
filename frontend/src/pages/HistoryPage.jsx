import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getHistory } from '../utils/storage'
import RiskBadge from '../components/RiskBadge'

function HistoryPage() {
  const { t } = useTranslation()
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getHistory())
  }, [])

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          {t('dashboard', 'Your Dashboard')}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{t('scan_history', 'Scan History')}</h1>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">{t('no_history', "You haven't completed any scans yet.")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {history.map((item, index) => (
            <article key={index} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  <RiskBadge riskLevel={item.riskLevel} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.disease}</h3>
                <p className="text-sm text-slate-600">Confidence: {item.confidence}%</p>
              </div>
              
              <div className="mt-5">
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full justify-center rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    View PDF Report
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">PDF not available</span>
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