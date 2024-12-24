import 'dotenv/config'
import { app as auth } from '@/routes/v1/auth/index.js'
import { serve } from '@hono/node-server'
import { apiReference } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const app = new Hono()

app.use(cors())
app.use(logger())
app.route('/api/v1', auth)

// ========== swagger ==========
app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      components: {
        securitySchemes: {
          bearerAuth: { bearerFormat: 'JWT', scheme: 'bearer', type: 'http' },
        },
      },
      info: { title: 'Auth Server API', version: '1.0.0' },
      servers: [{ url: 'http://localhost:3000' }],
    },
  }),
)
app.get('/docs', apiReference({ spec: { url: '/openapi' }, theme: 'saturn' }))

// ========== start ==========
const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
