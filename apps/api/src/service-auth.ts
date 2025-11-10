import { LoggingHandlerPlugin } from '@orpc/experimental-pino'
import { OpenAPIHandler } from '@orpc/openapi/node'
import { RPCHandler } from '@orpc/server/node'
import { router } from '@repo/auth-service'
import { corsPlugin, logger } from './shared'

export const authServiceRPCHandler = new RPCHandler(router, {
  plugins: [
    corsPlugin,
    new LoggingHandlerPlugin({
      logger: logger.child({ service: 'auth-rpc' }),
      logRequestAbort: true,
      logRequestResponse: true,
    }),
  ],
})

export const authServiceOpenAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    corsPlugin,
    new LoggingHandlerPlugin({
      logger: logger.child({ service: 'auth-openapi' }),
      logRequestAbort: true,
      logRequestResponse: true,
    }),
  ],
})
