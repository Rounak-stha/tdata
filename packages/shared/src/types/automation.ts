/**
 * xyflow/react is not a direct dependency of this @tdata/shared package.
 */
import type { Node, Edge } from "@xyflow/react";

import { automations } from "@db/schema";

import { ProjectTemplatePropertyTypes } from "./project";
import { Task } from "./task";

export type FlowVariableType = ProjectTemplatePropertyTypes | "boolean" | "status" | "priority";
export type InsertAutomationData = typeof automations.$inferInsert;
export type Automation = Omit<typeof automations.$inferSelect, "updatedAt">;
export type NodeType = "ActionNode" | "TriggerNode" | "ConditionNode" | "PlaceholderNode";

export type FlowNode = Node & { type: NodeType };
export type FlowEdge = Edge;
export type FlowVariableValue = string | string[];

export type TaskFields = Exclude<keyof Task, "id" | "properties"> | "assignee";

export type AutomationFlow = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};

export type FlowVariable = {
  id: string;
  name: string;
  type: FlowVariableType;
  description: string;
  value?: FlowVariableValue;
};

/**
 * This must be in sync with the Automation table triggerType field
 */
export type TriggerType = "TASK_CREATED" | "TASK_UPDATED";
export type FlowVariableCateory = "system" | "custom";
export type FlowVariableStore = Record<FlowVariableCateory, FlowVariable[]>;
export type ActionType = "Update_Task" | "Add_Comment";
export type FlowOperatorValue = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
export type FlowValueType = "static" | "variable";

export type FlowTaskUser = {
  id: number | string;
  name: string;
  imageUrl: string | null;
  type: FlowValueType;
};

export type FlowValue =
  | {
      type: Extract<FlowValueType, "static">;
      value: string;
    }
  | {
      type: Extract<FlowValueType, "variable">;
      value: FlowVariable;
    };

export type FlowOperator = {
  label: string;
  value: FlowOperatorValue;
};

export type ActionNodeData<T extends ActionType = ActionType> = {
  label: string;
  action: T;
  payload: ActionPayloadMap[T];
};

export type ActionNodeUpdateTaskPayload = Record<string, FlowValue | null>; // { <Task_Field>: FlowValue }
export type ActionNodeAddCommentPayload = {
  taskId: number;
  comment: string;
};
export type ActionPayloadMap = {
  Update_Task: ActionNodeUpdateTaskPayload;
  Add_Comment: ActionNodeAddCommentPayload;
};

export type ConditionNodeData = {
  label: string;
  condition: {
    field: FlowVariable | null;
    operator: FlowOperator | null;
    value: FlowValue | null;
  };
};

export type TriggerNodeData = {
  label: string;
  type: TriggerType;
  condition: {
    field: FlowVariable | null;
    operator: FlowOperator | null;
    value: FlowValue | null;
  };
};

export type PlaceholderNodeData = {
  label: string;
  parentId: string;
};

export type NodeDataMap = {
  ActionNode: ActionNodeData;
  ConditionNode: ConditionNodeData;
  TriggerNode: TriggerNodeData;
  PlaceholderNode: PlaceholderNodeData;
};
