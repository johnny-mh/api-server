import { factory } from '#/factory'
import { resolver, validator } from 'hono-openapi/zod'
import { jwtMiddleware } from 'auth'
import { describeRoute } from 'hono-openapi'
import { todos, todosInsertSchema, todosSelectSchema } from '#/db/schema'
import { db } from '#/db'
import { HTTPException } from 'hono/http-exception'

export const create = factory.createHandlers(
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
  validator('json', todosInsertSchema),
  async (c) => {
    const { sub } = c.get('jwtPayload')
    const body = c.req.valid('json')
    const { createdAt, updatedAt, userId, ...values } = body

    const [todo] = await db
      .insert(todos)
      .values({ ...values, userId: Number(sub) })
      .returning()

    if (!todo) {
      throw new HTTPException(400)
    }

    return c.json(todo)
  },
)
