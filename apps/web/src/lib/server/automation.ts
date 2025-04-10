import { AutomationRepository } from "@/repositories";
import { CustomError } from "@lib/error";

export async function getProjectAutomatins(projectId: number) {
  const automations = await AutomationRepository.getByProjectId(projectId);
  if (!automations) throw new CustomError("404 - Automations Not Found");
  return automations;
}
