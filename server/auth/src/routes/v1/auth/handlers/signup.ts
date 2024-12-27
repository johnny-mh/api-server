import { db } from '@/db'
import { users } from '@/db/schema'
import { factory } from '@/factory'
import { z } from '@hono/zod-openapi'
import { hash } from 'bcryptjs'
import { sql } from 'drizzle-orm'
import { describeRoute } from 'hono-openapi'
import { resolver, validator } from 'hono-openapi/zod'
import { HTTPException } from 'hono/http-exception'

const tokenSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
  refreshToken: z.string(),
  refreshTokenExpiresAt: z.string(),
})

const createUserDto = z.object({
  email: z.string().email().min(1, 'Email is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(1, 'Password is required'),
})

export const signup = factory.createHandlers(
  describeRoute({
    responses: {
      200: {
        content: { 'application/json': { schema: resolver(tokenSchema) } },
        description: 'Succeed',
      },
    },
  }),
  validator('json', createUserDto),
  async (c) => {
    const body = c.req.valid('json')

    const [result] = await db
      .select()
      .from(users)
      .where(sql`${body.email} = email`)

    if (result) {
      throw new HTTPException(409, { message: 'Conflict' })
    }

    await db.insert(users).values({
      ...body,
      password: await hash(body.password, 8),
      refreshToken: null,
      role: 'user',
    })

    return c.text('success')
  },
)
