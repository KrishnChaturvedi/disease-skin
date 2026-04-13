import { useTranslation } from 'react-i18next'

function ContactPage() {
  const { t } = useTranslation()

  const faqs = [
    { qKey: 'faq1_q', aKey: 'faq1_a' },
    { qKey: 'faq2_q', aKey: 'faq2_a' },
    { qKey: 'faq3_q', aKey: 'faq3_a' },
    { qKey: 'faq4_q', aKey: 'faq4_a' },
  ]

  return (
    <div className="mx-auto w-full max-w-2xl space-y-16">

      {/* ── Header ── */}
      <section className="pt-4">
        <p className="text-sm font-medium text-indigo-500 tracking-wide">{t('contact_tag')}</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 leading-tight">
          {t('contact_title')}
        </h1>
        <p className="mt-4 text-lg text-slate-500 leading-relaxed">
          {t('contact_intro')}
        </p>
      </section>

      {/* ── Contact info ── */}
      <section className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">{t('email_label')}</p>
          <p className="mt-2 text-lg font-semibold text-indigo-600">support@skinshield.ai</p>
          <p className="mt-1 text-sm text-slate-500">{t('email_reply')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">{t('phone_label')}</p>
          <p className="mt-2 text-lg font-semibold text-indigo-600">+91 90000 00000</p>
          <p className="mt-1 text-sm text-slate-500">{t('phone_hours')}</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900">{t('faq_title')}</h2>
        <div className="mt-6 space-y-6">
          {faqs.map((faq) => (
            <div key={faq.qKey} className="border-b border-slate-100 pb-6 last:border-0">
              <p className="font-semibold text-slate-900">{t(faq.qKey)}</p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{t(faq.aKey)}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default ContactPage


