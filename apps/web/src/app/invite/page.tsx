import { redirect } from "next/navigation";
import { InvitePage as _InvitePage } from "@components/pages/invitation";
import { Paths } from "@/lib/constants";
import { getInvitationByToken } from "@/lib/server/invitation";
import { getAuthedUser } from "@/lib/supabase/server/client";

export default async function InvitePage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const awaitedSearchParams = await searchParams;
  if (!awaitedSearchParams.token) redirect(Paths.root());

  const user = await getAuthedUser();
  const invitation = await getInvitationByToken(awaitedSearchParams.token);

  if (!invitation) return <div>Invalid Invitation</div>;
  if (user && user.email !== invitation.email) return <div>Hmm... Looks like the invitation is not meant for you.</div>;

  return <_InvitePage invitation={invitation} user={user} />;
}
