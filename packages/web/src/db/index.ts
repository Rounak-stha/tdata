import { createSupabaseClient } from '@/lib/supabase/server/client'
import { decodeJWT } from '@/lib/utils'
import { drizzle } from 'drizzle-orm/postgres-js'
import { createDrizzle } from './drizzle'

const DB_URL = process.env.SUPABASE_DB_URL

if (!DB_URL) {
	throw new Error('Missing SUPABASE_DB_URL')
}

export const db = drizzle({ connection: DB_URL, casing: 'snake_case' /*  logger: true */ })

// https://github.com/orgs/supabase/discussions/23224
// Should be secure because we use the access token that is signed, and not the data read directly from the storage
export async function createDrizzleSupabaseClient() {
	const supabase = await createSupabaseClient()
	const { data, error } = await supabase.auth.getSession()
	if (error || !data?.session) throw new Error('Failed to get session')
	return createDrizzle(decodeJWT(data.session.access_token ?? ''), { client: db })
}
