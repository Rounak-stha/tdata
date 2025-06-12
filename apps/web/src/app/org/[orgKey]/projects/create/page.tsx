import _CreateProjectPage from "@/components/pages/create-project";
import { getOrganizationByKey, getProjectTemplates } from "@/lib/server";

export default async function CreateProjectPage({ params }: { params: Promise<{ orgKey: string }> }) {
  const { orgKey } = await params;
  const organization = await getOrganizationByKey(orgKey);
  const allProjectTemplates = await getProjectTemplates(organization.id);

  return <_CreateProjectPage templates={allProjectTemplates} />;
}
