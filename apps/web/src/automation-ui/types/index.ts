import type { Edge, Node, OnNodesChange, OnEdgesChange, OnConnect, OnConnectEnd, IsValidConnection, OnConnectStart, ReactFlow, OnSelectionChangeFunc } from "@xyflow/react";
import { ProjectDetail, FlowVariable, Task, AutomationFlow } from "@tdata/shared/types";
import { IconType } from "@/types";

type OnDragLeave = Parameters<typeof ReactFlow>[0]["onDragLeave"];

export type FlowNode = Node;
export type Flow = AutomationFlow;
export type { FlowVariable };

export type AppState = {
  nodes: FlowNode[];
  edges: Edge[];
  invalidConnection: boolean;
  project: ProjectDetail;
  variables: FlowVariableStore;
  selectedElements: { nodes: Node[]; edges: Edge[] };
  getFlow: () => Flow;
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
  setEdges: (edges: Edge[]) => void;
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
export type NodeType = "ActionNode" | "TriggerNode" | "ConditionNode" | "PlaceholderNode";
/**
 * This must be in sync with the Automation table triggerType field
 */
export type TriggerType = "TASK_CREATED" | "TASK_UPDATED";
export type FlowVariableCateory = "system" | "custom";
export type FlowVariableStore = Record<FlowVariableCateory, FlowVariable[]>;
export type ActionType = "Update_Task" | "Add_Comment";
export type FlowOperatorValue = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";
export type FlowValueType = "static" | "variable";

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

export type ActionPayloadMap = {
  Update_Task: Record<string, FlowValue | null>;
  Add_Comment: {
    taskId: number;
    comment: string;
  };
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
