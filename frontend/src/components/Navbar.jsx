import { Link } from 'react-router-dom'

function Navbar() {
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
            Home
          </Link>
          <Link
            to="/about"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700"
          >
            Contact Us
          </Link>
          <Link
            to="/screening/questionnaire"
            className="rounded-full bg-linear-to-r from-indigo-600 to-violet-500 px-4 py-1.5 text-white shadow-lg shadow-indigo-600/30 transition hover:brightness-110"
          >
            Start Screening
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
