import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-slate-200 bg-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-8 pt-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="bg-linear-to-r from-indigo-300 to-violet-300 bg-clip-text text-lg font-bold text-transparent">
            SkinShield AI
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Early screening support for skin health awareness and quick next-step guidance.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Quick Links
          </h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/" className="text-slate-600 transition hover:text-indigo-600">
              Home
            </Link>
            <Link to="/about" className="text-slate-600 transition hover:text-indigo-600">
              About
            </Link>
            <Link to="/contact" className="text-slate-600 transition hover:text-indigo-600">
              Contact Us
            </Link>
            <Link
              to="/screening/questionnaire"
              className="text-slate-600 transition hover:text-indigo-600"
            >
              Start Screening
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Contact
          </h4>
          <p className="mt-3 text-sm text-slate-600">support@skinshield.ai</p>
          <p className="mt-1 text-sm text-slate-600">+91 90000 00000</p>
          <p className="mt-4 text-xs text-slate-500">
            SkinShield is an early screening platform and not a final diagnosis.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          <p>Built for awareness, speed, and accessibility.</p>
          <p>© {new Date().getFullYear()} SkinShield</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
