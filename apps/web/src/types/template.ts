import { IconType } from "./icon";

export type TemplateWorkflow = string[];
export type TemplateTaskTypes = string[];

export type taskProperties = TemplateProperty[]; // List of task attributes

export type ProjectTemplateTaskType = { name: string; icon: IconType };
export type ProjectTemplateWorkflow = { name: string; icon: IconType };
export type ProjectTemplatePriority = { name: string; icon: IconType };
export type ProjectTemplateAssignee = { single: boolean };
export type TaskPropertyTypes = "text" | "number" | "date" | "select" | "multiSelect" | "user";

export type TemplateProperty = {
  name: string;
  type: TaskPropertyTypes;
  options?: string[];
  singleUser?: boolean; // Required for type = 'User'
  /**
   * Type user will not be required
   * The requried properties will be mandatory while creating a new project
   */
  required: boolean;
};

export type ProjectTemplateData = {
  taskTypes: ProjectTemplateTaskType[];
  workflow: ProjectTemplateWorkflow[];
  priority: ProjectTemplatePriority[];
  assignee: ProjectTemplateAssignee;
  taskProperties: TemplateProperty[];
};

export type ProjectTemplateUI = {
  id: string;
  name: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  recommendedFor: string[];
} & ProjectTemplateData;
