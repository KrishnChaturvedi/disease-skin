import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthPage'
import { saveToken } from '../utils/storage'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function AshaAuthPage() {
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
    ashaId: '',
    village: '',
  })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
    setSuccess('')
  }

  function switchMode(mode) {
    setIsLogin(mode)
    setError('')
    setSuccess('')
    setForm({ name: '', email: '', password: '', ashaId: '', village: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = isLogin
        ? `${API_BASE}/api/asha/login`
        : `${API_BASE}/api/asha/register`

      const body = isLogin
        ? { email: form.email, password: form.password }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
            ashaId: form.ashaId,
            village: form.village,
          }

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

      saveToken(data.token)
      localStorage.setItem('skinshield_user', JSON.stringify({ ...data.user, role: 'asha' }))
      login({ ...data.user, role: 'asha' }, data.token)

      setSuccess(isLogin ? 'Login successful! Redirecting...' : 'Registered! Redirecting...')
      setTimeout(() => navigate('/asha-dashboard'), 1000)

    } catch (err) {
      console.error('ASHA auth error:', err)
      setError('Network error. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        
        <div className="text-center mb-8">
          <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-1">
            ASHA Worker Portal
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {isLogin ? 'Welcome back' : 'Register as ASHA'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin
              ? 'Login to screen patients in your village'
              : 'Create your ASHA worker account'}
          </p>
        </div>

 
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-5">

          
          <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => switchMode(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                isLogin
                  ? 'bg-white text-teal-600 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchMode(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                !isLogin
                  ? 'bg-white text-teal-600 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Register
            </button>
          </div>

  
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

          
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Sunita Devi"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">ASHA Worker ID</label>
                  <input
                    type="text"
                    name="ashaId"
                    value={form.ashaId}
                    onChange={handleChange}
                    placeholder="e.g. ASHA-UP-00123"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Village Name</label>
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
              </>
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
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
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 text-sm outline-none ring-teal-200 transition placeholder:text-slate-400 focus:ring-2 focus:border-teal-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-green-500 px-4 py-2.5 font-semibold text-white shadow-lg shadow-teal-400/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 text-sm"
            >
              {isLoading
                ? isLogin ? 'Logging in...' : 'Registering...'
                : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Not an ASHA worker?{' '}
            <a href="/auth" className="text-teal-600 font-semibold hover:underline">
              Go to regular login
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}

export default AshaAuthPage
