import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="text-sm text-slate-600">The page you requested does not exist.</p>
      <Link
        to="/"
  className="inline-flex rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-400/40 transition hover:brightness-110"
      >
        Go to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
