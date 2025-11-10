import type { IncomingMessage, ServerResponse } from 'node:http'
import { OpenAPIGenerator } from '@orpc/openapi'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { router as authRouter } from '@repo/auth-service'
import { router as chatRouter } from '@repo/chat-service'
import { router as planetRouter } from '@repo/planet-service'

const generator = new OpenAPIGenerator({
  schemaConverters: [
    new ZodToJsonSchemaConverter(),
  ],
})

/**
 * Handle Scalar API reference requests
 */
export async function handleSpecRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<{ matched: boolean }> {
  const url = req.url || '/'

  // Serve OpenAPI spec JSON
  if (url === '/openapi.json' && req.method === 'GET') {
    const spec = await generateOpenAPISpec()
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
    res.end(JSON.stringify(spec, null, 2))
    return { matched: true }
  }

  // Serve Scalar API reference UI
  if (url === '/' && req.method === 'GET') {
    const html = getScalarHTML()
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache',
    })
    res.end(html)
    return { matched: true }
  }

  return { matched: false }
}

/**
 * Generate Scalar API reference HTML
 */
function getScalarHTML(): string {
  return `
<!doctype html>
<html>
  <head>
    <title>Multi-Service API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="https://orpc.unnoq.com/icon.svg" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>

    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
      Scalar.createApiReference('#app', {
        url: '/openapi.json',
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: '',
            },
          },
          preferredSecurityScheme: 'bearerAuth',
        },
        theme: 'default',
        layout: 'modern',
        defaultOpenAllTags: false,
        servers: [
          {
            url: '/api',
            description: 'API Gateway',
          },
        ],
        hideDownloadButton: false,
        hideTestRequestButton: false,
      })
    </script>
  </body>
</html>
  `.trim()
}

/**
 * Generate and merge OpenAPI specifications for all services
 */
export async function generateOpenAPISpec(): ReturnType<typeof generator.generate> {
  // Generate specs for each service
  const [authSpec, planetSpec, chatSpec] = await Promise.all([
    generator.generate(authRouter),
    generator.generate(planetRouter),
    generator.generate(chatRouter),
  ])

  // Merge all specs into one
  const mergedSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Multi-Service API',
      version: '1.0.0',
      description: 'Unified API for Auth, Planet, and Chat services',
    },
    servers: [
      {
        url: '/api',
        description: 'API Gateway',
      },
    ],
    paths: {
      ...prefixPaths(authSpec.paths || {}, '/auth'),
      ...prefixPaths(planetSpec.paths || {}, '/planet'),
      ...prefixPaths(chatSpec.paths || {}, '/chat'),
    },
    components: {
      schemas: {
        ...authSpec.components?.schemas,
        ...planetSpec.components?.schemas,
        ...chatSpec.components?.schemas,
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      ...(authSpec.tags || []),
      ...(planetSpec.tags || []),
      ...(chatSpec.tags || []),
    ],
  }

  return mergedSpec as any
}

/**
 * Helper function to prefix paths with a service prefix
 */
function prefixPaths(
  paths: Record<string, any>,
  prefix: string,
): Record<string, any> {
  const prefixedPaths: Record<string, any> = {}

  for (const [path, value] of Object.entries(paths)) {
    prefixedPaths[`${prefix}${path}`] = value
  }

  return prefixedPaths
}
