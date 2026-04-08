function ReportSection({ title, content }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
        {content || 'No content available.'}
      </p>
    </section>
  )
}

export default ReportSection
