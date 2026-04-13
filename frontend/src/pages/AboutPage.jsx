import { useTranslation } from 'react-i18next'

function AboutPage() {
  const { t } = useTranslation()

  const built = [
    { titleKey: 'ml_title',       descKey: 'ml_desc' },
    { titleKey: 'ai_title',       descKey: 'ai_desc' },
    { titleKey: 'backend_title',  descKey: 'backend_desc' },
    { titleKey: 'frontend_title', descKey: 'frontend_desc' },
  ]

  return (
    <div className="mx-auto w-full max-w-3xl space-y-16">

      {/* ── Header ── */}
      <section className="pt-4">
        <p className="text-sm font-medium text-indigo-500 tracking-wide">{t('about_tag')}</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 leading-tight max-w-xl">
          {t('about_title')}
        </h1>
        <p className="mt-5 text-lg text-slate-500 leading-relaxed">
          {t('about_intro')}
        </p>
      </section>

      {/* ── Story ── */}
      <section className="space-y-5 border-l-2 border-indigo-100 pl-6">
        <p className="text-slate-600 leading-relaxed">{t('about_p1')}</p>
        <p className="text-slate-600 leading-relaxed">{t('about_p2')}</p>
        <p className="text-slate-600 leading-relaxed">{t('about_p3')}</p>
      </section>

      {/* ── What we built ── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900">{t('what_we_built')}</h2>
        <div className="mt-6 space-y-4">
          {built.map((item) => (
            <div key={item.titleKey} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-slate-900">{t(item.titleKey)}</p>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Honest note ── */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 px-7 py-8">
        <h2 className="font-bold text-slate-900">{t('limitation_title')}</h2>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t('limitation_desc')}</p>
      </section>

    </div>
  )
}

export default AboutPage



