import type { AuthServiceOutputs } from '../lib/service-auth'
import { useEffect, useState } from 'react'
import { authServiceClient } from '../lib/service-auth'

export function RequireLogin(props: { children: React.ReactNode }) {
  const [me, setMe] = useState<AuthServiceOutputs['auth']['me'] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    void (async () => {
      try {
        const me = await authServiceClient.auth.me(undefined, { signal: controller.signal })
        setMe(me)
      }
      finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      controller.abort()
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  const login = async (event: React.FormEvent) => {
    event.preventDefault()
    const form = new FormData(event.target as HTMLFormElement)

    try {
      const { token } = await authServiceClient.auth.signin({
        email: form.get('email') as string,
        password: form.get('password') as string,
      })
      localStorage.setItem('authToken', token)

      const me = await authServiceClient.auth.me()
      setMe(me)
    }
    catch (error) {
      // eslint-disable-next-line no-alert
      alert(error)
    }
  }

  if (!me) {
    return (
      <div>
        <div>Please log in to continue.</div>

        <form onSubmit={login}>
          <label>
            Email:
            <input type="email" name="email" required placeholder="hi@gmail.com" />
          </label>
          <label>
            Password:
            <input type="password" name="password" required placeholder="password" />
          </label>
          <button type="submit">Log In</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      {props.children}
      <button
        onClick={() => {
          localStorage.removeItem('authToken')
          setMe(null)
        }}
      >
        Logout
      </button>
    </div>
  )
}
