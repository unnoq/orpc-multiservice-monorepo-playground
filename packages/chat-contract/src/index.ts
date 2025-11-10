import { publish, subscribe } from './contract/room'

export const contract = {
  room: {
    subscribe,
    publish,
  },
}
