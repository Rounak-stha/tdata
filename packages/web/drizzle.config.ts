import path from 'node:path'

import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'drizzle-kit'

const dirname = __dirname
loadEnvConfig(path.join(dirname, '.env.local'))

export default defineConfig({
	out: './drizzle',
	schema: './src/db/schema',
	dialect: 'postgresql',
	casing: 'snake_case',
	dbCredentials: {
		url: process.env.SUPABASE_DB_URL!
	}
})
