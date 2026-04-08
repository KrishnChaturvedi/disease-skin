function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div>
  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Contact Us
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">We are here to help</h1>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          For project queries, partnerships, or technical help, reach out to the SkinShield
          team.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-1 text-sm font-medium text-indigo-700">support@skinshield.ai</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
            <p className="mt-1 text-sm font-medium text-indigo-700">+91 90000 00000</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Replace these details with your real team contact information.
        </p>
      </section>
    </div>
  )
}

export default ContactPage
