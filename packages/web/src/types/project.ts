import { projects, projectTemplates } from "@/db/schema";
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

// UI
export type ProjectTabs = "overview" | "board";
