import { factory } from '@/factory.js'
import { jwtMiddleware } from '@/middlewares/jwt.js'
import { z } from '@hono/zod-openapi'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'

const profileSchema = z.object({
  email: z.string(),
  role: z.enum(['admin', 'user']),
})

export const profile = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: {
          'application/json': {
            schema: resolver(profileSchema),
          },
        },
        description: 'Succeed',
      },
    },
    security: [{ bearerAuth: [] }],
  }),
  jwtMiddleware,
  (c) => c.json(c.get('jwtPayload')),
)
