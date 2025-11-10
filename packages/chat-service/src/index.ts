import { pub } from './orpc'
import { publish, subscribe } from './routers/room'

export const router = pub.router({
  room: {
    subscribe,
    publish,
  },
})
