import type { ContractRouterClient, InferContractRouterInputs, InferContractRouterOutputs } from '@orpc/contract'
import type { contract } from '@repo/chat-contract'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

export type ChatServiceInputs = InferContractRouterInputs<typeof contract>
export type ChatServiceOutputs = InferContractRouterOutputs<typeof contract>

export const chatServiceClient: ContractRouterClient<typeof contract> = createORPCClient(
  new RPCLink({
    url: `${import.meta.env.VITE_API_URL}/rpc/chat`,
    headers: () => {
      const authToken = localStorage.getItem('authToken')
      return authToken ? { Authorization: `Bearer ${authToken}` } : {}
    },
  }),
)

export const chatServiceOrpc = createTanstackQueryUtils(chatServiceClient, {
  path: ['__chat__'],
})
