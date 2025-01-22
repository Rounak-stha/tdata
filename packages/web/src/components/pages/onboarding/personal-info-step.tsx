import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip } from './tooltip'
import { Textarea } from '@/components/ui/textarea'
import { AvatarUpload } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { uploadAvatar } from '@/lib/actions/storage'
import { InfantUser } from '@/types/user'

interface PersonalInfoStepProps {
	user: InfantUser
	onNext: (data: { name: string; email: string; avatar?: string; jobTitle: string; bio: string }) => void
}

export function PersonalInfoStep({ user, onNext }: PersonalInfoStepProps) {
	const [name, setName] = useState(user.name)
	const [email, setEmail] = useState(user.email)
	const [avatar, setAvatar] = useState<string | null>(user.imageUrl)
	const [jobTitle, setJobTitle] = useState('')
	const [bio, setBio] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isUploading, setIsUploading] = useState(false)

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		if (!file.type.startsWith('image/')) {
			toast.error('Please upload an image file')
			return
		}

		// Simulate upload delay
		setIsUploading(true)
		const { success, data } = await uploadAvatar(file)
		if (!success) toast.error('Failed to upload avatar')
		else setAvatar(data.url)
		setIsUploading(false)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!name.trim() || !email.trim() || !jobTitle.trim()) {
			setError('Please fill in all required fields')
			return
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			setError('Please enter a valid email address')
			return
		}

		onNext({
			name,
			email,
			avatar: avatar || undefined,
			jobTitle,
			bio
		})
	}

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<h2 className='text-2xl font-semibold tracking-tight'>Personal Information</h2>
					<Tooltip content='Tell us about yourself to personalize your experience' />
				</div>
				<p className='text-muted-foreground'>Let&apos;s get to know you better</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Avatar Upload */}
				<div className='space-y-4'>
					<Label>Profile Picture</Label>
					<div className='flex items-center gap-6'>
						<AvatarUpload avatar={avatar || ''} isUploading={isUploading} />
						<div className='space-y-2'>
							<Button
								type='button'
								variant='default'
								onClick={() => document.getElementById('avatar-upload')?.click()}
								disabled={isUploading}
							>
								Upload picture
							</Button>
							<p className='text-xs text-muted-foreground'>
								Recommended: Square image, at least 400x400px
							</p>
							<input
								id='avatar-upload'
								type='file'
								accept='image/*'
								className='hidden'
								onChange={handleAvatarChange}
								disabled={isUploading}
							/>
						</div>
					</div>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='name'>Full Name *</Label>
					<Input
						id='name'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Name'
						required
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='email'>Email *</Label>
					<Input
						id='email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Email'
						required
						disabled
					/>
				</div>

				{/* Job Title Field */}
				<div className='space-y-2'>
					<Label htmlFor='jobTitle'>Job Title *</Label>
					<Input
						id='jobTitle'
						value={jobTitle}
						onChange={(e) => setJobTitle(e.target.value)}
						placeholder='e.g. Product Manager, Developer, Designer'
						required
					/>
				</div>

				{/* Bio Field */}
				<div className='space-y-2'>
					<Label htmlFor='bio'>Bio</Label>
					<Textarea
						id='bio'
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						placeholder='Tell us a bit about yourself'
						className='resize-none'
						rows={3}
					/>
					<p className='text-xs text-muted-foreground'>Brief description for your profile</p>
				</div>

				{error && <p className='text-destructive text-sm'>{error}</p>}
				<Button type='submit' className='w-full'>
					Continue
				</Button>
			</form>
		</div>
	)
}
