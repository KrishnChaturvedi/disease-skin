import { useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from './AuthPage'
import { clearToken, clearScreeningState } from '../utils/storage'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function AshaDashboard() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showToast, setShowToast] = useState(location.state?.submitted || false)

  
  const [stats, setStats] = useState({ today: 0, offline: 0, month: 0 })
  const [recentCases, setRecentCases] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)


  useEffect(() => {
    const goOnline  = () => setIsOffline(false)
    const goOffline = () => setIsOffline(true)
    window.addEventListener('online',  goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online',  goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])


  useEffect(() => {
    if (!showToast) return
    const t = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(t)
  }, [showToast])

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('skinshield_token')
        const res = await fetch(`${API_BASE}/api/asha/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setStats({
            today: data.today ?? 0,
            offline: data.pendingSync ?? 0,
            month: data.thisMonth ?? 0,
          })
          setRecentCases(data.recentCases ?? [])
        }
      } catch (err) {
        console.error('Stats fetch error:', err)
     
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])

  function handleLogout() {
    logout()
    clearToken()
    clearScreeningState()
    navigate('/asha-login')
  }

  function startNewScreening() {

    sessionStorage.removeItem('asha_patient')
    navigate('/asha-patient-info')
  }

  const riskBadge = (riskLevel) => {
    const map = {
      high:     'bg-rose-50 text-rose-700 border-rose-200',
      medium:   'bg-amber-50 text-amber-700 border-amber-200',
      low:      'bg-emerald-50 text-emerald-700 border-emerald-200',
      pending:  'bg-slate-100 text-slate-600 border-slate-200',
    }
    const label = {
      high: 'High risk', medium: 'Medium risk', low: 'Low risk', pending: 'Pending'
    }
    const cls = map[riskLevel] ?? map.pending
    return (
      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cls}`}>
        {label[riskLevel] ?? 'Pending'}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      
      {isOffline && (
        <div className="bg-amber-500 text-white text-sm text-center py-2 px-4">
          No internet — screenings saved locally. Will sync when signal returns.
        </div>
      )}

    
      {showToast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-lg flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-600">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Patient screening submitted successfully!
        </div>
      )}

  
      <div className="bg-gradient-to-r from-teal-600 to-green-500 px-6 py-5">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div>
            <p className="text-teal-100 text-xs uppercase tracking-widest mb-0.5">ASHA Worker Portal</p>
            <h1 className="text-white text-xl font-bold">
              Namaste, {user?.name?.split(' ')[0] || 'ASHA Ji'} 🙏
            </h1>
            <p className="text-teal-100 text-xs mt-0.5">{user?.village || 'Your Village'} · ID: {user?.ashaId || '—'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-teal-100 text-xs border border-teal-300 rounded-lg px-3 py-1.5 hover:bg-teal-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

   
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Screened today', value: loadingStats ? '—' : stats.today, color: 'text-slate-800' },
            { label: 'Saved offline',  value: loadingStats ? '—' : stats.offline, color: 'text-amber-500' },
            { label: 'This month',     value: loadingStats ? '—' : stats.month, color: 'text-teal-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

    
        <button
          onClick={startNewScreening}
          className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-green-500 px-4 py-4 font-semibold text-white shadow-lg shadow-teal-400/30 transition hover:brightness-110 text-sm"
        >
          + Start New Screening
        </button>


        {recentCases.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Recent screenings</h2>
            <div className="space-y-3">
              {recentCases.map((s, i) => (
                <div
                  key={s._id || i}
                  className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex justify-between items-center"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {s.patientName}, {s.age}{s.gender === 'male' ? 'M' : s.gender === 'female' ? 'F' : ''}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {s.village} · {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  {riskBadge(s.riskLevel || 'pending')}
                </div>
              ))}
            </div>
          </div>
        )}


        {!loadingStats && recentCases.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 px-4 py-8 text-center">
            <p className="text-sm text-slate-500">No screenings yet.</p>
            <p className="text-xs text-slate-400 mt-1">Tap "Start New Screening" to begin.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default AshaDashboard
