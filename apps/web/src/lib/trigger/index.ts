import { tasks } from "@tdata/trigger/lib";
import type { EmbedDocumentTask } from "@tdata/trigger";

export const embedDocumentTrigger = async (documentId: string) => {
  await tasks.trigger<typeof EmbedDocumentTask>("embed-document", {
    docId: documentId,
  });
};
