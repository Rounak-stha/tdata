"use server";

import { InsertProjectData, ProjectTemplateDetail } from "@tdata/shared/types";
import { ProjectRepository } from "@/repositories";

export const checkProjectKeyAvailability = async (key: string) => {
  return !(await ProjectRepository.existsByKey(key));
};

export const createProject = async (data: InsertProjectData, template: ProjectTemplateDetail) => {
  try {
    return ProjectRepository.createProjectAndTemplate(data, template);
  } catch (e) {
    console.log(e);
    throw "Failed to create project";
  }
};
