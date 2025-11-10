import type { ContractRouterClient, InferContractRouterInputs, InferContractRouterOutputs } from '@orpc/contract'
import type { contract } from '@repo/planet-contract'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

export type PlanetServiceInputs = InferContractRouterInputs<typeof contract>
export type PlanetServiceOutputs = InferContractRouterOutputs<typeof contract>

export const planetServiceClient: ContractRouterClient<typeof contract> = createORPCClient(
  new RPCLink({
    url: `${import.meta.env.VITE_API_URL}/rpc/planet`,
    headers: () => {
      const authToken = localStorage.getItem('authToken')
      return authToken ? { Authorization: `Bearer ${authToken}` } : {}
    },
  }),
)

export const planetServiceOrpc = createTanstackQueryUtils(planetServiceClient, {
  path: ['__planet__'],
})
