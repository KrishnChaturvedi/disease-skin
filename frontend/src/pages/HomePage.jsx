import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="space-y-24">

      {/* ── Hero ── */}
      <section className="pt-8">
        <p className="text-sm font-medium text-indigo-500 tracking-wide">
          A student-built AI screening tool
        </p>
        <h1 className="mt-4 text-5xl font-bold leading-tight text-slate-900 sm:text-6xl max-w-2xl">
          Skin screening that actually makes sense.
        </h1>
        <p className="mt-5 max-w-lg text-lg text-slate-500 leading-relaxed">
          We built SkinShield because early detection shouldn't require a specialist appointment.
          Answer a few questions, upload a photo, and know what to do next.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/screening/questionnaire"
            className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Try it now
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* ── What it does ── */}
      <section className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 leading-snug">
            Built for people who don't know where to start.
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            Most people notice a skin issue and either ignore it or spiral into a Google search
            that leads nowhere good. SkinShield gives you a calm, structured way to understand
            what you're looking at and what to actually do next.
          </p>
          <p className="mt-4 text-slate-500 leading-relaxed">
            It's not a diagnosis. It's a starting point — and sometimes that's all you need.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { num: '01', title: 'Answer a short questionnaire', desc: 'Duration, itching, sun exposure — takes about 2 minutes.' },
            { num: '02', title: 'Upload a photo of the area', desc: 'Any decent smartphone photo works. No special equipment needed.' },
            { num: '03', title: 'Get a clear result', desc: 'Risk level, possible conditions, and what to do next — in plain English.' },
          ].map((s) => (
            <div key={s.num} className="flex gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold text-indigo-400 mt-0.5">{s.num}</span>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{s.title}</p>
                <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Honest section ── */}
      <section className="rounded-2xl bg-indigo-50 border border-indigo-100 px-8 py-10">
        <h2 className="text-2xl font-bold text-slate-900">We'll be honest with you.</h2>
        <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
          SkinShield is a college project. We're not doctors, and this isn't a medical product.
          What we are is a team that spent a lot of time making something genuinely useful —
          a tool that helps you understand your skin better and know when it's time to see someone.
        </p>
        <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">
          The AI model is trained on real dermatology data. The reports are generated thoughtfully.
          But please, if something looks serious — go see a doctor.
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="text-center pb-4">
        <h2 className="text-3xl font-bold text-slate-900">Give it a try.</h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto">
          It takes under a minute. No account required to see how it works.
        </p>
        <Link
          to="/screening/questionnaire"
          className="mt-6 inline-block rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Start screening
        </Link>
      </section>

    </div>
  )
}

export default HomePage


