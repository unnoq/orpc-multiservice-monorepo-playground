import { implement } from '@orpc/server'
import { contract } from '@repo/auth-contract'

export interface ORPCContext {
  authToken: string | null
}

export const pub = implement(contract).$context<ORPCContext>()

export const authed = pub.use(async ({ context, next }) => {
  if (!context.authToken) {
    throw new Error('UNAUTHORIZED')
  }

  return next({
    context: {
      auth: {
        id: '28aa6286-48e9-4f23-adea-3486c86acd55',
      },
    },
  })
})
