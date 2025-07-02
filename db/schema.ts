import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Will be hashed
  name: text('name'),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Game progress table
export const gameProgress = pgTable('game_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  vaultProgress: text('vault_progress').notNull().default('0'),
  unlockedModules: text('unlocked_modules').notNull().default('[]'),
  lastPlayed: timestamp('last_played').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})