import { db } from '@/db'
import { users } from '@/db/schema'
import { factory } from '@/factory'
import { compare, hash } from 'bcryptjs'
import { z } from '@hono/zod-openapi'
import { eq, sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { HTTPException } from 'hono/http-exception'
import { getToken } from '@/routes/v1/auth/utils'

const loginDto = z.object({
  email: z.string(),
  password: z.string(),
})

export const login = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: { 'application/json': { schema: resolver(loginDto) } },
        description: 'Succeed',
      },
    },
  }),
  validator('json', loginDto),
  async (c) => {
    const { email, password } = c.req.valid('json')

    const [user] = await db.select().from(users).where(sql`${email} = email`)

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const passwordMatches = await compare(password, user.password)

    if (!passwordMatches) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const token = await getToken({ env: c.var, user })

    await db
      .update(users)
      .set({
        refreshToken: await hash(token.refreshToken, 8),
      })
      .where(eq(users.id, user.id))

    return c.json(token)
  },
)
