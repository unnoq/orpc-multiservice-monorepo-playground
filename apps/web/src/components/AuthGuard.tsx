import type { AuthServiceOutputs } from '../lib/service-auth'
import { useEffect, useState } from 'react'
import { authServiceClient } from '../lib/service-auth'
import { InfoMessage } from './ui/InfoMessage'
import { InterfaceWindow } from './ui/InterfaceWindow'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<AuthServiceOutputs['auth']['me'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function checkAuth() {
      try {
        const userData = await authServiceClient.auth.me(undefined, {
          signal: controller.signal,
        })
        setUser(userData)
      }
      finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void checkAuth()

    return () => {
      controller.abort()
    }
  }, [])

  if (isLoading) {
    return <LoadingSpinner text="Authenticating..." />
  }

  if (!user) {
    return <LoginForm onLoginSuccess={setUser} />
  }

  return <>{children}</>
}

interface LoginFormProps {
  onLoginSuccess: (user: AuthServiceOutputs['auth']['me']) => void
}

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const email = form.get('email') as string
    const password = form.get('password') as string

    try {
      const { token } = await authServiceClient.auth.signin({
        email,
        password,
      })

      localStorage.setItem('authToken', token)

      const user = await authServiceClient.auth.me()
      onLoginSuccess(user)
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      console.error('Login error:', err)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <InterfaceWindow
        tabs={[{ label: 'LOG IN', isActive: true }]}
        contentPadding={30}
      >
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <InfoMessage className="mb-20">
            Please log in to continue.
          </InfoMessage>

          {error && (
            <div className="message message-error mb-20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                required
                placeholder="hi@gmail.com"
                disabled={isSubmitting}
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                required
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
            </label>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </InterfaceWindow>
    </div>
  )
}
