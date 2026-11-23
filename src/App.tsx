
import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { MapPin } from 'lucide-react'

import Accueil from './pages/Accueil'
import Apropos from './pages/Apropos'
import Horaires from './pages/Horaires'
import Contact from './pages/Contact'
import MassesModal from './components/MassesModal'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'

const PAGES = {
  accueil: Accueil,
  apropos: Apropos,
  horaires: Horaires,
  contact: Contact
}

type Route = keyof typeof PAGES

const NAV: [Route, string][] = [
  ['accueil', 'Accueil'],
  ['apropos', 'À propos'],
  ['horaires', 'Horaires'],
  ['contact', 'Contact']
]

type AdminRoute = 'login' | 'dashboard'

const getPublicRoute = (): Route => {
  const hash = location.hash.slice(1)
  return hash in PAGES ? hash as Route : 'accueil'
}

const getAdminRoute = (): AdminRoute | null => {
  const path = location.pathname

  if (path === '/admin/login') return 'login'
  if (path === '/admin') return 'dashboard'

  return null
}

export default function App() {
  const [route, setRoute] = useState<Route>(getPublicRoute)
  const [adminRoute, setAdminRoute] = useState<AdminRoute | null>(
    getAdminRoute
  )
  const [massesOpen, setMassesOpen] = useState(false)

  useEffect(() => {
    const handleNavigation = () => {
      setAdminRoute(getAdminRoute())
      setRoute(getPublicRoute())
      setMassesOpen(false)
      window.scrollTo(0, 0)
    }

    window.addEventListener('hashchange', handleNavigation)
    window.addEventListener('popstate', handleNavigation)

    return () => {
      window.removeEventListener('hashchange', handleNavigation)
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [])

  // Espace administrateur
  if (adminRoute === 'login') {
    return (
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          <motion.div
            key="admin-login"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AdminLogin
              onLoginSuccess={() => {
                window.history.pushState({}, '', '/admin')
                setAdminRoute('dashboard')
                window.scrollTo(0, 0)
              }}
            />
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    )
  }

  if (adminRoute === 'dashboard') {
    return (
      <MotionConfig reducedMotion="user">
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      </MotionConfig>
    )
  }

  // Site public
  const Page = PAGES[route]

  return (
    <MotionConfig reducedMotion="user">
      <header className="sticky top-0 z-30 border-b border-sable/50 bg-ivoire/85 backdrop-blur">
        <div className="wrap flex min-h-16 items-center justify-between gap-3">
          <a
            href="#accueil"
            className="flex items-center gap-2 font-serif text-lg font-bold leading-none"
          >
            <span className="grid size-9 place-items-center rounded-t-xl rounded-b bg-brique text-white" aria-hidden>
              ✝
            </span>
            <span className="hidden sm:inline">
              Saint Thomas d’Aquin
            </span>
          </a>

          <nav aria-label="Navigation principale" className="flex gap-1 overflow-x-auto">
            {NAV.map(([k, l]) => (
              <a
                key={k}
                href={'#' + k}
                aria-current={route === k ? 'page' : undefined}
                className={
                  'whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold sm:px-4 ' +
                  (route === k
                    ? 'bg-brique text-white'
                    : 'hover:bg-sable/30')
                }
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={route}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Page />
        </motion.main>
      </AnimatePresence>


      <button
        type="button"
        onClick={() => setMassesOpen(true)}
        className="fixed bottom-4 right-4 z-30 flex min-h-12 items-center gap-2 rounded-full border border-sable/60 bg-white px-4 text-sm font-bold shadow-xl"
      >
        <MapPin size={18} className="text-brique" />
        <span className="hidden sm:inline">
          Horaires des messes &amp; itinéraire
        </span>
        <span className="sm:hidden">Horaires</span>
      </button>

      <MassesModal
        open={massesOpen}
        onClose={() => setMassesOpen(false)}
      />
    </MotionConfig>
  )
}
