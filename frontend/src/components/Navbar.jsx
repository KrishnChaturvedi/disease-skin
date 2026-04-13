import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../pages/AuthPage'
import { clearToken, clearScreeningState } from '../utils/storage'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const { t, i18n } = useTranslation()

  function handleLogout() {
    logout()
    clearToken()
    clearScreeningState()
    navigate('/auth')
  }

  function toggleLanguage() {
    const next = i18n.language.startsWith('hi') ? 'en' : 'hi'
    i18n.changeLanguage(next)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="bg-linear-to-r from-indigo-300 to-violet-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent"
        >
          SkinShield AI
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium">
          <Link
            to="/"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
          >
            {t('home')}
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
          >
            {t('about')}
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
          >
            {t('contact')}
          </Link>

          {/* ✅ Language toggle button */}
          <button
            onClick={toggleLanguage}
            className="rounded-full border border-indigo-300 px-4 py-1.5 text-indigo-600 text-sm font-semibold transition hover:bg-indigo-50"
          >
            {i18n.language.startsWith('hi') ? 'EN' : 'हिंदी'}
          </button>

          {user ? (
            <>
              {/* NEW: History Link added here */}
              <Link
                to="/history"
                className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
              >
                {t('history', 'History')}
              </Link>
              
              <Link
                to="/screening/questionnaire"
                className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-1.5 text-white shadow-lg shadow-indigo-600/30 transition hover:brightness-110"
              >
                {t('start_screening')}
              </Link>
              <span className="hidden text-xs text-slate-500 sm:inline">
                {t('hi_user')}, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:border-rose-400 hover:text-rose-600"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-1.5 text-white shadow-lg shadow-indigo-600/30 transition hover:brightness-110"
            >
              {t('login_register')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar