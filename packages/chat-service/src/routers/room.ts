import { authed } from '../orpc'

export const subscribe = authed
  .room
  .subscribe
  .handler(async ({ input, context, lastEventId, signal }) => {
    return context.roomPublisher.subscribe(input.room, { lastEventId, signal })
  })

export const publish = authed
  .room
  .publish
  .handler(async ({ input, context }) => {
    await context.roomPublisher.publish(input.room, { message: input.message })
  })
