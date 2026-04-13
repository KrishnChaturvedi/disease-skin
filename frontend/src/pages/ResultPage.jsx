import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RiskBadge from '../components/RiskBadge'
import { getScreeningState } from '../utils/storage'

// ── Map disease names to Practo specialist search URLs ──────────────────────
// Practo search URL format:
// https://www.practo.com/search/doctors?results_type=doctor&q=<specialty>&city=<city>
const DISEASE_TO_PRACTO = {
  // High risk — skin cancer specialists
  'Melanoma':                  'Dermatologist+Skin+Cancer',
  'Basal Cell Carcinoma':      'Dermatologist+Skin+Cancer',
  'Squamous Cell Carcinoma':   'Dermatologist+Skin+Cancer',

  // Medium risk — general dermatologists
  'Psoriasis':                 'Dermatologist+Psoriasis',
  'Eczema':                    'Dermatologist+Eczema',
  'Acne':                      'Dermatologist+Acne',
  'Rosacea':                   'Dermatologist+Rosacea',

  // Other conditions
  'Actinic Keratosis':         'Dermatologist+Actinic+Keratosis',
  'Vasculitis':                'Dermatologist+Vasculitis',
  'Vitiligo':                  'Dermatologist+Vitiligo',
  'Tinea Ringworm Candidiasis': 'Dermatologist+Fungal+Infection',
  'Urticaria Hives':           'Dermatologist+Allergy',
  'Seborrheic Keratoses':      'Dermatologist',
  'Warts Molluscum':           'Dermatologist+Warts',
  'Nail Fungus':               'Dermatologist+Nail+Fungus',
  'Chickenpox':                'Dermatologist+Chickenpox',
  'Monkeypox':                 'Dermatologist+Infectious+Disease',
}

// Build Practo URL for a given disease and city
function getPractoUrl(diseaseName, city = 'Delhi') {
  const specialty = DISEASE_TO_PRACTO[diseaseName] || 'Dermatologist'
  return `https://www.practo.com/search/doctors?results_type=doctor&q=${specialty}&city=${encodeURIComponent(city)}`
}

function ResultPage() {
  const { t } = useTranslation()
  const screeningState = useMemo(() => getScreeningState(), [])
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')

  const prediction = screeningState?.prediction
  const pdfUrl = screeningState?.pdfUrl
  const diseaseName = prediction?.conditionName || 'Unknown'
  const riskLevel = prediction?.riskLevel || 'low'

  // ── Find nearby dermatologist using real GPS coords ──────────────────────
  function findNearbyDermatologist() {
    setLocationError('')
    setLocating(true)

    if (!navigator.geolocation) {
      setLocationError('Location not supported by your browser. Opening general search.')
      setLocating(false)
      window.open('https://www.google.com/maps/search/dermatologist+near+me', '_blank')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const mapsUrl = `https://www.google.com/maps/search/dermatologist/@${latitude},${longitude},14z`
        window.open(mapsUrl, '_blank')
        setLocating(false)
      },
      (error) => {
        setLocating(false)
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please allow location access and try again.')
        } else {
          setLocationError('Could not get location. Opening general search instead.')
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

  const isHighRisk = riskLevel === 'high'
  const isMediumOrHighRisk = riskLevel === 'high' || riskLevel === 'medium'

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold text-slate-900">{t('result_title')}</h1>

      {/* ── Result card ── */}
      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">{t('predicted_condition')}</p>
          <RiskBadge riskLevel={riskLevel} />
        </div>
        <p className="text-xl font-semibold text-slate-900">{diseaseName}</p>
        <p className="text-sm text-slate-600">
          {t('confidence')}: <span className="font-semibold">{prediction.confidence}%</span>
        </p>
      </section>

      {/* ── High risk urgent banner + Practo button ── */}
      {isHighRisk && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
              <span style={{color:'white',fontSize:'11px',fontWeight:'700'}}>!</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-800">
                High risk detected — please consult a specialist soon
              </p>
              <p className="mt-1 text-xs text-rose-700 leading-relaxed">
                Our AI has detected <strong>{diseaseName}</strong> with high risk indicators.
                This condition requires professional medical evaluation. We recommend booking
                a dermatologist appointment as soon as possible.
              </p>
            </div>
          </div>

          {/* ── Practo button — disease specific ── */}
          <a
            href={getPractoUrl(diseaseName)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <span>Consult a {diseaseName} Specialist on Practo</span>
            <span style={{fontSize:'12px'}}>↗</span>
          </a>

          <p className="text-xs text-rose-600 text-center">
            Opens Practo with dermatologists experienced in {diseaseName} treatment
          </p>
        </section>
      )}

      {/* ── Medium risk Practo suggestion ── */}
      {riskLevel === 'medium' && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-3">
          <p className="text-sm font-semibold text-amber-800">
            Medium risk — a dermatologist check is recommended
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Our AI flagged <strong>{diseaseName}</strong> as a medium risk condition.
            While not urgent, we recommend scheduling a dermatologist consultation
            within the next 1–2 weeks.
          </p>

          <a
            href={getPractoUrl(diseaseName)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-amber-400 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            Book a {diseaseName} Dermatologist on Practo ↗
          </a>
        </section>
      )}

      {/* ── Disclaimer ── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        {t('disclaimer')}
      </div>

      {/* ── Report text preview ── */}
      {screeningState?.report && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-3">{t('ai_analysis')}</h2>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {screeningState.report}
          </p>
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
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110"
          >
            {t('download_pdf')}
          </a>
        )}

        <a
          href="https://esanjeevani.mohfw.gov.in/"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
        >
          {t('consult_esanjeevani')}
        </a>

        <button
          type="button"
          onClick={findNearbyDermatologist}
          disabled={locating}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {locating ? 'Getting your location...' : t('find_hospital')}
        </button>

        <Link
          to="/screening/questionnaire"
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
        >
          {t('new_screening')}
        </Link>
      </div>
    </div>
  )
}

export default ResultPage

