import { OnboardingFlow } from "@/components/pages/onboarding";
import { getInvitationByToken } from "@/lib/server/invitation";
import { getInfantUser } from "@/lib/supabase/server/client";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const awaitedSearchParams = await searchParams;
  const token = awaitedSearchParams.token;
  const invitation = token ? await getInvitationByToken(token) : null;
  const user = await getInfantUser();
  return <OnboardingFlow user={user} invitation={invitation} />;
}
