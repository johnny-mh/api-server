import { login } from '@/routes/v1/auth/handlers/login'
import { logout } from '@/routes/v1/auth/handlers/logout'
import { profile } from '@/routes/v1/auth/handlers/profile'
import { refresh } from '@/routes/v1/auth/handlers/refresh'
import { signup } from '@/routes/v1/auth/handlers/signup'
import { factory } from '@/factory'

export const app = factory.createApp()

app.post('/login', ...login)
app.post('/signup', ...signup)
app.get('/logout', ...logout)
app.get('/profile', ...profile)
app.post('/refresh', ...refresh)
