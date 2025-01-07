'use server'

import { createSupabaseClient } from '@lib/supabase/server/client'
import { redirect } from 'next/navigation'

type Provider = 'google'

const SITE_URL = process.env.SITE_URL

const getCallbackUrl = (provider: Provider) => `${SITE_URL}/api/auth/callback/${provider}`

const signInWith = (provider: Provider) => {
	return async () => {
		const supabase = await createSupabaseClient()

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
			options: {
				redirectTo: getCallbackUrl(provider)
			}
		})

		if (error) {
			console.log(error)
		}

		if (data?.url) {
			redirect(data.url)
		} else {
			console.log('No URL to redirect to')
		}
	}
}

export const signInWithMagicLink = async (email: string) => {
	const supabase = await createSupabaseClient()

	const { error } = await supabase.auth.signInWithOtp({ email })

	if (error) {
		console.log(error)
		return { success: false }
	}
	return { success: true }
}

export const logOut = async () => {
	const supabase = await createSupabaseClient()

	const { data, error: getSessionError } = await supabase.auth.getSession()
	console.log({ data })
	if (getSessionError || !data.session) {
		console.log(getSessionError, data)
		return { success: false }
	}

	const { error } = await supabase.auth.admin.signOut(data.session.access_token)

	if (error) {
		console.log(error)
		return { success: false }
	}
	redirect('/')
}

export const signInWithGoogle = signInWith('google')
