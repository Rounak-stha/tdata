import { ActionNodeData, AutomationFlow, ConditionNodeData, NodeType, TriggerNodeData } from "@types";
import { Node } from "@xyflow/react";
import invariant from "tiny-invariant";

type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export function validateFlow(flow: AutomationFlow): ValidationResult {
  const { nodes, edges } = flow;
  let isFlowValid = true;

  const validationErrors: string[] = [];

  // Building adjacency list from edges
  const graph = new Map<string, string[]>();

  edges.forEach(({ source, target }) => {
    if (!graph.has(source)) graph.set(source, []);
    graph.get(source)!.push(target);
  });

  // Find all TriggerNodes
  const triggerNodes = nodes.filter((node) => node.type === ("TriggerNode" as NodeType));
  if (triggerNodes.length === 0) {
    validationErrors.push("No TriggerNode found");
    return { isValid: false, errors: validationErrors };
  } else if (triggerNodes.length > 1) {
    isFlowValid = false;
    validationErrors.push("Multiple TriggerNodes found, workflow is invalid.");
    return { isValid: false, errors: validationErrors };
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
    validationErrors.push("Unreachable nodes detected");
    return { isValid: false, errors: validationErrors };
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
        validationErrors.push(...errors);
        return;
      }
    }
    if (node.type === "ActionNode") {
      const { isValid, errors } = validateActionNode(node);
      if (!isValid) {
        isFlowValid = false;
        validationErrors.push(...errors);
        return;
      }
    }
    if (node.type === "ConditionNode") {
      const { isValid, errors } = validateConditionNode(node);
      if (!isValid) {
        isFlowValid = false;
        validationErrors.push(...errors);
        return;
      }
    }

    if (graph.has(nodeId)) {
      // Recursively visiting children of node ${nodeId}:`, graph.get(nodeId)
      graph.get(nodeId)!.forEach(dfs);
    }
  }

  dfs(startNode.id);

  return { isValid: isFlowValid, errors: validationErrors };
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
    result.errors.push(`TriggerNode ${node.id} has missing type/field/operator/value.`);
  }
  return result;
}

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
      result.errors.push(`ConditionNode ${node.id} has missing field/operator/value.`);
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
        result.errors.push(`Update_Task ActionNode ${node.id} has invalid value for field: ${key}`);
      }
    });
  }
  return result;
}
