import { logger, task } from "@trigger.dev/sdk/v3";
import { CohereEmbeddings } from "@langchain/cohere";
import { MarkdownTextSplitter } from "@langchain/textsplitters";

import { proseMirrorToMarkdown } from "../utils/document";
import { DocumentRepository } from "../repository";

type EnbedDocumentPayload = {
  docId: string;
};

export const EmbedDocumentTask = task({
  id: "embed-document",
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: EnbedDocumentPayload, { ctx }) => {
    logger.log("Embedding Document", { payload, ctx });

    try {
      const docId = payload.docId;
      const document = await DocumentRepository.getDocumentById(docId);

      if (!document) {
        throw new Error("Document not found");
      }

      const mdDocument = proseMirrorToMarkdown(document.content);

      const textSplitter = new MarkdownTextSplitter({
        chunkSize: 1000, // characters
        chunkOverlap: 50, // characters to overlap between chunks
      });

      const chunks = (await textSplitter.splitText(mdDocument)).map((chunk) => `# ${document.title}\n\n${chunk}`);

      const cohereEmbeddings = new CohereEmbeddings({
        model: "embed-multilingual-light-v3.0",
        apiKey: process.env.COHERE_API_KEY,
      });

      const embeddings = await cohereEmbeddings.embedDocuments(chunks);

      const embeddingAndContent = embeddings.map((embedding, index) => ({ embedding, content: chunks[index] }));
      await DocumentRepository.createDocumentEmbeddings(document, embeddingAndContent);

      return {
        status: "success",
      };
    } catch (e) {
      logger.error("Error embedding document", e as Record<string, unknown>);
      return {
        success: false,
        error: e,
      };
    }
  },
});
