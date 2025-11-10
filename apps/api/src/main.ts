#!/usr/bin/env node

import { createServer } from 'node:http'
import process from 'node:process'

const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World!\n')
})

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000
const HOST = process.env.HOST || '127.0.0.1'

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running at http://${HOST}:${PORT}`)
})
