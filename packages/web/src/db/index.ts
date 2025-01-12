import { drizzle } from 'drizzle-orm/postgres-js'

const DB_URL = process.env.SUPABASE_DB_URL

if (!DB_URL) {
	throw new Error('Missing SUPABASE_DB_URL')
}

export const db = drizzle({ connection: DB_URL, casing: 'snake_case' })
