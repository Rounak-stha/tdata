import { TriggerNode } from "@/automation-ui/components/nodes/trigger-node";
import { ActionNode } from "@/automation-ui/components/nodes/action-node";
import { ConditionNode } from "@/automation-ui/components/nodes/condition-node";
import { PlaceholderNode } from "@/automation-ui/components/nodes/placeholder-node";
import AddButtonEdge from "@/automation-ui/components/edges/add-button-edge";

export const nodeTypes = {
  TriggerNode: TriggerNode,
  ActionNode: ActionNode,
  ConditionNode: ConditionNode,
  PlaceholderNode: PlaceholderNode,
};

export const edgeTypes = {
  WithAddButton: AddButtonEdge,
};
