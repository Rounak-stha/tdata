import { ProjectRepository } from "@/repositories";
import { CustomError } from "@lib/error";
import { ProjectBoardQueryLimit } from "@lib/constants";

export async function getProjectByKey(projectKey: string, organizationKey: string) {
  const project = await ProjectRepository.getByKey(projectKey, organizationKey);
  if (!project) throw new CustomError("404 - Project Not Found");
  return project;
}

export async function getProjectBoardData(projectId: number) {
  const project = await ProjectRepository.getTasksGroupedByStatus(projectId, ProjectBoardQueryLimit);
  if (!project) throw new CustomError("404 - Project Not Found");
  return project;
}

export async function getProjects(organizationId: number) {
  const project = await ProjectRepository.getProjects(organizationId);
  return project;
}

export async function getProjectTemplate(projectId: number) {
  const project = await ProjectRepository.getProjectTemplate(projectId);
  return project;
}
