import { users } from 'auth'
import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'

export { roles, users } from 'auth'

export const usersRelation = relations(users, ({ one }) => ({
  todos: one(todos),
}))

export const todos = pgTable('todos', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  userId: integer().references(() => users.id),
  createdAt: timestamp({ withTimezone: false }).defaultNow(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  done: boolean().notNull().default(false),
  updatedAt: timestamp({ withTimezone: false }).defaultNow(),
})

export const todosSelectSchema = createSelectSchema(todos)
export const todosInsertSchema = createInsertSchema(todos)
export const todosUpdateSchema = createUpdateSchema(todos)
