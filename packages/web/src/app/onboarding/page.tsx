import { OnboardingFlow } from '@/components/pages/onboarding'
import { getUser } from '@/lib/supabase/server/client'

export default async function OnboardingPage() {
	const user = await getUser()
	return <OnboardingFlow user={user} />
}
