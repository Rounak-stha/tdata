import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip } from './tooltip'
import { useDebounce } from '@/hooks'
import { checkOrganizationKeyAvailability } from '@/lib/actions/auth'
import { CheckCircleIcon, XCircleIcon } from 'lucide-react'

interface OrganizationStepProps {
	onNext: (
		data: { organizationName: string; teamSize: string; organizationKey: string },
		setLoading: (val: boolean) => void
	) => void
	onBack: () => void
}

export function OrganizationStep({ onNext, onBack }: OrganizationStepProps) {
	const [organizationName, setOrganizationName] = useState('')
	const [teamSize, setTeamSize] = useState('')
	const [organizationKey, setOrganizationKey] = useState('')
	const [isKeyAvailable, setIsKeyAvailable] = useState<boolean | null>(null)
	const [isCheckingUrl, setIsCheckingUrl] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const debouncedWorkspaceUrl = useDebounce(organizationKey, 500)

	useEffect(() => {
		const checkUrl = async () => {
			if (debouncedWorkspaceUrl) {
				setIsCheckingUrl(true)
				const available = await checkOrganizationKeyAvailability(debouncedWorkspaceUrl)
				setIsKeyAvailable(available)
				setIsCheckingUrl(false)
			} else {
				setIsKeyAvailable(null)
			}
		}

		checkUrl()
	}, [debouncedWorkspaceUrl])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setError(null)

		if (!organizationName.trim() || !teamSize || !organizationKey.trim()) {
			setError('Please fill in all fields')
			return
		}

		onNext({ organizationName, teamSize, organizationKey }, setLoading)
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
					<Label htmlFor='organizationKey'>Organization URL</Label>
					<div className='flex items-center space-x-2'>
						<span className='text-muted-foreground'>tdata.app/</span>
						<div className='relative flex-1'>
							<Input
								id='organizationKey'
								value={organizationKey}
								onChange={(e) => setOrganizationKey(e.target.value)}
								placeholder='Organization Key'
								required
							/>
							{isCheckingUrl && (
								<div className='absolute inset-y-0 right-0 flex items-center pr-3'>
									<div className='animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full'></div>
								</div>
							)}
							{!isCheckingUrl && isKeyAvailable !== null && (
								<div className='absolute inset-y-0 right-0 flex items-center pr-3'>
									{isKeyAvailable ? (
										<CheckCircleIcon className='h-5 w-5 text-primary' />
									) : (
										<XCircleIcon className='h-5 w-5 text-red-500' />
									)}
								</div>
							)}
						</div>
					</div>
					<p className='text-xs text-muted-foreground'>
						{isKeyAvailable === false
							? 'This workspace URL is already taken. Please choose another.'
							: 'You can only edit the slug of the URL'}
					</p>
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
					<Button type='submit' className='flex-1' disabled={loading}>
						Continue
					</Button>
				</div>
			</form>
		</div>
	)
}
