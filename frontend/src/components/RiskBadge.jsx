const riskStyles = {
  low: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  medium: 'bg-amber-100 text-amber-900 border-amber-300',
  high: 'bg-rose-100 text-rose-900 border-rose-300',
}

function RiskBadge({ riskLevel }) {
  const normalized = String(riskLevel || '').toLowerCase()
  const className = riskStyles[normalized] || 'bg-slate-100 text-slate-800 border-slate-300'

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${className}`}>
      {riskLevel || 'Unknown'} Risk
    </span>
  )
}

export default RiskBadge