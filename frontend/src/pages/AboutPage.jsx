import { useTranslation } from 'react-i18next'

function AboutPage() {
  const { t } = useTranslation()

  const built = [
    { 
      titleKey: 'ml_title', 
      descKey: 'ml_desc', 
      icon: (
        <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    { 
      titleKey: 'ai_title', 
      descKey: 'ai_desc', 
      icon: (
        <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      titleKey: 'backend_title', 
      descKey: 'backend_desc', 
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    { 
      titleKey: 'frontend_title', 
      descKey: 'frontend_desc', 
      icon: (
        <svg className="w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ]

  const team = [
    { name: 'Saif Ahmad', role: 'Full Stack Developer', email: 'saifahmad45890@gmail.com', initials: 'SA', color: 'bg-blue-100 text-blue-600' },
    { name: 'Harshit Agrawal', role: 'Full Stack Developer', email: 'harshit0114ag@gmail.com', initials: 'HA', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Nikhil', role: 'Full Stack Developer', email: 'nikhilverma897939@gmail.com', initials: 'NI', color: 'bg-amber-100 text-amber-600' },
    { name: 'Raghav', role: 'ML Developer', email: 'sunitaraghavchaturvedi@gmail.com', initials: 'RA', color: 'bg-purple-100 text-purple-600' },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl space-y-24 px-4 py-12 sm:px-6 lg:px-8">

   
      <section className="text-center pt-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl leading-tight max-w-3xl mx-auto">
          {t('about_title')}
        </h1>
        <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
          SkinShield started as our hackathon project. We wondered if we could use AI to help people catch skin problems early, especially in places where seeing a dermatologist isn't easy or affordable.
        </p>
      </section>

 
      <section className="relative mx-auto max-w-3xl rounded-3xl bg-white p-8 sm:p-10 shadow-sm border border-slate-200">
        <div className="absolute -left-3 top-10 h-24 w-1.5 rounded-full bg-indigo-500"></div>
        <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
          <p>{t('about_p1')}</p>
          <p>{t('about_p2')}</p>
          <p>{t('about_p3')}</p>
        </div>
      </section>

    
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('what_we_built')}</h2>
          <p className="mt-3 text-lg text-slate-500">The technology stack powering our system.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {built.map((item) => (
            <div key={item.titleKey} className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 flex flex-col items-center text-center">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-indigo-50">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">{t(item.titleKey)}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Meet the Team</h2>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-start text-center sm:text-left">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-bold text-xl tracking-wider ${member.color}`}>
                {member.initials}
              </div>
              <div className="flex flex-col flex-grow">
                <span className="font-bold text-slate-900 text-lg">{member.name}</span>
                <span className="font-semibold text-indigo-600 text-sm mt-1">{member.role}</span>
                <a href={`mailto:${member.email}`} className="text-slate-500 text-sm mt-2 hover:text-indigo-600 transition-colors">
                  {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

     
      <section className="mx-auto max-w-4xl rounded-3xl bg-linear-to-br from-slate-50 to-indigo-50/30 border border-slate-200 p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-2xl">
            💡
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">A note on limitations</h2>
            <p className="text-slate-600 leading-relaxed">
              We want to be upfront. SkinShield is a screening tool, not a diagnostic one. The AI can be wrong, and confidence scores aren't certainty. If you are worried about something on your skin, please see a doctor. We built this to help people take that step sooner, not to replace it.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default AboutPage