import { Link } from 'react-router-dom'
import StepCard from '../components/StepCard'

const steps = [
  {
    step: 1,
    title: 'Answer Symptom Questions',
    description: 'Share key details like duration, itching, pain, sun exposure, and history.',
  },
  {
    step: 2,
    title: 'Upload Skin Photo',
    description: 'Upload a smartphone photo for AI-based skin condition screening.',
  },
  {
    step: 3,
    title: 'Get Triage Result',
    description: 'Receive risk level and next actions, including home care or doctor links.',
  },
]

function HomePage() {
  return (
    <div className="space-y-10">
  <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-100 via-purple-50 to-violet-100 p-8 text-slate-800 shadow-xl shadow-indigo-200/40 xl:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-300/35 blur-2xl" />
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
          AI-Powered Early Screening
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
          SkinShield for Smart Early Detection
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-700 sm:text-base">
          Early skin disease and skin cancer triage for Indian users. This app supports
          awareness, quick action, and doctor consultation guidance.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            to="/screening/questionnaire"
            className="inline-flex rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110"
          >
            Start Screening
          </Link>
          <Link
            to="/about"
            className="inline-flex rounded-full border border-indigo-200 bg-white/70 px-5 py-2.5 font-semibold text-indigo-700 transition hover:bg-white"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-indigo-100 bg-white/70 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-indigo-700">Workflow</p>
            <p className="mt-1 text-sm font-semibold">Questionnaire → Image → Result</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white/70 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-indigo-700">Support</p>
            <p className="mt-1 text-sm font-semibold">eSanjeevani + Hospital Finder</p>
          </div>
          <div className="rounded-xl border border-indigo-100 bg-white/70 px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-indigo-700">Goal</p>
            <p className="mt-1 text-sm font-semibold">Faster action, lower risk</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((item) => (
          <StepCard
            key={item.step}
            step={item.step}
            title={item.title}
            description={item.description}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Why SkinShield?</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Skin conditions often look minor at first, but early action matters. SkinShield helps
          users identify risk quickly using a guided process and simple language so they can
          decide the right next step without delay.
        </p>
      </section>
    </div>
  )
}

export default HomePage
