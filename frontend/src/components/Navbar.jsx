import { useContext, useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../pages/AuthPage'
import { clearToken, clearScreeningState } from '../utils/storage'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)
  const { t, i18n } = useTranslation()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  function handleLogout() {
    logout()
    clearToken()
    clearScreeningState()
    setIsDropdownOpen(false)
    navigate('/auth')
  }

  function toggleLanguage() {
    const next = i18n.language?.startsWith('hi') ? 'en' : 'hi'
    i18n.changeLanguage(next)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            className="rounded-full border border-transparent px-4 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {t('home', 'Home')}
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-transparent px-4 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {t('about', 'About')}
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-transparent px-4 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {t('contact', 'Contact Us')}
          </Link>
          
          {/* ✅ ADDED ASHA PORTAL LINK HERE */}
          <Link
            to="/asha-login"
            className="rounded-full border border-transparent px-4 py-1.5 text-teal-600 font-semibold transition hover:bg-teal-50 hover:text-teal-700"
          >
            ASHA Portal
          </Link>

          {!user && (
            <button
              onClick={toggleLanguage}
              className="ml-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              {i18n.language?.startsWith('hi') ? 'English' : 'हिंदी'}
            </button>
          )}

          {user ? (
            <div className="ml-4 flex items-center gap-3">
              <Link
                to="/screening/questionnaire"
                className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:brightness-110"
              >
                {t('start_screening', 'Start Screening')}
              </Link>

              {/* USER PROFILE DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 rounded-full border pl-1.5 pr-3 py-1.5 transition-all duration-200 ${
                    isDropdownOpen 
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-800' 
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* CIRCULAR PROFILE PIC */}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>

                  <span className="max-w-[100px] truncate text-sm font-medium">
                    {user.name}
                  </span>
                  <svg 
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-indigo-500' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>


                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 focus:outline-none">
                    
                  
                    <div className="mb-2 border-b border-slate-100 px-3 pb-2 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {t('account', 'Account Settings')}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Link
                        to="/history"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                      >
                        {t('history', 'Scan History')}
                      </Link>
                      
                      <button
                        onClick={() => {
                          toggleLanguage()
                          setIsDropdownOpen(false)
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <span>{t('change_language', 'Language')}</span>
                        <span className="rounded-md bg-white px-2 py-0.5 text-xs font-bold text-indigo-600 shadow-sm ring-1 ring-slate-200">
                          {i18n.language?.startsWith('hi') ? 'EN' : 'हिंदी'}
                        </span>
                      </button>
                      
                      <div className="my-1 h-px w-full bg-slate-100" />
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                      >
                        {t('logout', 'Logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="ml-2 rounded-full bg-slate-900 px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t('login_register', 'Log In')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar