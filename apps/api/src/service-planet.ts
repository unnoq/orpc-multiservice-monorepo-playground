import { LoggingHandlerPlugin } from '@orpc/experimental-pino'
import { OpenAPIHandler } from '@orpc/openapi/node'
import { RPCHandler } from '@orpc/server/node'
import { router } from '@repo/planet-service'
import { corsPlugin, logger } from './shared'

export const planetServiceRPCHandler = new RPCHandler(router, {
  plugins: [
    corsPlugin,
    new LoggingHandlerPlugin({
      logger: logger.child({ service: 'planet-rpc' }),
      logRequestAbort: true,
      logRequestResponse: true,
    }),
  ],
})

export const planetServiceOpenAPIHandler = new OpenAPIHandler(router, {
  plugins: [
    corsPlugin,
    new LoggingHandlerPlugin({
      logger: logger.child({ service: 'planet-openapi' }),
      logRequestAbort: true,
      logRequestResponse: true,
    }),
  ],
})
