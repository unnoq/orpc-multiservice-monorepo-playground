import { LoggingHandlerPlugin } from '@orpc/experimental-pino'
import { OpenAPIHandler } from '@orpc/openapi/node'
import { RPCHandler } from '@orpc/server/node'
import { router } from '@repo/chat-service'
import { corsPlugin, logger } from './shared'

export const chatServiceRPCHandler = new RPCHandler(router, {
  plugins: [
    corsPlugin,
    new LoggingHandlerPlugin({
      logger: logger.child({ service: 'chat-rpc' }),
      logRequestAbort: true,
      logRequestResponse: true,
    }),
  ],
})

export const chatServiceOpenAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    corsPlugin,
    new LoggingHandlerPlugin({
      logger: logger.child({ service: 'chat-openapi' }),
      logRequestAbort: true,
      logRequestResponse: true,
    }),
  ],
})
