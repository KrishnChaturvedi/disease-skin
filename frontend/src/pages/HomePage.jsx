import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()

  const steps = [
    { num: '01', titleKey: 'step01_title', descKey: 'step01_desc' },
    { num: '02', titleKey: 'step02_title', descKey: 'step02_desc' },
    { num: '03', titleKey: 'step03_title', descKey: 'step03_desc' },
  ]

  return (
    <div className="space-y-24">

      {/* ── Hero ── */}
      <section className="pt-8">
        <p className="text-sm font-medium text-indigo-500 tracking-wide">
          {t('hero_tag')}
        </p>
        <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-900 sm:text-6xl max-w-2xl">
          {t('hero_title')}
        </h1>
        <p className="mt-5 max-w-lg text-lg text-slate-500 leading-relaxed">
          {t('hero_desc')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/screening/questionnaire"
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {t('try_now')}
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
          >
            {t('how_it_works')}
          </Link>
        </div>
      </section>

      {/* ── What it does ── */}
      <section className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 leading-snug">
            {t('built_for_title')}
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            {t('built_for_p1')}
          </p>
          <p className="mt-4 text-slate-500 leading-relaxed">
            {t('built_for_p2')}
          </p>
        </div>
        <div className="space-y-4">
          {steps.map((s) => (
            <div key={s.num} className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold text-indigo-400 mt-0.5">{s.num}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{t(s.titleKey)}</p>
                <p className="mt-1 text-sm text-slate-500">{t(s.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Honest section ── */}
      <section className="rounded-2xl bg-indigo-50 border border-indigo-100 px-8 py-10">
        <h2 className="text-2xl font-bold text-slate-900">{t('honest_title')}</h2>
        <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
          {t('honest_p1')}
        </p>
        <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
          {t('honest_p2')}
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="text-center pb-4">
        <h2 className="text-3xl font-bold text-slate-900">{t('cta_title')}</h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto">
          {t('cta_desc')}
        </p>
        <Link
          to="/screening/questionnaire"
          className="mt-6 inline-block rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {t('cta_btn')}
        </Link>
      </section>

    </div>
  )
}

export default HomePage



