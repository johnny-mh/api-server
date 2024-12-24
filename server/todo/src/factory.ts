import { type AppEnvVariables, envSchema } from 'auth'
import { createFactory } from 'hono/factory'

export const envVariables = envSchema.parse(process.env)

export const factory = createFactory<{ Variables: AppEnvVariables }>({
  initApp: (app) => {
    app.use(async (c, next) => {
      for (const [key, value] of Object.entries(envVariables)) {
        c.set(key as keyof AppEnvVariables, value)
      }

      await next()
    })
  },
})
