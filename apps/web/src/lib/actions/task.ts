"use server";

import { InsertCommentData, InsertTaskData, Task, TaskUpdateData } from "@tdata/shared/types";
import { TaskRepository } from "@/repositories";

export const createTask = async (data: InsertTaskData) => {
  return await TaskRepository.create(data);
};

export const updateTask = async (task: Pick<Task, "id" | "organizationId">, data: TaskUpdateData) => {
  return await TaskRepository.updateField(task, data);
};

export const addComment = async (data: InsertCommentData) => {
  return await TaskRepository.addComment(data);
};
