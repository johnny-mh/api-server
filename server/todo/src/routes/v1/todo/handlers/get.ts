import { factory } from '#/factory'
import { resolver } from 'hono-openapi/zod'
import { jwtMiddleware } from 'auth'
import { describeRoute } from 'hono-openapi'
import { db } from '#/db'
import { todos, todosSelectSchema } from '#/db/schema'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export const get = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: {
          'application/json': { schema: resolver(todosSelectSchema) },
        },
        description: 'Succeed',
      },
    },
  }),
  jwtMiddleware,
  async (c) => {
    const { sub } = c.get('jwtPayload')
    const id = c.req.param('id')

    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, Number(sub))))

    if (!todo) {
      throw new HTTPException(404)
    }

    return c.json(todo)
  },
)
