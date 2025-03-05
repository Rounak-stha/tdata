import { LucideIcon } from "lucide-react";

import type { Edge, Node, OnNodesChange, OnEdgesChange, OnConnect, OnConnectEnd, IsValidConnection, OnConnectStart, ReactFlow } from "@xyflow/react";
import { ProjectDetail } from "@tdata/shared/types";

type OnDragLeave = Parameters<typeof ReactFlow>[0]["onDragLeave"];

export type FlowNode = Node;

export type AppState = {
  nodes: FlowNode[];
  edges: Edge[];
  invalidConnection: boolean;
  project: ProjectDetail;
  setProject: (project: ProjectDetail) => void;
  isValidConnection: IsValidConnection;
  setInvalidConnection: (invalid: boolean) => void;
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onConnectStart: OnConnectStart;
  onConnectEnd: OnConnectEnd;
  onAddNode: (type: string, sourceNodeId: string, handleId?: string) => void;
  onDragLeave: OnDragLeave;
  onDeleteNode: (nodeId: string) => void;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  replaceNode: (nodeId: string, newNodeType: string) => void;
  replaceNodeWith: (nodeId: string, newNodeId: string) => void;
};

export type EdgeType = "WithAddButton";
export type NodeType = "ActionNode" | "TriggerNode" | "ConditionNode" | "PlaceholderNode";

export interface ActionType {
  value: string;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
}

export interface ActionCategory {
  category: string;
  actions: ActionType[];
}

export interface ActionNodeData {
  label: string;
  actionType?: string;
  config?: any;
}

export interface AutomationVariable {
  name: string;
  type: "system" | "user" | "query";
  value: any;
}

export interface TaskQuery {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "in" | "not_in";
  value: any;
}

export interface QueryVariable extends AutomationVariable {
  type: "query";
  queryConfig: {
    conditions: TaskQuery[];
    limit?: number;
  };
}

export interface SystemVariable extends AutomationVariable {
  type: "system";
  systemType: "trigger_record" | "current_user";
}

export interface UserVariable extends AutomationVariable {
  type: "user";
  dataType: "string" | "number" | "boolean" | "array";
}

export type VariableReference = {
  variableName: string;
  path?: string[]; // For accessing nested properties
};
