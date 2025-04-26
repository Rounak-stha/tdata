import { documents, documentsTags, documentCollaborators, tags } from "@db/schema";
import { User } from "./user";

export type InsertTagData = typeof tags.$inferInsert;
export type Tag = typeof tags.$inferSelect;

export type InsertDocumentData = typeof documents.$inferInsert & { tags: Tag[] };
export type UpdateDocumentData = Pick<InsertDocumentData, "title" | "content" | "excerpt" | "organizationId"> & { id: string; tags: Tag[] };
export type Document = typeof documents.$inferSelect;

export type InsertDocumentCollaboratorData = typeof documentCollaborators.$inferInsert;
export type DocumentCollaborator = typeof documentCollaborators.$inferSelect;

export type InsertDocumentTagData = typeof documentsTags.$inferInsert;
export type DocumentTag = typeof documentsTags.$inferSelect;

export type DocumentDetail = Document & {
  collaborators: User[];
  tags: Tag[];
  createdBy: User;
};

export type DocumentDetailMinimal = Omit<Document, "content"> & {
  tags: Tag[];
  createdBy: User;
};
