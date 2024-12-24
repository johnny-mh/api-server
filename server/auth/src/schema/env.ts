import { z } from 'zod'

export const envSchema = z.object({
  DB_URL: z.string(),
  REFRESH_TOKEN_DURATION: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  TOKEN_DURATION: z.string(),
  TOKEN_SECRET: z.string(),
})

export type AppEnvVariables = z.infer<typeof envSchema>
