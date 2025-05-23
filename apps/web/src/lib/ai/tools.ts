import { DocumentRepository, TaskRepository } from "@/repositories";
import { tool } from "ai";
import { z } from "zod";
import { generateEmbedding } from "./embedding";

export const tools = {
  getMyTasks: tool({
    description: "Get a list of tasks assigned to the user",
    parameters: z.object({
      userId: z.string().describe("The ID of the user to get tasks for"),
      organizationId: z.number().describe("The ID of the organization to get tasks for"),
    }),
    execute: async ({ userId, organizationId }) => {
      const tasks = await TaskRepository.getAssignedTasks(userId, organizationId);
      console.log({ tasks });
      return tasks;
    },
  }),

  getDocumentationInformation: tool({
    description:
      "Get information for your knowledge from the Organization documents to answer any relevant user questions that require organization specific knowledge. You can rephrase the user query (maybe add some more context to it) before passing to the tool if it seems vague or unclear so that the similarity search can find the relevant documents.",
    parameters: z.object({
      query: z.string().describe("The user query"),
      organizationId: z.number().describe("The ID of the organization"),
    }),
    execute: async ({ query, organizationId }) => {
      const embedding = await generateEmbedding(query);
      const docEmbs = await DocumentRepository.findDocumentsFromQueryEmbedding(embedding, organizationId);
      return docEmbs;
    },
  }),
};
