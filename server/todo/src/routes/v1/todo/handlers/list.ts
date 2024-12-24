import { factory } from '#/factory'
import { resolver } from 'hono-openapi/zod'
import { eq } from 'drizzle-orm'
import { jwtMiddleware } from 'auth'
import { describeRoute } from 'hono-openapi'
import { db } from '#/db'
import { todos, todosSelectSchema } from '#/db/schema'

export const list = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: {
          'application/json': { schema: resolver(todosSelectSchema.array()) },
        },
        description: 'Succeed',
      },
    },
  }),
  jwtMiddleware,
  async (c) => {
    const { sub } = c.get('jwtPayload')
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, Number(sub)))

    return c.json(result)
  },
)
