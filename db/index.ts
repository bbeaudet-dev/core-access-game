import dotenv from 'dotenv'
dotenv.config()

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Debug: Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables')
  process.exit(1)
} else {
  console.log('✅ DATABASE_URL found:', process.env.DATABASE_URL.substring(0, 50) + '...')
}

// Create the database connection
const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })

export * from './schema'; // used by server

