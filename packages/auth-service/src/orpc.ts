import { implement, ORPCError } from '@orpc/server'
import { contract } from '@repo/auth-contract'
import { getAuth } from './utils'

export interface ORPCContext {
  authToken: string | null
}

export const pub = implement(contract).$context<ORPCContext>()

export const authed = pub.use(async ({ context, next }) => {
  const auth = await getAuth(context.authToken)

  if (!auth) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({
    context: {
      auth,
    },
  })
})
