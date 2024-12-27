import { factory } from '#/factory'
import { jwtMiddleware } from 'auth'
import { describeRoute } from 'hono-openapi'
import { z } from '@hono/zod-openapi'
import { todos } from '#/db/schema'
import { db } from '#/db'
import { and, eq, sql } from 'drizzle-orm'
import { resolver } from 'hono-openapi/zod'
import { HTTPException } from 'hono/http-exception'

export const del = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: {
          'text/plain': { schema: resolver(z.string()) },
        },
        description: 'Succeed',
      },
    },
  }),
  jwtMiddleware,
  async (c) => {
    const { sub } = c.get('jwtPayload')
    const id = c.req.param('id')

    const { rowCount } = await db
      .delete(todos)
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, Number(sub))))

    if (typeof rowCount === 'number' && rowCount > 0) {
      return c.text('OK')
    }

    throw new HTTPException(400)
  },
)
