import { DocumentRepository } from "@/repositories";
import { CustomError } from "@lib/error";

export async function getDocument(docId: string, organizationId: number) {
  const result = await DocumentRepository.getDocumentDetail(docId, organizationId);
  if (!result) throw new CustomError("404- Document not found");
  return result;
}

export async function getDocuments(organizationId: number) {
  const result = await DocumentRepository.getDocuments(organizationId);
  return result;
}
