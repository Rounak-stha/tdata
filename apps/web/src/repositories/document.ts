import { createDrizzleSupabaseClient } from "@db";

import { and, eq, ilike, sql } from "drizzle-orm";

import { documentCollaborators, documents, documentsTags, tags, users } from "@tdata/shared/db/schema";
import { Document, DocumentDetail, DocumentDetailMinimal, InsertDocumentData, InsertDocumentTagData, InsertTagData, Tag, UpdateDocumentData, User } from "@tdata/shared/types";
import { alias } from "drizzle-orm/pg-core";
import { UserSelects } from "./selects";

export class DocumentRepository {
  static async create(data: InsertDocumentData): Promise<Document> {
    const { tags, ...document } = data;

    const db = await createDrizzleSupabaseClient();
    return await db.rls(async (tx) => {
      const insertedDocumentArray = await tx.insert(documents).values(document).returning();
      if (insertedDocumentArray.length === 0) throw new Error("Document not inserted");
      const insertedDocument = insertedDocumentArray[0];
      if (tags.length > 0) {
        const documentsTagsInsertData: InsertDocumentTagData[] = tags.map((tag) => ({ tagId: tag.id, documentId: insertedDocument.id, organizationId: document.organizationId }));
        await tx.insert(documentsTags).values(documentsTagsInsertData);
      }
      return insertedDocument;
    });
  }

  static async updateDocument(data: UpdateDocumentData): Promise<Document> {
    const { id, organizationId, tags, ...document } = data;
    const db = await createDrizzleSupabaseClient();
    return await db.rls(async (tx) => {
      const uppdatedDocument = await tx
        .update(documents)
        .set(document)
        .where(and(eq(documents.id, id), eq(documents.organizationId, organizationId)))
        .returning();
      await tx.delete(documentsTags).where(and(eq(documentsTags.documentId, id), eq(documentsTags.organizationId, organizationId)));
      if (tags.length > 0) {
        const documentsTagsInsertData: InsertDocumentTagData[] = tags.map((tag) => ({ tagId: tag.id, documentId: id, organizationId }));
        await tx.insert(documentsTags).values(documentsTagsInsertData);
      }
      return uppdatedDocument[0];
    });
  }

  static async createTag(data: InsertTagData): Promise<Tag> {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      return await tx.insert(tags).values(data).returning();
    });
    return result[0];
  }

  static async searchTags(search: string, organizationId: number): Promise<Tag[]> {
    const db = await createDrizzleSupabaseClient();
    const result = await db.rls(async (tx) => {
      return await tx
        .select()
        .from(tags)
        .where(and(eq(tags.organizationId, organizationId), ilike(tags.name, `%${search}%`)))
        .limit(10)
        .execute();
    });
    return result;
  }

  static async getDocuments(organizationId: number): Promise<DocumentDetailMinimal[]> {
    const db = await createDrizzleSupabaseClient();
    const creatorUser = alias(users, "creator_user");
    const result = await db.rls(async (tx) => {
      return await tx
        .select({
          id: documents.id,
          title: documents.title,
          content: documents.content,
          excerpt: documents.excerpt,
          organizationId: documents.organizationId,
          createdById: documents.createdById,
          createdAt: documents.createdAt,
          updatedAt: documents.updatedAt,

          createdBy: {
            id: creatorUser.id,
            name: creatorUser.name,
            email: creatorUser.email,
            imageUrl: creatorUser.imageUrl,
          },

          tags: sql<Tag[]>`
		  COALESCE(
			JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
			  'id', ${tags.id},
			  'name', ${tags.name},
			  'organizationId', ${tags.organizationId}
			)) FILTER (WHERE ${tags.id} IS NOT NULL),
			'[]'
		  )
		`.as("tags"),
        })
        .from(documents)

        // Join creator (the author)
        .leftJoin(creatorUser, eq(creatorUser.id, documents.createdById))

        // Join tags
        .leftJoin(documentsTags, eq(documentsTags.documentId, documents.id))
        .leftJoin(tags, eq(tags.id, documentsTags.tagId))

        .where(eq(documents.organizationId, organizationId))

        .groupBy(documents.id, creatorUser.id);
    });
    return (result ?? []) as unknown as DocumentDetailMinimal[];
  }

  static async getDocumentDetail(id: string, organizationId: number): Promise<DocumentDetail | null> {
    const db = await createDrizzleSupabaseClient();
    const creatorUser = alias(users, "creator_user");
    const collaboratorUser = alias(users, "collaborator_user");
    const result = await db.rls(async (tx) => {
      return await tx
        .select({
          id: documents.id,
          title: documents.title,
          content: documents.content,
          excerpt: documents.excerpt,
          organizationId: documents.organizationId,
          createdById: documents.createdById,
          createdAt: documents.createdAt,
          updatedAt: documents.updatedAt,

          createdBy: {
            id: creatorUser.id,
            name: creatorUser.name,
            email: creatorUser.email,
            imageUrl: creatorUser.imageUrl,
          },

          tags: sql<Tag[]>`
		  COALESCE(
			JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
			  'id', ${tags.id},
			  'name', ${tags.name},
			  'organizationId', ${tags.organizationId}
			)) FILTER (WHERE ${tags.id} IS NOT NULL),
			'[]'
		  )
		`.as("tags"),

          collaborators: sql<User[]>`
		  COALESCE(
			JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
			  'id', ${collaboratorUser.id},
			  'name', ${collaboratorUser.name},
			  'email', ${collaboratorUser.email},
			  'imageUrl', ${collaboratorUser.imageUrl}
			)) FILTER (WHERE ${collaboratorUser.id} IS NOT NULL),
			'[]'
		  )
		`.as("collaborators"),
        })
        .from(documents)

        // Join creator (the author)
        .leftJoin(creatorUser, eq(creatorUser.id, documents.createdById))

        // Join tags
        .leftJoin(documentsTags, eq(documentsTags.documentId, documents.id))
        .leftJoin(tags, eq(tags.id, documentsTags.tagId))

        // Join collaborators (same users table, aliased)
        .leftJoin(documentCollaborators, eq(documentCollaborators.documentId, documents.id))
        .leftJoin(collaboratorUser, eq(collaboratorUser.id, documentCollaborators.userId))

        .where(and(eq(documents.organizationId, organizationId), eq(documents.id, id)))

        .groupBy(documents.id, creatorUser.id);
    });
    return (result[0] ?? null) as unknown as DocumentDetail;
  }
}
