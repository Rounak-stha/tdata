'use server'

import OrganizationRepository from '@/repositories/organization'
import { OnboardingData } from '@/type/auth'
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

		const { error } = await supabase.auth.signInWithOtp({ email, options: { data: { name: email.split('@')[0] } } })

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

export const onboardUser = async (data: OnboardingData) => {
	/**
	 * NOTE: There's no proper error handling here
	 * We're using both Supabase CLient and ORM to interact with the database, so we can't wrap both in a transaction
	 * After the onboarded flag is set, the organization create may fail, leaving the user in a bad state and we can't even revert the operation
	 * TODO: Find a better way to handle this
	 */
	const supabase = await createSupabaseClient()
	const { data: userData } = await supabase.auth.getUser()
	if (!userData || !userData.user) return { success: false }
	const { data: updatedUserData } = await supabase.auth.updateUser({
		data: { ...userData.user.user_metadata, name: data.name, avatar_url: data.avatar, onboarded: true }
	})
	if (!updatedUserData || !updatedUserData.user) return { success: false }
	await OrganizationRepository.create({
		name: data.organizationName,
		key: data.organizationKey,
		createdBy: updatedUserData.user?.id
	})
	await supabase.auth.refreshSession()
	return { success: true }
}

export const checkOrganizationKeyAvailability = async (key: string) => {
	return !(await OrganizationRepository.existsByKey(key))
}

export const signInWithGoogle = signInWith('google')
