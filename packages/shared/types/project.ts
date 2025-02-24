import { projects, projectTemplates } from "@db/schema";
import { WorkflowDetail } from "./workflow";
import { User } from "./user";

export type InsertProjectData = typeof projects.$inferInsert;
export type Project = Omit<typeof projects.$inferSelect, "deletedAt">;

export type InsertProjectTemplate = Exclude<typeof projectTemplates.$inferInsert, "id">;
export type ProjectTemplate = Omit<typeof projectTemplates.$inferSelect, "deletedAt">;
export type ProjectTemplateMinimal = Pick<ProjectTemplate, "id" | "name" | "description">;

export type ProjectDetail = Project & {
  template: ProjectTemplate;
};

export type ProjectDetailMinimal = Project & {
  createdBy: User;
  template: ProjectTemplateMinimal;
};

export type ProjectTemplateDetail = ProjectTemplate & {
  workflow: WorkflowDetail;
};

export type ProjectTemplatePropertyTypes = "text" | "number" | "date" | "select" | "multiSelect" | "user";

export type ProjectTemplateProperty = {
  name: string;
  type: ProjectTemplatePropertyTypes;
  options?: string[];
  singleUser?: boolean; // Required for type = 'User'
  /**
   * Type user will not be required
   * The requried properties will be mandatory while creating a new project
   */
  required: boolean;
};
