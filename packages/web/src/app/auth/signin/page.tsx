'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { GoogleIcon } from '@/components/icons/google'
import { signInWithGoogle, signInWithEmail } from '@/lib/actions/auth'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleMagicLinkLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const { success } = await signInWithEmail(email)
			if (success) {
				router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
			} else toast.error('Failed to send login link')
		} catch (error: unknown) {
			setError((error as Error).message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md'>
				<div className='flex justify-center mb-8'>{/* <TDataLogo className="w-20 h-20" /> */}</div>
				<h2 className='mt-6 text-center text-3xl font-extrabold text-foreground'>Sign in to TData</h2>
				<p className='mt-2 text-center text-sm text-muted-foreground'>
					Your ultimate project management solution
				</p>

				<div className='mt-8 bg-card rounded-lg p-8'>
					<form onSubmit={handleMagicLinkLogin} className='space-y-6'>
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
								className='border-0 bg-muted'
							/>
						</div>
						<Button type='submit' className='w-full' disabled={loading}>
							{loading ? 'Sending OTP...' : 'Sign in with Email'}
						</Button>
					</form>

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<Separator className='w-full' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-card text-muted-foreground'>Or continue with</span>
							</div>
						</div>

						<div className='mt-6'>
							<Button
								onClick={signInWithGoogle}
								variant='outline'
								className='w-full border-0 bg-muted'
								disabled={loading}
							>
								<GoogleIcon />
								Sign in with Google
							</Button>
						</div>
					</div>

					{error && <div className='mt-4 text-center text-sm text-destructive'>{error}</div>}
				</div>
			</div>
		</div>
	)
}
