import { useTranslation } from 'react-i18next'
import { getSymptomQuestions } from '../constants/symptoms'

function SymptomForm({ values, onChange, onSubmit, isSubmitting }) {
  const { t } = useTranslation()
  const symptomQuestions = getSymptomQuestions(t)

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {symptomQuestions.map((question) => (
        <label key={question.key} className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">{question.label}</span>

          {question.type === 'select' ? (
            <select
              value={values[question.key]}
              onChange={(event) => onChange(question.key, event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-indigo-200 transition placeholder:text-slate-400 focus:ring-2"
            >
              {question.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="number"
              min={question.min}
              max={question.max}
              placeholder={question.placeholder}
              value={values[question.key]}
              onChange={(event) => onChange(question.key, event.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none ring-indigo-200 transition placeholder:text-slate-400 focus:ring-2"
            />
          )}
        </label>
      ))}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? t('saving_symptoms') : t('continue_upload')}
      </button>
    </form>
  )
}

export default SymptomForm
