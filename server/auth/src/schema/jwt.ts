import { z } from 'zod'

export const jwtPayloadSchema = z.object({
  exp: z.number().refine((val) => val > Date.now() / 1000, {
    message: 'expired',
  }),
  iat: z.number(),
  role: z.string(),
  sub: z.string(),
})

export type JwtPayload = z.infer<typeof jwtPayloadSchema>
