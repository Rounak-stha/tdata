import { createDrizzleSupabaseServiceRoleClient } from "@tdata/shared/db";
import { documentEmbeddings, documents } from "@tdata/shared/db/schema";
import { Document } from "@tdata/shared/types";
import { eq } from "drizzle-orm";

export class DocumentRepository {
  static async getDocumentById(docId: string): Promise<Document | null> {
    const db = await createDrizzleSupabaseServiceRoleClient();
    return await db.rls(async (tx) => {
      const doc = await tx.select().from(documents).where(eq(documents.id, docId)).execute();
      if (doc.length == 0) return null;
      return doc[0];
    });
  }

  static async createDocumentEmbeddings(document: Document, embeddingData: { content: string; embedding: number[] }[]) {
    const db = await createDrizzleSupabaseServiceRoleClient();
    const documentEmbeddingsCreateData = embeddingData.map(({ content, embedding }) => ({
      documentId: document.id,
      organizationId: document.organizationId,
      content: content,
      embedding: embedding,
    }));
    await db.rls(async (tx) => {
      await tx.insert(documentEmbeddings).values(documentEmbeddingsCreateData).execute();
    });
  }
}
