import { TaskRepository } from "@/repositories";
import { tool } from "ai";
import { z } from "zod";

export const tools = {
  getMyTasks: tool({
    description: "Get a list of tasks assigned to the user",
    parameters: z.object({
      userId: z.string().describe("The ID of the user to get tasks for"),
      organizationId: z.number().describe("The ID of the organization to get tasks for"),
    }),
    execute: async ({ userId, organizationId }) => {
      console.log("Eecuting getMyTasks tool with userId:", userId, "and organizationId:", organizationId);
      const tasks = await TaskRepository.getAssignedTasks(userId, organizationId);
      console.log({ tasks });
      return tasks;
    },
  }),
};
