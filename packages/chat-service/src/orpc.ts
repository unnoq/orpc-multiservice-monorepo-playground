import type { Publisher } from '@orpc/experimental-publisher'
import type { Auth } from '@repo/auth-contract'
import { implement, ORPCError } from '@orpc/server'
import { contract } from '@repo/chat-contract'

export interface ORPCContext {
  roomPublisher: Publisher<Record<string, { message: string }>>
  getAuth: () => Promise<Auth | null>
}

export const pub = implement(contract).$context<ORPCContext>()

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
