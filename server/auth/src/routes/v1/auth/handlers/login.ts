import { db } from '@/db/index.js'
import { users } from '@/db/schema.js'
import { factory } from '@/factory.js'
import { z } from '@hono/zod-openapi'
import * as argon2 from 'argon2'
import { eq, sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { env } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'

import { getToken } from '../utils.js'

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

    const passwordMatches = await argon2.verify(user.password, password)

    if (!passwordMatches) {
      throw new HTTPException(401, { message: 'Unauthorized' })
    }

    const token = await getToken({ env: env(c), user })

    await db
      .update(users)
      .set({ refreshToken: await argon2.hash(token.refreshToken) })
      .where(eq(users.id, user.id))

    return c.json(token)
  },
)
