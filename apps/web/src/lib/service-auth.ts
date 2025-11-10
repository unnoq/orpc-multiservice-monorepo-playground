import type { ContractRouterClient, InferContractRouterInputs, InferContractRouterOutputs } from '@orpc/contract'
import type { contract } from '@repo/auth-contract'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

export type AuthServiceInputs = InferContractRouterInputs<typeof contract>
export type AuthServiceOutputs = InferContractRouterOutputs<typeof contract>

export const authServiceClient: ContractRouterClient<typeof contract> = createORPCClient(
  new RPCLink({
    url: `${import.meta.env.VITE_API_URL}/rpc/auth`,
    headers: () => {
      const authToken = localStorage.getItem('authToken')
      return authToken ? { Authorization: `Bearer ${authToken}` } : {}
    },
  }),
)

export const authServiceOrpc = createTanstackQueryUtils(authServiceClient, {
  path: ['__auth__'],
})
