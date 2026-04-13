import { useState, useContext, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken } from '../utils/storage'

// ── Auth Context ──────────────────────────────────────────────────────────────
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skinshield_user')
    return saved ? JSON.parse(saved) : null
  })

  function login(userData, token) {
    saveToken(token)
    localStorage.setItem('skinshield_user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('skinshield_token')
    localStorage.removeItem('skinshield_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  function toggleMode() {
    setIsLogin((prev) => !prev)
    setError('')
    setSuccess('')
    setForm({ name: '', email: '', password: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isLogin
        ? 'http://localhost:5000/api/users/login'
        : 'http://localhost:5000/api/users/register'

      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }

      if (isLogin) {
        login(data.user, data.token)
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => navigate('/'), 1000)
      } else {
        // ✅ NEW FIX: Immediately log the user in after registration and redirect!
        login(data.user, data.token)
        setSuccess('Account created successfully! Redirecting...')
        setTimeout(() => navigate('/'), 1000)
      }

    } catch (err) {
      console.error('Auth error:', err)
      setError('Network error. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-1">SkinShield AI</p>
          <h1 className="text-3xl font-bold text-slate-900">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin ? 'Login to continue your screening' : 'Start your free skin screening today'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">

          {/* Toggle */}
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); setForm({ name: '', email: '', password: '' }) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                isLogin
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); setForm({ name: '', email: '', password: '' }) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                !isLogin
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-indigo-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-indigo-400"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-indigo-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-indigo-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-indigo-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 text-sm"
            >
              {isLoading
                ? isLogin ? 'Logging in...' : 'Creating account...'
                : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Footer toggle */}
          <p className="text-center text-sm text-slate-500">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}

export default AuthPage