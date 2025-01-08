'use client'

import { FC, useState } from 'react'
import { PersonalInfoStep } from './personal-info-step'
import { OrganizationStep } from './organization-step'
import { ProgressIndicator } from './progress-indicator'
import { User } from '@/types/user'

interface OnboardingData {
	name: string
	email: string
	organizationName: string
	teamSize: string
	organizationURL: string
}

type OnboardingFlowProps = { user: User }

export const OnboardingFlow: FC<OnboardingFlowProps> = ({ user }) => {
	const [step, setStep] = useState(1)
	const [data, setData] = useState<Partial<OnboardingData>>({})
	const totalSteps = 2

	const handlePersonalInfoNext = (personalInfo: { name: string; email: string }) => {
		setData({ ...data, ...personalInfo })
		setStep(2)
	}

	const handleOrganizationNext = (orgInfo: {
		organizationName: string
		teamSize: string
		organizationURL: string
	}) => {
		setData({ ...data, ...orgInfo })
		// Here you would typically send the data to your backend
		console.log('Onboarding completed:', { ...data, ...orgInfo })
		// Redirect to dashboard or next step
	}

	const handleBack = () => {
		setStep(step - 1)
	}

	return (
		<div className='min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<div className='w-full max-w-lg'>
				<ProgressIndicator currentStep={step} totalSteps={totalSteps} />

				<div className='bg-card rounded-lg p-8'>
					{step === 1 && <PersonalInfoStep user={user} onNext={handlePersonalInfoNext} />}
					{step === 2 && <OrganizationStep onNext={handleOrganizationNext} onBack={handleBack} />}
				</div>
			</div>
		</div>
	)
}
