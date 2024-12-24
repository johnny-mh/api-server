import { db } from '@/db/index.js'
import { users } from '@/db/schema.js'
import { factory } from '@/factory.js'
import { jwtMiddleware } from '@/middlewares/jwt.js'
import { z } from '@hono/zod-openapi'
import * as argon2 from 'argon2'
import { eq, sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { env } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'
import { decode } from 'hono/jwt'

import { getToken } from '../utils.js'

const refreshDto = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
})

export const refresh = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: { 'application/json': { schema: resolver(refreshDto) } },
        description: 'Succeed',
      },
    },
  }),
  jwtMiddleware,
  validator('json', refreshDto),
  async (c) => {
    const { accessToken, refreshToken } = c.req.valid('json')

    const decoded = decode(accessToken)

    const [user] = await db
      .select()
      .from(users)
      .where(sql`${decoded.payload.sub} = id`)

    if (!user?.refreshToken) {
      throw new HTTPException(403)
    }

    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    )

    if (!refreshTokenMatches) {
      throw new HTTPException(403)
    }

    const token = await getToken({ env: env(c), user })

    await db
      .update(users)
      .set({ refreshToken: await argon2.hash(token.refreshToken) })
      .where(eq(users.id, user.id))

    return c.json(token)
  },
)
