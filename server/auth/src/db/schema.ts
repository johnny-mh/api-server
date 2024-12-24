import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const roles = pgEnum('role', ['user', 'admin'])

export const users = pgTable(
  'users',
  {
    createdAt: timestamp({ withTimezone: false }).defaultNow(),
    email: varchar({ length: 255 }).notNull().unique(),
    firstName: varchar({ length: 255 }).notNull(),
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    lastName: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    refreshToken: varchar({ length: 255 }),
    role: roles(),
    updatedAt: timestamp({ withTimezone: false }).defaultNow(),
  },
  (tbl) => [uniqueIndex('email_idx').on(tbl.email)],
)
