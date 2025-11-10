import { pub } from './orpc'
import { createPlanet, findPlanet, listPlanets, updatePlanet } from './routers/planet'

export const router = pub.router({
  planet: {
    list: listPlanets,
    create: createPlanet,
    find: findPlanet,
    update: updatePlanet,
  },
})
