import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AboutPage from './pages/AboutPage'
import AuthPage, { AuthProvider } from './pages/AuthPage'
import ContactPage from './pages/ContactPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import QuestionnairePage from './pages/QuestionnairePage'
import ReportPage from './pages/ReportPage'
import ResultPage from './pages/ResultPage'
import UploadPage from './pages/UploadPage'
import HistoryPage from './pages/HistoryPage' // <--- ADDED IMPORT

function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-indigo-200/55 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-200/55 blur-3xl" />
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* ---> ADDED ROUTE HERE <--- */}
            <Route path="/history" element={<HistoryPage />} />

            <Route path="/screening/questionnaire" element={<QuestionnairePage />} />
            <Route path="/screening/upload" element={<UploadPage />} />
            <Route path="/screening/result" element={<ResultPage />} />
            <Route path="/screening/report/:screeningId" element={<ReportPage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App