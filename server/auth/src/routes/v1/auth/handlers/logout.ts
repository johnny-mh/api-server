import { db } from '@/db/index.js'
import { users } from '@/db/schema.js'
import { factory } from '@/factory.js'
import { jwtMiddleware } from '@/middlewares/jwt.js'
import { sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'
import { z } from 'zod'

export const logout = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: { 'text/plain': { schema: resolver(z.string()) } },
        description: 'Succeed',
      },
    },
  }),
  jwtMiddleware,
  async (c) => {
    const { sub } = c.get('jwtPayload')

    await db.update(users).set({ refreshToken: null }).where(sql`${sub} = id`)

    return c.text('OK')
  },
)
