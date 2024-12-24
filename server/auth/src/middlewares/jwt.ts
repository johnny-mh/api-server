import { env } from 'hono/adapter'
import { createMiddleware } from 'hono/factory'
import { jwt } from 'hono/jwt'

export const jwtMiddleware = createMiddleware(async (c, next) => {
  const jwtMiddleware = jwt({ secret: env(c).TOKEN_SECRET })

  return jwtMiddleware(c, next)
})
