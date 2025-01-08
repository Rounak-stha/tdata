import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip } from './tooltip'

interface OrganizationStepProps {
	onNext: (data: { organizationName: string; teamSize: string; organizationURL: string }) => void
	onBack: () => void
}

export function OrganizationStep({ onNext, onBack }: OrganizationStepProps) {
	const [organizationName, setOrganizationName] = useState('')
	const [teamSize, setTeamSize] = useState('')
	const [organizationURL, setOrganizationURL] = useState('')
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!organizationName.trim() || !teamSize || !organizationURL.trim()) {
			setError('Please fill in all fields')
			return
		}

		onNext({ organizationName, teamSize, organizationURL })
	}

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<div className='flex items-center gap-2'>
					<h2 className='text-2xl font-semibold tracking-tight'>Create your organization</h2>
					<Tooltip content='Organization is your company' />
				</div>
				<p className='text-muted-foreground'>
					To start using TData, you need to create or join an Organization
				</p>
			</div>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='organizationName'>Organization name</Label>
					<Input
						id='organizationName'
						value={organizationName}
						onChange={(e) => setOrganizationName(e.target.value)}
						placeholder='Something familiar and recognizable is always best'
						required
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='organizationURL'>Organization URL</Label>
					<div className='flex items-center space-x-2'>
						<span className='text-muted-foreground'>tdata.app/</span>
						<Input
							id='organizationURL'
							value={organizationURL}
							onChange={(e) => setOrganizationURL(e.target.value)}
							placeholder='Organization-name'
							required
						/>
					</div>
					<p className='text-xs text-muted-foreground'>You can only edit the slug of the URL</p>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='teamSize'>How many people will use this Organization?</Label>
					<Select value={teamSize} onValueChange={setTeamSize}>
						<SelectTrigger id='teamSize'>
							<SelectValue placeholder='Select a range' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='1-10'>1-10 people</SelectItem>
							<SelectItem value='11-50'>11-50 people</SelectItem>
							<SelectItem value='51-200'>51-200 people</SelectItem>
							<SelectItem value='201+'>201+ people</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{error && <p className='text-destructive text-sm'>{error}</p>}
				<div className='flex justify-between gap-4'>
					<Button type='button' variant='ghost' onClick={onBack}>
						Back
					</Button>
					<Button type='submit' className='flex-1'>
						Continue
					</Button>
				</div>
			</form>
		</div>
	)
}
