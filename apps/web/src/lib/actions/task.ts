"use server";

import { InsertCommentData, InsertTaskData, Task, TaskUpdateData } from "@tdata/shared/types";
import { TaskRepository } from "@/repositories";
import { createTaskEventMessage, publishMessage } from "../rabbitmq";

export const createTask = async (data: InsertTaskData) => {
  return await TaskRepository.create(data);
};

export const updateTask = async (task: Pick<Task, "id" | "organizationId">, data: TaskUpdateData) => {
  await TaskRepository.updateField(task, data);
  await publishMessage(createTaskEventMessage("TASK_UPDATED", task.id, data.performedBy));
};

export const addComment = async (data: InsertCommentData) => {
  return await TaskRepository.addComment(data);
};
