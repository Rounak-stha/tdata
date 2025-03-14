/**
 * xyflow/react is not a direct dependency of this @tdata/shared package.
 */
import type { Node, Edge } from "@xyflow/react";

import { automations } from "@db/schema";

import { ProjectTemplatePropertyTypes } from "./project";

export type FlowVariableType = ProjectTemplatePropertyTypes | "boolean" | "status" | "priority";
export type InsertAutomationData = typeof automations.$inferInsert;
export type Automation = Omit<typeof automations.$inferSelect, "updatedAt">;

export type AutomationFlow = {
  nodes: Node[];
  edges: Edge[];
};

export type FlowVariable = {
  id: string;
  name: string;
  type: FlowVariableType;
  description: string;
  value?: string;
};
