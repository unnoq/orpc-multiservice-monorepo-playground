import { createPlanet, findPlanet, listPlanets, updatePlanet } from './contract/planet'

export * from './schemas/planet'

export const contract = {
  planet: {
    list: listPlanets,
    create: createPlanet,
    find: findPlanet,
    update: updatePlanet,
  },
}
