import 'dotenv/config'
import { app as auth } from 'auth'
import { app as todo } from '#/routes/v1/todo/index.js'
import { apiReference } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

const port = Number(process.env.SERVER_PORT ?? '3000')

const app = new Hono()

app.use(cors())
app.use(logger())
app.route('/api/v1', auth)
app.route('/api/v1', todo)

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
    },
  }),
)
app.get('/docs', apiReference({ spec: { url: '/openapi' }, theme: 'saturn' }))

// ========== start ==========
export default {
  port,
  fetch: app.fetch,
}
