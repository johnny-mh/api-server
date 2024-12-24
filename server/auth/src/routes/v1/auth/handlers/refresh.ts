import { db } from '@/db'
import { users } from '@/db/schema'
import { factory } from '@/factory'
import { jwtMiddleware } from '@/middlewares/jwt'
import { z } from '@hono/zod-openapi'
import { eq, sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { env } from 'hono/adapter'
import { HTTPException } from 'hono/http-exception'
import { decode } from 'hono/jwt'
import { getToken } from '@/routes/v1/auth/utils'
import { compare, hash } from 'bcryptjs'

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

    const refreshTokenMatches = await compare(user.refreshToken, refreshToken)

    if (!refreshTokenMatches) {
      throw new HTTPException(403)
    }

    const token = await getToken({ env: env(c), user })

    await db
      .update(users)
      .set({ refreshToken: await hash(token.refreshToken, 8) })
      .where(eq(users.id, user.id))

    return c.json(token)
  },
)
