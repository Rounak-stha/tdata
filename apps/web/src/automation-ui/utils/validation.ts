import { ActionNodeData, ConditionNodeData, Flow, NodeType, TriggerNodeData } from "@/automation-ui/types";
import { Node } from "@xyflow/react";
import { toast } from "sonner";
import invariant from "tiny-invariant";

export function validateFlow(flow: Flow): boolean {
  const { nodes, edges } = flow;
  let isFlowValid = true;

  // Building adjacency list from edges
  const graph = new Map<string, string[]>();

  edges.forEach(({ source, target }) => {
    if (!graph.has(source)) graph.set(source, []);
    graph.get(source)!.push(target);
  });

  // Find all TriggerNodes
  const triggerNodes = nodes.filter((node) => node.type === ("TriggerNode" as NodeType));
  if (triggerNodes.length === 0) {
    toast.error("No TriggerNode found");
    return false;
  } else if (triggerNodes.length > 1) {
    isFlowValid = false;
    toast.error("Multiple TriggerNodes found, workflow is invalid.");
    return false;
  }
  const startNode = triggerNodes[0];

  // Check for unreachable nodes
  const reachable = new Set<string>();
  function dfsCheck(nodeId: string) {
    if (reachable.has(nodeId)) return;
    reachable.add(nodeId);
    graph.get(nodeId)?.forEach(dfsCheck);
  }
  dfsCheck(startNode.id);

  const unreachableNodes = nodes.filter((node) => !reachable.has(node.id));
  if (unreachableNodes.length > 0) {
    toast.error("Unreachable nodes detected");
    return false;
  }

  // Process nodes using DFS
  // Starting DFS traversal
  const visited = new Set<string>();
  function dfs(nodeId: string) {
    if (visited.has(nodeId)) {
      console.log(`Node ${nodeId} already visited, skipping...`);
      return;
    }
    visited.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) {
      console.warn(`Node ${nodeId} not found in nodes list.`);
      return;
    }

    if (node.type === "TriggerNode") {
      const { isValid, errors } = validateTriggerNode(node);
      if (!isValid) {
        isFlowValid = false;
        errors.forEach((error) => toast.error(error));
        return;
      }
    }
    if (node.type === "ActionNode") {
      const { isValid, errors } = validateActionNode(node);
      if (!isValid) {
        isFlowValid = false;
        errors.forEach((error) => toast.error(error));
        return;
      }
    }
    if (node.type === "ConditionNode") {
      const { isValid, errors } = validateConditionNode(node);
      if (!isValid) {
        isFlowValid = false;
        errors.forEach((error) => toast.error(error));
        return;
      }
    }

    if (graph.has(nodeId)) {
      // Recursively visiting children of node ${nodeId}:`, graph.get(nodeId)
      graph.get(nodeId)!.forEach(dfs);
    }
  }

  dfs(startNode.id);

  return isFlowValid;
}

function validateTriggerNode(node: Node): ValidationResult {
  invariant(node.type === "TriggerNode", "Node is not a TriggerNode");
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };
  const { type, condition } = node.data as TriggerNodeData;
  const { field, operator, value } = condition;

  if (!type || !field || !operator || !value) {
    result.isValid = false;
    result.errors.push(`TriggerNode ${node.type} has missing type/field/operator/value.`);
  }
  return result;
}

type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

function validateConditionNode(node: Node): ValidationResult {
  invariant(node.type === "ConditionNode", "Node is not a ConditionNode");
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };
  if (node.type === "ConditionNode") {
    const { field, operator, value } = (node.data as ConditionNodeData).condition;
    if (!field || !operator || !value) {
      result.isValid = false;
      result.errors.push(`ConditionNode ${node.type} has missing field/operator/value.`);
    }
  }
  return result;
}

function validateActionNode(node: Node): ValidationResult {
  invariant(node.type === "ActionNode", "Node is not an ActionNode");
  const result: ValidationResult = {
    isValid: true,
    errors: [],
  };
  const nodeData = node.data as ActionNodeData;
  if (node.type === "ActionNode" && nodeData.action === "Update_Task") {
    const payload = nodeData.payload;
    Object.entries(payload).forEach(([key, update]) => {
      if (!update || !update.value) {
        result.isValid = false;
        result.errors.push(`Update_Task ActionNode ${node.type} has invalid value for field: ${key}`);
      }
    });
  }
  return result;
}
