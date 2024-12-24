import type { AppEnvVariables } from 'auth'
import { Hono } from 'hono'
import { type JwtVariables } from 'hono/jwt'

import { list } from './handlers/list'
import { get } from './handlers/get'
import { create } from './handlers/create'
import { update } from './handlers/update'
import { del } from './handlers/del'

export const app = new Hono<{
  Bindings: AppEnvVariables
  Variables: JwtVariables
}>()

app.get('/todos', ...list)
app.get('/todos/:id', ...get)
app.post('/todos', ...create)
app.put('/todos/:id', ...update)
app.delete('/todos/:id', ...del)
