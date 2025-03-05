import { Node, Edge, Connection } from "@xyflow/react";
import { VERTICAL_SPACING, HORIZONTAL_OFFSET, SIBLING_DISTANCE } from "@/automation-ui/lib/constants";
import { NodeType } from "@/automation-ui/types";

export const getChildNodes = (nodes: Node[], edges: Edge[], sourceNodeId: string): Node[] => {
  return nodes.filter((node) => edges.some((edge) => edge.source === sourceNodeId && edge.target === node.id));
};

export const calculateNewNodePosition = (nodes: Node[], edges: Edge[], sourceNodeId: string) => {
  const sourceNode = nodes.find((node) => node.id === sourceNodeId);
  if (!sourceNode) return null;

  const baseX = sourceNode.position.x;
  // Add extra spacing to account for the add button and its connecting line
  const baseY = sourceNode.position.y + VERTICAL_SPACING + 30;

  // For regular nodes, standard positioning below
  return { x: baseX, y: baseY };
};

export const canDeleteNode = (node: Node): boolean => {
  return node.type !== ("TriggerNode" as NodeType);
};

/**
 * A placeholder node will always have a parent that may not already be on the Flow state (e.g. a new node)
 * This function calculates the position of the placeholder node based on the parent node
 * @param parentNode - The parent node of the placeholder node
 */
export const calculatePlaceholderNodePosition = (parentNode: Node, idx?: number) => {
  const baseX = parentNode.position.x + HORIZONTAL_OFFSET + (idx ? idx : 0) * SIBLING_DISTANCE;
  const baseY = parentNode.position.y + VERTICAL_SPACING;
  return { x: baseX, y: baseY };
};

export const generateNodeId = (type: NodeType, postfix?: string | number): string => {
  return `${type.replace("Node", "")}-${Date.now()}` + (postfix ? `-${postfix}` : "");
};

export const generateEdgeId = (postfix?: string | number): string => {
  return `edge-${Date.now()}` + (postfix ? `-${postfix}` : "");
};

/**
 * This method is used to get Placeholderr Nodes and Edges for a given node.
 */
export function getPlaceholderNodeAndedges(node: Node): { nodes: Node[]; edges: Edge[] } {
  let nodeAndEdgeCount = 0;
  const newNodeId = node.id;
  const nodeType = node.type;

  const nodes: Node[] = [
    {
      id: generateNodeId("PlaceholderNode", ++nodeAndEdgeCount),
      type: "PlaceholderNode" as NodeType,
      position: calculatePlaceholderNodePosition(node, 0),
      data: { label: "True Path", parentId: newNodeId },
    },
  ];

  const edges: Edge[] = [
    {
      id: generateEdgeId(++nodeAndEdgeCount),
      source: newNodeId,
      target: nodes[0].id,
      animated: true,
    },
  ];

  if (nodeType == "ConditionNode") {
    nodes.push({
      id: generateNodeId("PlaceholderNode", ++nodeAndEdgeCount),
      type: "PlaceholderNode" as NodeType,
      position: calculatePlaceholderNodePosition(node, 1),
      data: { label: "False Path", parentId: newNodeId },
    });
    edges.push({
      id: generateEdgeId(++nodeAndEdgeCount),
      source: newNodeId,
      target: nodes[1].id,
      animated: true,
    });
  }

  return { nodes, edges };
}

/**
 * This method is used to create a placeholder node
 */
export function createPlaceholderNode(parent: Node) {
  return {
    id: generateNodeId("PlaceholderNode"),
    type: "PlaceholderNode" as NodeType,
    position: calculatePlaceholderNodePosition(parent),
    data: { parentId: parent.id },
  };
}

/**
 * Mehod checks if a connection is valid
 * Currently, the only requirement is that there can't be more than one connection ending in same target handle
 */
export function isValidConnection(connection: Connection | Edge, edges: Edge[]): boolean {
  return !edges.some((edge) => edge.target === connection.target);
}
