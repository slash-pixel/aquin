
import { useEffect, useState, type ReactNode } from 'react'

const API_URL =
  import.meta.env.VITE_API_URL || 'https://aqbe.onrender.com/api'

type Props = {
  children: ReactNode
}

export default function AdminProtectedRoute({ children }: Props) {
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [networkError, setNetworkError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const redirectToLogin = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('jwt_token')

      window.history.replaceState({}, '', '/admin/login')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }

    const verify = async () => {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('jwt_token')

      if (!token) {
        redirectToLogin()
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/admin/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          },
          signal: controller.signal
        })

        if (!response.ok) {
          redirectToLogin()
          return
        }

        setAuthorized(true)
        setNetworkError(false)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return

        setNetworkError(true)
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    verify()

    return () => controller.abort()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
      </div>
    )
  }

  if (networkError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <p className="text-sm text-gray-600">
          Impossible de vérifier votre session. Vérifiez votre connexion.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-600">
          Redirection vers la connexion...
        </p>
      </div>
    )
  }

  return <>{children}</>
}
