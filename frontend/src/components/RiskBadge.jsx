const riskStyles = {
  low: 'bg-emerald-500/20 text-emerald-200 border-emerald-300/30',
  medium: 'bg-amber-500/20 text-amber-200 border-amber-300/30',
  high: 'bg-rose-500/20 text-rose-200 border-rose-300/30',
}

function RiskBadge({ riskLevel }) {
  const normalized = String(riskLevel || '').toLowerCase()
  const className = riskStyles[normalized] || 'bg-slate-700/30 text-slate-200 border-slate-500/40'

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${className}`}>
      {riskLevel || 'Unknown'} Risk
    </span>
  )
}

export default RiskBadge
