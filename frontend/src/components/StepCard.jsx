function StepCard({ title, description, step }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-700">
        Step {step}
      </p>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </article>
  )
}

export default StepCard
