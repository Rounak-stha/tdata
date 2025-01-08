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

export const signInWithEmail = async (email: string) => {
	try {
		const supabase = await createSupabaseClient()

		const { error } = await supabase.auth.signInWithOtp({ email })

		if (error) {
			console.log(error)
			return { success: false }
		}
		return { success: true }
	} catch (e) {
		console.log(e)
		return { success: false }
	}
}

export const verifyOtp = async (email: string, otp: string) => {
	try {
		const supabase = await createSupabaseClient()

		const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })

		if (error) throw error
		return { success: true }
	} catch (e) {
		console.log(e)
		return { success: false }
	}
}

export const signout = async () => {
	try {
		const supabase = await createSupabaseClient()

		const { data, error: getSessionError } = await supabase.auth.getSession()

		if (getSessionError || !data.session) {
			console.log(getSessionError, data)
			return { success: false }
		}

		const { error } = await supabase.auth.admin.signOut(data.session.access_token)

		if (error) throw error
		return { success: true }
	} catch (e) {
		console.log(e)
		return { success: false }
	}
}

export const signInWithGoogle = signInWith('google')
