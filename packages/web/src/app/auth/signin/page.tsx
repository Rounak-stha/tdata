'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { GoogleIcon } from '@/components/icons/google'
import { signInWithGoogle, signInWithMagicLink } from '@/lib/actions/auth'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleMagicLinkLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const { success } = await signInWithMagicLink(email)
			if (success) toast.success('Check your email for the login link!')
			else toast.error('Failed to send login link')
		} catch (error: unknown) {
			setError((error as Error).message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='flex justify-center'>{/* <TDataLogo className='w-20 h-20' /> */}</div>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-foreground'>Sign in to TData</h2>
				<p className='mt-2 text-center text-sm text-muted-foreground'>
					Your ultimate project management solution
				</p>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<Card>
					<CardHeader>
						<CardTitle>Sign In</CardTitle>
						<CardDescription>Choose your preferred sign-in method</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<form onSubmit={handleMagicLinkLogin} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email address</Label>
								<Input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='Enter your email'
								/>
							</div>
							<Button type='submit' className='w-full' disabled={loading}>
								{loading ? 'Sending...' : 'Sign in with Magic Link'}
							</Button>
						</form>

						<div className='relative'>
							<Separator className='absolute inset-0' />
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
							</div>
						</div>

						<Button variant='outline' className='w-full' onClick={signInWithGoogle} disabled={loading}>
							<GoogleIcon />
							Sign in with Google
						</Button>

						{error && <div className='text-center text-sm text-destructive'>{error}</div>}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
