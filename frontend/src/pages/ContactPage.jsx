function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-16">

      {/* ── Header ── */}
      <section className="pt-4">
        <p className="text-sm font-medium text-indigo-500 tracking-wide">Contact</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 leading-tight">
          Say hello.
        </h1>
        <p className="mt-4 text-lg text-slate-500 leading-relaxed">
          We're students, so we actually read our emails. Whether you have feedback,
          found a bug, or just want to know more — feel free to reach out.
        </p>
      </section>

      {/* ── Contact info ── */}
      <section className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">Email</p>
          <p className="mt-2 text-lg font-semibold text-indigo-600">support@skinshield.ai</p>
          <p className="mt-1 text-sm text-slate-500">We usually reply within a day or two.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">Phone</p>
          <p className="mt-2 text-lg font-semibold text-indigo-600">+91 90000 00000</p>
          <p className="mt-1 text-sm text-slate-500">Available on weekdays, 10am – 6pm IST.</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Things people ask us</h2>
        <div className="mt-6 space-y-6">
          {[
            {
              q: 'Is this actually accurate?',
              a: "Reasonably, yes — for a student project. Our model hits around 94% on test data, but real-world skin photos are messier than training data. We always show confidence scores so you know how sure the model is.",
            },
            {
              q: 'Can I use this instead of going to a doctor?',
              a: "No, please don't. Use it to decide whether to go — not instead of going. If the result says high risk, take it seriously.",
            },
            {
              q: 'What happens to my photo?',
              a: "It's stored securely on Cloudinary and tied to your account. We don't use it for anything other than generating your report.",
            },
            {
              q: 'Is this free?',
              a: "Yes, completely. It's a college project. We're not monetising this.",
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-slate-100 pb-6 last:border-0">
              <p className="font-semibold text-slate-900">{faq.q}</p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default ContactPage

