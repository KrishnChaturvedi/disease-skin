function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-16">

      {/* ── Header ── */}
      <section className="pt-4">
        <p className="text-sm font-medium text-indigo-500 tracking-wide">About</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 leading-tight max-w-xl">
          We're students who wanted to build something real.
        </h1>
        <p className="mt-5 text-lg text-slate-500 leading-relaxed">
          SkinShield started as a final year project idea — what if we could use AI to help
          people catch skin problems early, especially in places where seeing a dermatologist
          isn't easy or affordable?
        </p>
      </section>

      {/* ── Story ── */}
      <section className="space-y-5 border-l-2 border-indigo-100 pl-6">
        <p className="text-slate-600 leading-relaxed">
          We've all been in that situation — something looks off on your skin, you don't know
          if it's serious, and booking a dermatologist takes weeks. So you either panic or ignore it.
          Neither is great.
        </p>
        <p className="text-slate-600 leading-relaxed">
          SkinShield is our attempt at a middle ground. A quick, structured way to get a sense
          of what you're dealing with, understand the risk level, and know whether you need to
          act now or just keep an eye on it.
        </p>
        <p className="text-slate-600 leading-relaxed">
          We trained a MobileNetV3 model on the DermNet dataset — 23 skin condition classes,
          real clinical images, not just textbook examples. Combined with a symptom questionnaire
          and an AI-generated report, it gives you something more useful than a Google search
          and less scary than WebMD.
        </p>
      </section>

      {/* ── What we built ── */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900">What we actually built</h2>
        <div className="mt-6 space-y-4">
          {[
            { title: 'ML Model', desc: 'MobileNetV3 trained on DermNet data with test-time augmentation. Outputs top 3 predictions with confidence scores.' },
            { title: 'AI Report Generation', desc: 'A LangChain agent powered by Groq LLaMA and Gemini that turns ML output + symptom answers into a readable patient report.' },
            { title: 'Node.js Backend', desc: 'Express API handling auth, image uploads to Cloudinary, scan history in MongoDB, and PDF generation.' },
            { title: 'React Frontend', desc: 'A clean, mobile-friendly interface built with Tailwind CSS. Works on any smartphone browser.' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Honest note ── */}
      <section className="rounded-2xl bg-slate-50 border border-slate-200 px-7 py-8">
        <h2 className="font-bold text-slate-900">A note on limitations</h2>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          We want to be upfront — SkinShield is a screening tool, not a diagnostic one.
          The AI can be wrong. Confidence scores aren't certainty. If you're worried about
          something on your skin, please see a doctor. We built this to help people take
          that step sooner, not to replace it.
        </p>
      </section>

    </div>
  )
}

export default AboutPage


