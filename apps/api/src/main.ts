#!/usr/bin/env node

import { createServer } from 'node:http'
import process from 'node:process'
import { MemoryPublisher } from '@orpc/experimental-publisher/memory'
import { getAuth } from '@repo/auth-service'
import { authServiceOpenAPIHandler, authServiceRPCHandler } from './service-auth'
import { chatServiceOpenAPIHandler, chatServiceRPCHandler } from './service-chat'
import { planetServiceOpenAPIHandler, planetServiceRPCHandler } from './service-planet'
import { handleSpecRequest } from './spec'
import { once } from './utils'

const roomPublisher = new MemoryPublisher<any>()

const BEARER_REGEX = /^Bearer ?/

const server = createServer(async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    // Simulate network latency in development mode
    await new Promise(resolve => setTimeout(resolve, 150))
  }

  const authToken = req.headers.authorization?.replace(BEARER_REGEX, '') || null

  const authServiceRPCHandleResult = await authServiceRPCHandler.handle(req, res, {
    prefix: '/rpc/auth',
    context: {
      authToken,
    },
  })

  if (authServiceRPCHandleResult.matched) {
    return
  }

  const authServiceOpenAPIHandleResult = await authServiceOpenAPIHandler.handle(req, res, {
    prefix: '/api/auth',
    context: {
      authToken,
    },
  })

  if (authServiceOpenAPIHandleResult.matched) {
    return
  }

  const planetServiceRPCHandleResult = await planetServiceRPCHandler.handle(req, res, {
    prefix: '/rpc/planet',
    context: {
      getAuth: once(() => getAuth(authToken)),
    },
  })

  if (planetServiceRPCHandleResult.matched) {
    return
  }

  const planetServiceOpenAPIHandleResult = await planetServiceOpenAPIHandler.handle(req, res, {
    prefix: '/api/planet',
    context: {
      getAuth: once(() => getAuth(authToken)),
    },
  })

  if (planetServiceOpenAPIHandleResult.matched) {
    return
  }

  const chatServiceRPCHandleResult = await chatServiceRPCHandler.handle(req, res, {
    prefix: '/rpc/chat',
    context: {
      roomPublisher,
      getAuth: once(() => getAuth(authToken)),
    },
  })

  if (chatServiceRPCHandleResult.matched) {
    return
  }

  const chatServiceOpenAPIHandleResult = await chatServiceOpenAPIHandler.handle(req, res, {
    prefix: '/api/chat',
    context: {
      roomPublisher,
      getAuth: once(() => getAuth(authToken)),
    },
  })

  if (chatServiceOpenAPIHandleResult.matched) {
    return
  }

  const specHandleResult = await handleSpecRequest(req, res)
  if (specHandleResult.matched) {
    return
  }

  res.writeHead(404)
  res.end('Not Found\n')
})

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000
const HOST = process.env.HOST || '127.0.0.1'

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${HOST}:${PORT}`)
})
