import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AshaPatientInfoPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    patientName: '',
    age: '',
    gender: 'female',
    village: '',
    phone: '',
  })
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.patientName.trim()) return setError('Patient name is required.')
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 120)
      return setError('Enter a valid age.')
    if (!form.village.trim()) return setError('Village name is required.')

    // Save patient info — available to QuestionnairePage, UploadPage, ResultPage
    sessionStorage.setItem('asha_patient', JSON.stringify(form))

    // Hand off to your existing screening flow
    navigate('/screening/questionnaire')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-1">
            ASHA Screening
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Patient Details</h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter the patient's basic info before starting the screening.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">

          {/* Back link */}
          <button
            type="button"
            onClick={() => navigate('/asha-dashboard')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to dashboard
          </button>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Patient Full Name *</label>
              <input
                type="text"
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="e.g. Sunita Devi"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Years"
                  min={1}
                  max={120}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition focus:ring-2 focus:border-teal-400"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Village / Area *</label>
              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="e.g. Rampur, UP"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
                maxLength={10}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-green-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-teal-400/40 transition hover:brightness-110 text-sm"
            >
              Continue to Screening →
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default AshaPatientInfoPage
