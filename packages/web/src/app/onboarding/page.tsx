import { OnboardingFlow } from '@/components/pages/onboarding'
import { getInfantUser } from '@/lib/supabase/server/client'

export default async function OnboardingPage() {
	const user = await getInfantUser()
	return <OnboardingFlow user={user} />
}
