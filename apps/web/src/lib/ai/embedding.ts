import { CohereEmbeddings } from "@langchain/cohere";

export async function generateEmbedding(query: string) {
  const cohereEmbeddings = new CohereEmbeddings({
    model: "embed-multilingual-light-v3.0",
    apiKey: process.env.COHERE_API_KEY, // Recommended to store securely
  });

  const embeddings = await cohereEmbeddings.embedDocuments([query]);
  return embeddings[0];
}
