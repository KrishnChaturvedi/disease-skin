function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <div>
  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          About SkinShield
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Early Screening for Everyone</h1>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm leading-7 text-slate-600">
          SkinShield is an AI-powered skin screening platform focused on early awareness.
          Users answer a short symptom questionnaire and upload a skin image to get a
          triage-style risk output. The goal is to help people take action early, especially in
          areas with limited access to dermatologists.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Mission</h2>
          <p className="mt-2 text-sm text-slate-600">
            Reduce late detection by making first-step skin screening simple and accessible.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Approach</h2>
          <p className="mt-2 text-sm text-slate-600">
            Combine symptom inputs with image analysis and clear next-step guidance.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Note</h2>
          <p className="mt-2 text-sm text-slate-600">
            SkinShield is for screening support only and not a confirmed diagnosis.
          </p>
        </article>
      </section>
    </div>
  )
}

export default AboutPage
