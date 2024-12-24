import { factory } from '#/factory'
import { resolver, validator } from 'hono-openapi/zod'
import { jwtMiddleware } from 'auth'
import { describeRoute } from 'hono-openapi'
import { todos, todosSelectSchema, todosUpdateSchema } from '#/db/schema'
import { db } from '#/db'
import { and, eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export const update = factory.createHandlers(
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
  validator('json', todosUpdateSchema),
  async (c) => {
    const { sub } = c.get('jwtPayload')
    const id = c.req.param('id')
    const body = c.req.valid('json')
    const { createdAt, updatedAt, userId, ...values } = body

    const [todo] = await db
      .update(todos)
      .set(values)
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, Number(sub))))
      .returning()

    if (!todo) {
      throw new HTTPException(404)
    }

    return c.json(todo)
  },
)
