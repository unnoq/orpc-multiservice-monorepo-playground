import { eventIterator, oc } from '@orpc/contract'
import * as z from 'zod'

export const subscribe = oc
  .route({
    method: 'GET',
    path: '/room/subscribe',
    summary: 'Subscribe to a room',
    tags: ['Rooms'],
  })
  .input(
    z.object({
      room: z.string().min(1),
    }),
  )
  .output(
    eventIterator(z.object({ message: z.string() })),
  )

export const publish = oc
  .route({
    method: 'POST',
    path: '/room/publish',
    summary: 'Publish a message to a room',
    tags: ['Rooms'],
  })
  .input(
    z.object({
      room: z.string().min(1),
      message: z.string().min(1),
    }),
  )
