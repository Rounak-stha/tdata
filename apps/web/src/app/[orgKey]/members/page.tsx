import { getOrganizationByKey } from "@/lib/server";
import { MembersPage as _MembersPage } from "@components/pages/members";

export default async function MembersPage({ params }: { params: Promise<{ orgKey: string }> }) {
  const { orgKey } = await params;
  const organization = await getOrganizationByKey(orgKey);

  return <_MembersPage organization={organization} />;
}
