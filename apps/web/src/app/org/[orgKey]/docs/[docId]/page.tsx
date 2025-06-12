import { getOrganizationByKey } from "@/lib/server";
import { getDocument } from "@/lib/server/document";
import { DocumentPage as _DocumentPage } from "@/components/pages/document";

export default async function DocumentPage({ params }: { params: Promise<{ docId: string; orgKey: string }> }) {
  const { docId, orgKey } = await params;
  const organization = await getOrganizationByKey(orgKey);
  const documentDetail = await getDocument(docId, organization.id);

  return <_DocumentPage document={documentDetail} />;
}
