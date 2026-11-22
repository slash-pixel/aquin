
import { useState, type FormEvent } from 'react'

type LoginResponse = {
  token?: string
  message?: string
  error?: string
}

type AdminLoginProps = {
  onLoginSuccess?: (data: LoginResponse) => void
}

const API_URL =
  import.meta.env.VITE_API_URL || 'https://aqbe.onrender.com/api'

export default function AdminLogin({
  onLoginSuccess
}: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre adresse email et votre mot de passe.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      })

      const data: LoginResponse = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          'Identifiants incorrects. Veuillez réessayer.'
        )
      }

      if (!data.token) {
        throw new Error('Le serveur n’a pas retourné de jeton de connexion.')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('jwt_token', data.token)

      onLoginSuccess?.(data)

      if (!onLoginSuccess) {
        window.location.assign('/admin')
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue. Vérifiez votre connexion.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] px-4 py-10">

      {/* Décoration d'arrière-plan */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-red-100/70 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-red-50 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#991b1b 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-[fadeIn_0.7s_ease-out]">

        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/25 transition duration-300 hover:rotate-3 hover:scale-110">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z" />
              <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Administration
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Bienvenue
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Connectez-vous à votre espace administrateur.
          </p>
        </div>

        {/* Formulaire */}
        <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_20px_70px_-25px_rgba(0,0,0,0.18)] sm:p-9">

          <div className="mb-7">
            <h2 className="text-xl font-bold text-gray-900">
              Connexion
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Entrez vos identifiants pour continuer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Adresse email
              </label>

              <div className="group relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-red-600"
                >
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m4 7 8 6 8-6" />
                </svg>

                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Mot de passe
                </label>
              </div>

              <div className="group relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-red-600"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v3" />
                </svg>

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/70 py-3.5 pl-12 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-red-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
                      <path d="M3 3 21 21" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A11 11 0 0 1 12 5c5 0 8.5 4.5 9 7-.2 1.1-1.1 2.5-2.4 3.7" />
                      <path d="M6.2 6.2C3.9 7.8 2.4 10 3 12c.5 2.5 4 7 9 7 1.2 0 2.4-.3 3.4-.8" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
                      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div
                role="alert"
                className="flex animate-[shake_0.35s_ease-in-out] items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 h-5 w-5 shrink-0">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5m0 3h.01" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-red-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/25 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Accès sécurisé
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-green-600">
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Vos informations sont protégées.
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-gray-400">
          AQBE · Espace d'administration
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  )
}
