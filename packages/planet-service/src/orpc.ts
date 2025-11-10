import type { Auth } from '@repo/auth-contract'
import { implement, ORPCError } from '@orpc/server'
import { contract } from '@repo/planet-contract'
import { dbProviderMiddleware } from './middlewares/db'

export interface ORPCContext {
  getAuth: () => Promise<Auth | null>
}

export const pub = implement(contract)
  .$context<ORPCContext>()
  .use(dbProviderMiddleware)

export const authed = pub.use(async ({ context, next }) => {
  const auth = await context.getAuth()

  if (!auth) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({
    context: {
      auth,
    },
  })
})
