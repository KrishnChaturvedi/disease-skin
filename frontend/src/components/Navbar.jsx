import { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../pages/AuthPage.jsx'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleStartScreening() {
    if (user) {
      navigate('/screening')
    } else {
      navigate('/auth')
    }
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm">

      {/* ── Logo ── */}
      <Link to="/" className="text-indigo-600 font-bold text-lg tracking-tight">
        SkinShield AI
      </Link>

      {/* ── Nav Links ── */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm text-slate-600 hover:text-slate-900 transition">
          Home
        </Link>
        <Link to="/about" className="text-sm text-slate-600 hover:text-slate-900 transition">
          About
        </Link>
        <Link to="/contact" className="text-sm text-slate-600 hover:text-slate-900 transition">
          Contact Us
        </Link>
      </div>

      {/* ── Auth Buttons ── */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Logged in — show user name + logout */}
            <span className="text-sm text-slate-600 hidden md:block">
              Hi, <span className="font-semibold text-slate-800">{user.name}</span>
            </span>
            <button
              onClick={handleStartScreening}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-400/30 transition hover:brightness-110"
            >
              Start Screening
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Not logged in — show login + start screening */}
            <button
              onClick={() => navigate('/auth')}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </button>
            <button
              onClick={handleStartScreening}
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-400/30 transition hover:brightness-110"
            >
              Start Screening
            </button>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar

