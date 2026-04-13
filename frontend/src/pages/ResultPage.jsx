import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RiskBadge from '../components/RiskBadge'
import { getScreeningState } from '../utils/storage'

function getPractoUrl(diseaseName, city = 'delhi') {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-')
  const diseaseToSymptom = {
    'Melanoma':                   'skin-cancer',
    'Basal Cell Carcinoma':       'skin-cancer',
    'Squamous Cell Carcinoma':    'skin-cancer',
    'Psoriasis':                  'psoriasis',
    'Eczema':                     'eczema',
    'Acne':                       'acne',
    'Rosacea':                    'rosacea',
    'Actinic Keratosis':          'skin-rash',
    'Vasculitis':                 'skin-rash',
    'Vitiligo':                   'vitiligo',
    'Tinea Ringworm Candidiasis': 'fungal-infection',
    'Urticaria Hives':            'itching',
    'Nail Fungus':                'nail-problems',
    'Chickenpox':                 'skin-rash',
    'Warts Molluscum':            'warts',
  }
  const symptom = diseaseToSymptom[diseaseName] || 'skin-rash'
  return `https://www.practo.com/${citySlug}/dermatologist?symptoms=${symptom}`
}

// ── Parse top-3 image confidence cards from report text ──────────────────────
function parseImageCards(reportText) {
  if (!reportText) return []
  const cards = []
  const re = /\*\s+([^:*\n]+):\s*([\d.]+)%\s*confidence/gi
  let m
  while ((m = re.exec(reportText)) !== null) {
    cards.push({ name: m[1].trim(), pct: parseFloat(m[2]) })
  }
  return cards.slice(0, 3)
}

// ── SVG Confidence Ring ───────────────────────────────────────────────────────
function ConfidenceRing({ value }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (value / 100) * circ
  const color  = value >= 70 ? '#6366f1' : value >= 40 ? '#f59e0b' : '#94a3b8'
  const label  = value >= 70 ? 'High' : value >= 40 ? 'Moderate' : 'Low'
  const labelColor = value >= 70 ? '#6366f1' : value >= 40 ? '#d97706' : '#94a3b8'

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="36" cy="36" r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
          <circle
            cx="36" cy="36" r={r} fill="none"
            stroke={color} strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <span className="absolute text-[15px] font-extrabold" style={{ color }}>
          {value}%
        </span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: labelColor }}>
        {label} confidence
      </span>
    </div>
  )
}

// ── Disease confidence mini-cards ─────────────────────────────────────────────
const BAR_COLORS = ['#8b5cf6', '#10b981', '#f97316']
const BAR_BG     = ['#ede9fe', '#d1fae5', '#ffedd5']
const BAR_TEXT   = ['text-violet-700', 'text-emerald-700', 'text-orange-600']

function DiseaseCards({ cards }) {
  if (!cards.length) return null
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
        Image classifier — top matches
      </p>
      <div className="grid grid-cols-3 gap-2">
        {cards.map((c, i) => (
          <div
            key={i}
            className="rounded-xl px-3 py-2.5 border"
            style={{
              background: BAR_BG[i],
              borderColor: BAR_COLORS[i] + '44',
            }}
          >
            <p className={`text-[11px] font-bold leading-snug ${BAR_TEXT[i]}`}>{c.name}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: BAR_COLORS[i] }}>
              {c.pct.toFixed(2)}%
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/80">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${Math.min(c.pct * 4, 100)}%`,
                  background: BAR_COLORS[i],
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Floating Practo Widget ────────────────────────────────────────────────────
function PractoFloatingWidget({ diseaseName, riskLevel }) {
  const [expanded, setExpanded] = useState(false)

  const urgency   = riskLevel === 'high'  ? 'Urgent — book today'
                  : riskLevel === 'medium'? 'Book within 1–2 weeks'
                  : 'Book a check-up'
  const timeframe = riskLevel === 'high'  ? 'ASAP'
                  : riskLevel === 'medium'? '1–2 weeks'
                  : 'When convenient'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Expanded card ── */}
      {expanded && (
        <div
          className="rounded-2xl bg-white p-4 border border-blue-100"
          style={{ width: 288, boxShadow: '0 12px 48px rgba(37,99,235,0.18)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#dbeafe,#eff6ff)' }}
              >
                {/* person + plus icon */}
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Dermatologist Recommended
                </p>
                <p className="text-sm font-extrabold text-slate-800 leading-tight">{urgency}</p>
              </div>
            </div>
            <button onClick={() => setExpanded(false)}
              className="text-slate-300 hover:text-slate-500 text-xl leading-none ml-1">×</button>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-blue-400 font-semibold">Timeframe</p>
              <p className="text-xs font-bold text-blue-800 mt-0.5">{timeframe}</p>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-blue-400 font-semibold">Specialist</p>
              <p className="text-xs font-bold text-blue-800 mt-0.5">Dermatologist</p>
            </div>
          </div>

          {/* CTA button */}
          <a
            href={getPractoUrl(diseaseName)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}
          >
            <span className="inline-flex items-center justify-center rounded-md bg-white px-1.5 py-0.5 text-[11px] font-extrabold text-blue-700 leading-none">
              practo
            </span>
            Book a Dermatologist ↗
          </a>
          <p className="mt-2 text-[10px] text-center text-slate-400">
            Opens Practo · Dermatologists in Delhi
          </p>
        </div>
      )}

      {/* ── Floating pill ── */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          boxShadow: '0 4px 24px rgba(59,130,246,0.5)',
        }}
      >
        <span className="inline-flex items-center justify-center rounded-md bg-white px-1.5 py-0.5 text-[11px] font-extrabold text-blue-700 leading-none">
          practo
        </span>
        {expanded ? 'Close' : 'Book Dermatologist'}
        {!expanded && (
          <span className="ml-0.5 flex h-2 w-2 rounded-full bg-sky-300 ring-2 ring-blue-400 animate-pulse" />
        )}
      </button>
    </div>
  )
}

// ── Markdown Report Renderer ──────────────────────────────────────────────────
function ReportRenderer({ text }) {
  if (!text) return null

  const sectionRegex = /(\d+)\.\s+\*\*([^*]+)\*\*\n?([\s\S]*?)(?=\n\d+\.\s+\*\*|$)/g
  const sections = []
  let match
  while ((match = sectionRegex.exec(text)) !== null) {
    sections.push({ num: match[1], title: match[2].trim(), body: match[3].trim() })
  }

  if (sections.length === 0)
    return <p className="text-sm leading-6 text-slate-600 whitespace-pre-wrap">{text}</p>

  function renderInline(str) {
    return str.split(/\*\*([^*]+)\*\*/).map((p, j) =>
      j % 2 === 1 ? <strong key={j} className="text-slate-800">{p}</strong> : p
    )
  }

  function renderImageCards(lines) {
    const cards = []
    lines.forEach(l => {
      const m = l.match(/^\s*\*\s+([^:]+):\s*([\d.]+)%\s*confidence/i)
      if (m) cards.push({ name: m[1].trim(), pct: parseFloat(m[2]) })
    })
    const prose = lines.filter(l => !l.match(/^\s*\*\s+[^:]+:\s*[\d.]+%\s*confidence/i))
    return (
      <>
        {prose.map((l, i) => (
          <p key={i} className="text-sm text-slate-600 leading-relaxed mb-2">{renderInline(l)}</p>
        ))}
        {cards.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {cards.map((c, i) => (
              <div key={i} className="rounded-xl px-3 py-2.5 border"
                   style={{ background: BAR_BG[i], borderColor: BAR_COLORS[i] + '44' }}>
                <p className={`text-[11px] font-bold leading-snug ${BAR_TEXT[i]}`}>{c.name}</p>
                <p className="text-xs font-bold mt-0.5" style={{ color: BAR_COLORS[i] }}>
                  {c.pct.toFixed(2)}%
                </p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/80">
                  <div className="h-1.5 rounded-full"
                       style={{ width: `${Math.min(c.pct * 4, 100)}%`, background: BAR_COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  function renderBody(body, title) {
    const lines = body.split('\n').filter(Boolean)
    if (/image\s*analysis/i.test(title)) return renderImageCards(lines)
    return lines.map((line, i) => {
      const bm = line.match(/^\s*\*\s+\*\*([^*]+):\*\*\s*(.*)/)
      if (bm) return (
        <div key={i} className="flex gap-2 items-start py-1.5">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">{bm[1]}:</span> {renderInline(bm[2])}
          </p>
        </div>
      )
      const pb = line.match(/^\s*\*\s+(.+)/)
      if (pb) return (
        <div key={i} className="flex gap-2 items-start py-0.5">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
          <p className="text-sm text-slate-600 leading-relaxed">{renderInline(pb[1])}</p>
        </div>
      )
      return <p key={i} className="text-sm text-slate-600 leading-relaxed">{renderInline(line)}</p>
    })
  }

  return (
    <div className="divide-y divide-slate-100">
      {sections.map((s) => (
        <div key={s.num} className="py-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {s.num}
            </span>
            <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
          </div>
          <div className="ml-8 space-y-1">{renderBody(s.body, s.title)}</div>
        </div>
      ))}
    </div>
  )
}

// ── Main Result Page ──────────────────────────────────────────────────────────
function ResultPage() {
  const { t } = useTranslation()
  const screeningState = useMemo(() => getScreeningState(), [])
  const [locating, setLocating]           = useState(false)
  const [locationError, setLocationError] = useState('')
  const [reportOpen, setReportOpen]       = useState(false)

  const prediction  = screeningState?.prediction
  const pdfUrl      = screeningState?.pdfUrl
  const diseaseName = prediction?.conditionName || 'Unknown'
  const riskLevel   = prediction?.riskLevel     || 'low'

  const diseaseCards = useMemo(
    () => parseImageCards(screeningState?.report || ''),
    [screeningState]
  )

  function findNearbyDermatologist() {
    setLocationError('')
    setLocating(true)
    if (!navigator.geolocation) {
      setLocationError('Location not supported. Opening general search.')
      setLocating(false)
      window.open('https://www.google.com/maps/search/dermatologist+near+me', '_blank')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        window.open(`https://www.google.com/maps/search/dermatologist/@${latitude},${longitude},14z`, '_blank')
        setLocating(false)
      },
      (error) => {
        setLocating(false)
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please allow access and try again.')
        } else {
          setLocationError('Could not get location. Opening general search.')
          window.open('https://www.google.com/maps/search/dermatologist+near+me', '_blank')
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    )
  }

  if (!prediction) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        {t('no_prediction')}
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-4 pb-24">
        <h1 className="text-3xl font-bold text-slate-900">{t('result_title')}</h1>

        {/* ── Result card ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Condition name + confidence ring */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-slate-500">{t('predicted_condition')}</p>
                <RiskBadge riskLevel={riskLevel} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{diseaseName}</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wide font-semibold">
                AI Skin Analysis · Primary Match
              </p>
            </div>
            <ConfidenceRing value={prediction.confidence} />
          </div>

          {/* Top-3 disease confidence cards */}
          {diseaseCards.length > 0 && <DiseaseCards cards={diseaseCards} />}
        </section>

        {/* ── Disclaimer ── */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {t('disclaimer')}
        </div>

        {/* ── Full AI Report (collapsible) ── */}
        {screeningState?.report && (
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setReportOpen(prev => !prev)}
              className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition"
            >
              <div>
                <h2 className="text-base font-semibold text-slate-900">{t('ai_analysis')}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Full AI report · 6 sections</p>
              </div>
              <span className="text-slate-400 text-base">{reportOpen ? '▲' : '▼'}</span>
            </button>
            {reportOpen && (
              <div className="border-t border-slate-100 px-6 py-5">
                <ReportRenderer text={screeningState.report} />
              </div>
            )}
          </section>
        )}

        {/* ── Location error ── */}
        {locationError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {locationError}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div className="flex flex-wrap gap-3">
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noreferrer"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110">
              {t('download_pdf')}
            </a>
          )}
          <a href="https://esanjeevani.mohfw.gov.in/" target="_blank" rel="noreferrer"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700">
            {t('consult_esanjeevani')}
          </a>
          <button type="button" onClick={findNearbyDermatologist} disabled={locating}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
            {locating ? 'Getting your location...' : t('find_hospital')}
          </button>
          <Link to="/screening/questionnaire"
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700">
            {t('new_screening')}
          </Link>
        </div>
      </div>

      {/* ── Floating Practo Widget ── */}
      <PractoFloatingWidget diseaseName={diseaseName} riskLevel={riskLevel} />
    </>
  )
}

export default ResultPage
