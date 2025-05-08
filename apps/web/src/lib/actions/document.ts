"use server";

import { InsertDocumentData, InsertTagData, UpdateDocumentData } from "@tdata/shared/types";
import { DocumentRepository } from "@/repositories/document";
import { embedDocumentTrigger } from "@lib/trigger";

export const createTag = async (data: InsertTagData) => {
  return await DocumentRepository.createTag(data);
};

export const searchTags = async (search: string, organizationId: number) => {
  return await DocumentRepository.searchTags(search, organizationId);
};

export const createDocument = async (data: InsertDocumentData) => {
  const createdDocument = await DocumentRepository.create(data);
  await embedDocumentTrigger(createdDocument.id);
  return createdDocument;
};

export const updateDocument = async (data: UpdateDocumentData) => {
  return await DocumentRepository.updateDocument(data);
};
