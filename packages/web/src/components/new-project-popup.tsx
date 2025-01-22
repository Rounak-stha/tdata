'use client'

import { FC, useCallback, useState } from 'react'
// import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { createProject } from '@/lib/actions/project'
import { useOrganizations, useUser } from '@/hooks'

interface FormErrors {
	name?: string
	key?: string
	description?: string
}

type NewProjectPopupProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const NewProjectPopup: FC<NewProjectPopupProps> = ({ open, onOpenChange }) => {
	const [name, setName] = useState('')
	const [key, setKey] = useState('')
	const [description, setDescription] = useState('')
	const [errors, setErrors] = useState<FormErrors>({})
	const [loading, setLoading] = useState(false)

	const { organization, setOrganization } = useOrganizations()
	const { user } = useUser()

	// const router = useRouter()

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {}

		if (!name.trim()) {
			newErrors.name = 'Project name is required'
		} else if (name.length > 50) {
			newErrors.name = 'Project name cannot exceed 50 characters'
		}

		if (!key.trim()) {
			newErrors.key = 'Project key is required'
		} else if (key.length < 2 || key.length > 10) {
			newErrors.key = 'Project key must be between 2 and 10 characters'
		} else if (!/^[A-Z0-9]+$/.test(key)) {
			newErrors.key = 'Project key must contain only uppercase letters and numbers'
		}

		if (description.length > 500) {
			newErrors.description = 'Description cannot exceed 500 characters'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			if (validateForm()) {
				setLoading(true)
				// TODO: Implement project creation logic
				console.log({ name, key, description })
				const project = await createProject({
					name,
					key,
					description,
					organizationId: organization.id,
					createdBy: user.id,
					workflowId: organization.workflow.id
				})
				setOrganization({ ...organization, projects: [...organization.projects, project] })
				onOpenChange(false)
				resetForm()

				toast.success('Project created successfully')
				// Navigate to the new project
				// router.push(`/project/${key}`)
			}
		} catch (error) {
			console.error(error)
			toast.error('Could not create project. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const resetForm = () => {
		setName('')
		setKey('')
		setDescription('')
		setErrors({})
	}

	// Auto-generate project key from name
	const generateKeyName = useCallback(() => {
		if (!key) {
			const generatedKey = name
				.split(' ') // Split the name into words
				.map((word) => word.charAt(0).toUpperCase()) // Get the first letter of each word and convert to uppercase
				.join('') // Join the letters together to form the initials
			setKey(generatedKey)
		}
	}, [key, name])

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				onOpenChange(newOpen)
				if (!newOpen) resetForm()
			}}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Create New Project</DialogTitle>
					<DialogDescription>Add a new project to organize and track your tasks.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Project Name</Label>
						<Input
							id='name'
							value={name}
							onChange={(e) => setName(e.target.value)}
							onBlur={generateKeyName}
							placeholder='My Awesome Project'
						/>
						{errors.name && <p className='text-sm text-destructive'>{errors.name}</p>}
						<p className='text-sm text-muted-foreground'>This is the display name for your project.</p>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='key'>Project Key</Label>
						<Input
							id='key'
							value={key}
							onChange={(e) => setKey(e.target.value.toUpperCase())}
							placeholder='MAP'
						/>
						{errors.key && <p className='text-sm text-destructive'>{errors.key}</p>}
						<p className='text-sm text-muted-foreground'>
							A unique identifier used in task IDs (e.g., MAP-123).
						</p>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='description'>Description</Label>
						<Textarea
							id='description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder='Describe your project...'
							className='resize-none'
						/>
						{errors.description && <p className='text-sm text-destructive'>{errors.description}</p>}
						<p className='text-sm text-muted-foreground'>Optional project description.</p>
					</div>
					<DialogFooter>
						<Button disabled={loading} type='submit'>
							Create Project
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
