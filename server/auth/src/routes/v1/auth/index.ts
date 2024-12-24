import type { AppEnvVariables } from '@/schema/env.js'

import { Hono } from 'hono'
import { type JwtVariables } from 'hono/jwt'

import { login } from './handlers/login.js'
import { logout } from './handlers/logout.js'
import { profile } from './handlers/profile.js'
import { refresh } from './handlers/refresh.js'
import { signup } from './handlers/signup.js'

export const app = new Hono<{
  Bindings: AppEnvVariables
  Variables: JwtVariables
}>()

app.post('/login', ...login)
app.post('/signup', ...signup)
app.get('/logout', ...logout)
app.get('/profile', ...profile)
app.post('/refresh', ...refresh)
