import { DocumentListPage as _DocumentListPage } from "@/components/pages/document";
import { getOrganizationByKey } from "@/lib/server";
import { getDocuments } from "@/lib/server/document";

export default async function DocumentListPage({ params }: { params: Promise<{ orgKey: string }> }) {
  const { orgKey } = await params;
  const organization = await getOrganizationByKey(orgKey);
  const documents = await getDocuments(organization.id);

  return <_DocumentListPage documents={documents} organization={organization} />;
}
