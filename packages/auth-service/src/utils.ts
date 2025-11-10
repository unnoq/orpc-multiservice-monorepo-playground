import type { Auth } from '@repo/auth-contract'

export async function getAuth(token: string | null): Promise<Auth | null> {
  if (!token) {
    return null
  }

  return {
    userId: `user-${token}`,
  }
}
