import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Will be hashed
  name: text('name'),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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
});

// Indexes can be added later if needed

// Zod schemas for type safety
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertGameProgressSchema = createInsertSchema(gameProgress);
export const selectGameProgressSchema = createSelectSchema(gameProgress);

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type GameProgress = z.infer<typeof selectGameProgressSchema>;
export type NewGameProgress = z.infer<typeof insertGameProgressSchema>; 