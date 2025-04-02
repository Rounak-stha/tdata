import type { OnNodesChange, OnEdgesChange, OnConnect, OnConnectEnd, IsValidConnection, OnConnectStart, ReactFlow, OnSelectionChangeFunc } from "@xyflow/react";
import { ProjectDetail, FlowVariable, Task, AutomationFlow, FlowVariableCateory, NodeDataMap, FlowValueType, FlowNode, FlowEdge, NodeType } from "@tdata/shared/types";
import { IconType } from "@/types";

export type FlowVariableStore = Record<FlowVariableCateory, FlowVariable[]>;

type OnDragLeave = Parameters<typeof ReactFlow>[0]["onDragLeave"];

export type { FlowVariable };

export type AppState = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  invalidConnection: boolean;
  project: ProjectDetail;
  variables: FlowVariableStore;
  selectedElements: { nodes: FlowNode[]; edges: FlowEdge[] };
  getFlow: () => AutomationFlow;
  setVariables: (variables: FlowVariableStore) => void;
  setCustomVariable: (variable: FlowVariable) => void;
  deleteCustomVariable: (id: string) => void;
  updateCustomVariable: (id: string, variable: FlowVariable) => void;
  getSystemVariables: () => FlowVariable[];
  getCustomVariables: () => FlowVariable[];
  getVariables: () => FlowVariable[];
  removeCustomVariable: (id: string) => void;
  setProject: (project: ProjectDetail) => void;
  isValidConnection: IsValidConnection;
  setInvalidConnection: (invalid: boolean) => void;
  updateNodeData: (nodeId: string, data: NodeDataMap[keyof NodeDataMap]) => void;
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onSelectionChange: OnSelectionChangeFunc;
  onConnectStart: OnConnectStart;
  onConnectEnd: OnConnectEnd;
  onAddNode: (type: NodeType, sourceNodeId: string, handleId?: string) => void;
  onDragLeave: OnDragLeave;
  deleteSelectedElements: () => void;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  replaceNode: (nodeId: string, newNodeType: NodeType) => void;
  replaceNodeWith: (nodeId: string, newNodeId: string) => void;
};

/**
 * The standard fields that are common to all tasks
 * The statusId is replaced by status as the name will be used as label and `status` is user friendly than `statusId`
 * @see Task
 */
export type TaskStandardFields = Exclude<keyof Task, "id" | "projectId" | "organizationId" | "statusId" | "content"> & { status: number };

export type EdgeType = "WithAddButton";

export type FlowTaskStatus = {
  id: number | string;
  name: string;
  type: FlowValueType;
  icon: IconType;
};

export type FlowTaskPriority = {
  id: string;
  name: string;
  type: FlowValueType;
  icon: IconType;
};
