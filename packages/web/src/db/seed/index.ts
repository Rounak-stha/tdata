import { createSupabaseClient } from '@/lib/supabase/server/client'

const supabase = await createSupabaseClient()
supabase.auth.admin.createUser({
	email: 'user@email.com',
	password: 'password',
	user_metadata: { name: 'Yoda' }
})
