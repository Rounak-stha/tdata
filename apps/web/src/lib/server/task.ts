import { TaskRepository } from "@/repositories";
import { CustomError } from "@lib/error";

export async function getTaskDetails(taskNumber: string, organizationId: number) {
  const task = await TaskRepository.getDetails(taskNumber, organizationId);
  if (!task) throw new CustomError("404 - Task Not Found");
  return task;
}
