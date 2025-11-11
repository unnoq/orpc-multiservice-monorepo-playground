import { call } from '@orpc/server'
import { expect, it } from 'vitest'
import { router } from '../src'

it('can sign in a user', async () => {
  const user = await call(router.auth.signup, {
    email: 'user@example.com',
    name: 'Test User',
    password: 'securepassword',
  }, {
    context: {
      authToken: null,
    },
  })

  expect(user.id).toBeTypeOf('string')
  expect(user.email).toBe('user@example.com')
  expect(user.name).toBe('Test User')
})
