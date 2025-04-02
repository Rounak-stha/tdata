import { Node, Edge, Connection, MarkerType } from "@xyflow/react";
import { VERTICAL_SPACING, SIBLING_DISTANCE, NODE_WIDTH } from "@/automation-ui/lib/constants";
import { nanoid } from "nanoid";
import { ActionNodeData, ConditionNodeData, FlowEdge, FlowNode, NodeType, PlaceholderNodeData, TriggerNodeData } from "@tdata/shared/types";

export const createNode = (type: NodeType, parent?: FlowNode, data?: Record<string, unknown>): FlowNode => {
  const position = parent ? calculateNewNodePosition(parent) : { x: 250, y: 100 };
  let nodeData = getInitialNodeData(type);
  nodeData = data ? { ...nodeData, ...data } : nodeData;
  return {
    id: generateNodeId(),
    type,
    position,
    data: nodeData,
  };
};

export const createEdge = (sourceNode: FlowNode, targetNode: FlowNode, sourceHandle?: string, targetHandle?: string): Edge => {
  const isSourceConditionNode = sourceNode.type === ("ConditionNode" as NodeType);

  let edgeStyle = { stroke: "#AAA", strokeWidth: 1.5 };

  if (isSourceConditionNode && sourceHandle) {
    if (sourceHandle == "true") {
      edgeStyle = { stroke: "#22C55E", strokeWidth: 1.5 };
    } else if (sourceHandle === "false") {
      edgeStyle = { stroke: "#EF4444", strokeWidth: 1.5 };
    }
  }

  const markerEnd = {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: edgeStyle.stroke,
  };

  return {
    id: generateEdgeId(),
    source: sourceNode.id,
    target: targetNode.id,
    sourceHandle: sourceHandle,
    targetHandle: targetHandle,
    style: edgeStyle,
    type: "BaseEdge",
    markerEnd,
    animated: true,
  };
};

function getInitialNodeData(nodeType: NodeType): ActionNodeData | ConditionNodeData | TriggerNodeData | PlaceholderNodeData {
  switch (nodeType) {
    case "ActionNode":
      return {
        label: "",
        action: "Update_Task",
        payload: {},
      };
    case "ConditionNode":
      return {
        label: "Condition",
        condition: {
          field: null,
          operator: null,
          value: null,
        },
      };
    case "TriggerNode":
      return {
        label: "Trigger",
        type: "TASK_UPDATED",
        condition: {
          field: null,
          operator: null,
          value: null,
        },
      };
    case "PlaceholderNode":
      return {
        label: "Placeholder",
        parentId: "",
      };
    default:
      throw new Error(`Unhandled node type: ${nodeType}`);
  }
}

export const getChildNodes = (nodes: Node[], edges: Edge[], sourceNodeId: string): Node[] => {
  return nodes.filter((node) => edges.some((edge) => edge.source === sourceNodeId && edge.target === node.id));
};

export const calculateNewNodePosition = (parent: FlowNode) => {
  const baseX = parent.position.x;
  const baseY = parent.position.y + VERTICAL_SPACING;

  // For regular nodes, standard positioning below
  return { x: baseX, y: baseY };
};

export const canDeleteNode = (node: Node): boolean => {
  return node.type !== ("TriggerNode" as NodeType);
};

/**
 * Method to get position of n sibling nodes for a parent node
 */
export const getSiblingNodesPosition = (parentNode: Node, siblingCount: number) => {
  const positions = [];
  const parentX = parentNode.position.x + NODE_WIDTH / 2;
  const parentY = parentNode.position.y;

  for (let i = 0; i < siblingCount; i++) {
    const siblingX = parentX + (i - (siblingCount - 1) / 2) * SIBLING_DISTANCE;
    const siblingY = parentY + VERTICAL_SPACING;
    positions.push({ x: siblingX, y: siblingY });
  }
  return positions;
};

export const generateNodeId = (): string => {
  return nanoid();
};

export const generateEdgeId = (postfix?: string | number): string => {
  return nanoid();
};

/**
 * This method is used to get Placeholderr Nodes and Edges for a given node.
 */
export function getPlaceholderNodeAndedges(parent: FlowNode): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes = [];
  const edges: Edge[] = [];

  if (parent.type == "ConditionNode") {
    const placeholderNodes = [createNode("PlaceholderNode", parent, { parentId: parent.id }), createNode("PlaceholderNode", parent, { parentId: parent.id })];
    const placeholderNodePositions = getSiblingNodesPosition(parent, placeholderNodes.length);
    placeholderNodes.forEach((node, index) => {
      node.position = placeholderNodePositions[index];
    });
    nodes.push(...placeholderNodes);
    edges.push(createEdge(parent, placeholderNodes[0], "true"), createEdge(parent, placeholderNodes[1], "false"));
  } else {
    nodes.push(createNode("PlaceholderNode", parent, { parentId: parent.id }));
    edges.push(createEdge(parent, nodes[0]));
  }

  return { nodes, edges };
}

/**
 * Mehod checks if a connection is valid
 * Currently, the only requirement is that there can't be more than one connection ending in same target handle
 */
export function isValidConnection(connection: Connection | Edge, edges: Edge[]): boolean {
  return !edges.some((edge) => edge.target === connection.target);
}
