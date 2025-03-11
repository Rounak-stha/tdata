"use server";

import { InsertProjectData, Project } from "@tdata/shared/types";
import { ProjectRepository } from "@/repositories";
import { db } from "@/db";
import WorkflowRepository from "@/repositories/workflow";
import { InsertWorkflowData } from "@tdata/shared/types";
import { ProjectTemplateData } from "@types";

export const checkProjectKeyAvailability = async (key: string) => {
  return !(await ProjectRepository.existsByKey(key));
};

export const createProject = async (data: InsertProjectData, template: ProjectTemplateData) => {
  try {
    const workflowData: InsertWorkflowData = {
      name: `${data.name} workflow`,
      organizationId: data.organizationId,
      createdBy: data.createdBy,
    };
    const projectTemplateData = { name: `${data.name} workflow`, organizationId: data.organizationId };

    let project;
    await db.transaction(async (tx) => {
      project = await ProjectRepository.create(data, tx);
      const workflow = await WorkflowRepository.create({ workflow: workflowData, status: template.workflow }, tx);
      await ProjectRepository.createProjectTemplate(
        {
          ...projectTemplateData,
          id: project.id,
          workflowId: workflow.id,
          singleAssignee: template.assignee.single,
          taskProperties: template.taskProperties,
        },
        tx
      );
    });
    return project as unknown as Project;
  } catch (e) {
    console.log(e);
    throw "Failed to create project";
  }
};
