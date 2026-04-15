import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function ContactPage() {
  const { t } = useTranslation()
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { qKey: 'faq1_q', aKey: 'faq1_a' },
    { qKey: 'faq2_q', aKey: 'faq2_a' },
    { qKey: 'faq3_q', aKey: 'faq3_a' },
    { qKey: 'faq4_q', aKey: 'faq4_a' },
  ]

  return (
    <div className="mx-auto w-full max-w-2xl space-y-14 pb-16">


      <section className="pt-4">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-500 tracking-wide uppercase">
          {t('contact_tag')}
        </span>
        <h1 className="mt-4 text-4xl font-bold text-slate-900 leading-tight">
          {t('contact_title')}
        </h1>
        <p className="mt-3 text-lg text-slate-500 leading-relaxed">
          {t('contact_intro')}
        </p>
      </section>

     
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
       
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex gap-4 items-start">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
            </svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">{t('email_label')}</p>
            <p className="mt-1 text-base font-bold text-indigo-600">support@skinshield.ai</p>
            <p className="mt-1 text-xs text-slate-400">{t('email_reply')}</p>
          </div>
        </div>


        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex gap-4 items-start">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">{t('phone_label')}</p>
            <p className="mt-1 text-base font-bold text-indigo-600">+91 90000 00000</p>
            <p className="mt-1 text-xs text-slate-400">{t('phone_hours')}</p>
          </div>
        </div>
      </section>

      {/* ── Disclaimer banner ── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 flex gap-3 items-start">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        SkinShield is an early screening platform and not a final diagnosis. Always consult a qualified dermatologist.
      </div>

      {/* ── FAQ Accordion ── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900">{t('faq_title')}</h2>
        <div className="mt-5 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {faqs.map((faq, i) => (
            <div key={faq.qKey}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition"
              >
                <span className="text-sm font-semibold text-slate-900">{t(faq.qKey)}</span>
                <span className="ml-4 flex-shrink-0 text-slate-400 text-lg leading-none">
                  {openFaq === i ? '▲' : '▼'}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-500 leading-relaxed">{t(faq.aKey)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default ContactPage
