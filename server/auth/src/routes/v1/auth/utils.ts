import { dayjs } from '@/util/dayjs.js'
import { sign } from 'hono/jwt'
import { nanoid } from 'nanoid'

export async function getToken({
  env,
  user,
}: {
  env: {
    REFRESH_TOKEN_DURATION: string
    REFRESH_TOKEN_SECRET: string
    TOKEN_DURATION: string
    TOKEN_SECRET: string
  }
  user: {
    email: string
    id: number
    role: null | string
  }
}) {
  const now = dayjs().utc()
  const exp = now.add(dayjs.duration(env.TOKEN_DURATION))
  const refreshExp = now.add(dayjs.duration(env.REFRESH_TOKEN_DURATION))

  const [accessToken, refreshToken] = await Promise.all([
    sign(
      {
        email: user.email,
        role: user.role,
        sub: user.id,
      },
      env.TOKEN_SECRET,
    ),
    sign(
      {
        id: nanoid(),
      },
      env.REFRESH_TOKEN_SECRET,
    ),
  ])

  return {
    accessToken,
    expiresAt: exp.format(),
    refreshToken,
    refreshTokenExpiresAt: refreshExp.format(),
  }
}
