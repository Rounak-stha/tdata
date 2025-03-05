import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";

import {
  calculateNewNodePosition,
  canDeleteNode,
  calculatePlaceholderNodePosition,
  generateNodeId,
  generateEdgeId,
  getPlaceholderNodeAndedges,
  createPlaceholderNode,
  isValidConnection,
} from "@/automation-ui/utils";
import type { AppState, NodeType } from "@/automation-ui/types";
import { ProjectDetail } from "@tdata/shared/types";

const InitialTriggerNode = {
  id: generateNodeId("TriggerNode"),
  type: "TriggerNode",
  position: { x: 250, y: 100 },
  data: { label: "Trigger" },
};

const InitialPlaceholderNode = {
  id: generateNodeId("PlaceholderNode"),
  type: "PlaceholderNode",
  position: calculatePlaceholderNodePosition(InitialTriggerNode),
  data: { label: "Placeholder Node", parentId: InitialTriggerNode.id },
};

export const InitialNodes = [InitialTriggerNode, InitialPlaceholderNode];

export const InitialEdges = [
  {
    id: generateEdgeId(),
    source: InitialTriggerNode.id,
    target: InitialPlaceholderNode.id,
    animated: true,
  },
];

export const useFlowStore = create<AppState>((set, get) => ({
  nodes: InitialNodes,
  edges: InitialEdges,
  invalidConnection: false,
  project: {} as ProjectDetail,
  setProject: (project) => {
    set({ project });
  },
  setInvalidConnection: (invalid) => {
    set({ invalidConnection: invalid });
  },
  isValidConnection: (connection) => {
    console.log("In isValidConnection");
    const isValid = isValidConnection(connection, get().edges);
    console.log("isValid", isValid);
    if (!isValid) {
      get().setInvalidConnection(true);
    }
    return isValid;
  },
  onDragLeave: (e) => {
    console.log("onDragLeave");
    get().setInvalidConnection(false);
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onAddNode: (type, sourceNodeId, handleId) => {
    const nodes = get().nodes;
    const edges = get().edges;

    const sourceNode = nodes.find((node) => node.id === sourceNodeId);
    if (!sourceNode) return;

    // create new node and edge
    const position = calculateNewNodePosition(nodes, edges, sourceNodeId);
    if (!position) return null;
    const newNodeId = `${type}-${Date.now()}`;

    const newNode: Node = {
      id: newNodeId,
      type,
      position,
      data: { label: type === "ActionNode" ? "Action" : "Condition" },
    };

    const newEdge = {
      id: `edge-${Date.now()}`,
      source: sourceNodeId,
      target: newNodeId,
      sourceHandle: handleId,
      animated: true,
    };

    const placeholderNodesAndEdges = getPlaceholderNodeAndedges(newNode);

    get().setNodes([...nodes, newNode, ...placeholderNodesAndEdges.nodes]);
    get().setEdges([...edges, newEdge, ...placeholderNodesAndEdges.edges]);
  },
  onDeleteNode: (nodeId) => {
    const nodes = get().nodes;
    const edges = get().edges;
    const node = nodes.find((node) => node.id === nodeId);

    if (!node || !canDeleteNode(node)) {
      return;
    }
    const targetNodeIds: string[] = [];
    const newPlaceholderNodes: Node[] = [];

    // Delete edges that emerge out from the current node to be deleted
    // for edges that attaches to the current node, we want to replace the  target with a placeholder node
    // This approach is taken to ensure that the leaf nodes will alwats have a placeholder node to create new nodes
    // And also we took the approach to create new placeholder nodes for each edge that joins to the current node beacuse
    // in the future we might add the feature for a node to connect to multiple node or vice versa

    const filteredEdges = edges.filter((edge) => {
      // If the edge is not attached to the current node
      // or if the edge is attached to the current node but the source is not the current node,
      // we want to keep it
      // In summary, we remove all nodes that originates FROM the current node
      const shouldFilter = edge.source !== nodeId;
      if (!shouldFilter) {
        targetNodeIds.push(edge.target);
      }

      // For edges that ends in the current node, we want to replace the target with a placeholder node
      if (edge.target === nodeId) {
        const parentNode = nodes.find((n) => n.id === edge.source);
        if (parentNode) {
          const placeholderNode = createPlaceholderNode(parentNode);
          newPlaceholderNodes.push(placeholderNode);
          edge.target = placeholderNode.id;
        }
      }
      return shouldFilter;
    });

    const filteredNodes = nodes.filter((node) => node.id !== nodeId && (!targetNodeIds.includes(node.id) || node.type !== ("PlaceholderNode" as NodeType)));
    filteredNodes.push(...newPlaceholderNodes);

    get().setNodes(filteredNodes);
    get().setEdges(filteredEdges);
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set({ edges });
  },
  onConnect: (connection) => {
    const nodes = get().nodes;
    const sourceNode = nodes.find((node) => node.id === connection.source);
    const targetNode = nodes.find((node) => node.id === connection.target);

    if (!sourceNode || !targetNode) return;

    if (sourceNode.type === "PlaceholderNode") {
      get().replaceNodeWith(sourceNode.id, targetNode.id);
    } else {
      set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
    }
  },
  onConnectStart: (_) => {},
  /**
   * Method called when a connection ends regardless of the outcome of the connection
   */
  onConnectEnd: (_) => {
    get().setInvalidConnection(false);
  },
  /**
   * Used to replace nodes
   * Currently, only placeholder node can be replaced
   */
  replaceNode: (nodeId, newNodeType) => {
    const nodes = get().nodes;
    const edges = get().edges;

    const node = nodes.find((node) => node.id === nodeId);
    if (!node) return;

    if (node?.type !== ("PlaceholderNode" as NodeType)) {
      console.warn("No a placeholder node");
      console.warn(`Cannot replace node with ${newNodeType} due to existing node type restrictions`);
    }

    const sourceNodeId = node.data.parentId as string;
    const position = node.position;

    const edge = edges.find((edge) => edge.source === sourceNodeId && edge.target === nodeId);

    if (!edge) return;

    const newNodeId = `${newNodeType}-${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: newNodeType,
      position,
      data: { label: newNodeType === "ActionNode" ? "Action" : "Condition" },
    };
    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: sourceNodeId,
      target: newNodeId,
      sourceHandle: edge.sourceHandle,
      animated: true,
    };

    // remove the placeholder node and edge and the new node and edge
    const newNodes = nodes.filter((node) => node.id !== nodeId);
    const newEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);

    const { nodes: pNodes, edges: pEdges } = getPlaceholderNodeAndedges(newNode);

    newNodes.push(newNode, ...pNodes);
    newEdges.push(newEdge, ...pEdges);

    get().setNodes(newNodes);
    get().setEdges(newEdges);
  },
  /**
   * Used to replace nodes
   * Currently, only placeholder node can be replaced
   */
  replaceNodeWith: (nodeId, newNodeId) => {
    const nodes = get().nodes;
    const edges = get().edges;

    const nodeToRemove = nodes.find((node) => node.id === nodeId);
    const nodeToReplaceWith = nodes.find((node) => node.id === newNodeId);
    if (!nodeToRemove || !nodeToReplaceWith) return;

    if (nodeToRemove?.type !== ("PlaceholderNode" as NodeType)) {
      console.warn("Can only replace placeholder node");
    }

    const sourceNodeId = nodeToRemove.data.parentId as string;

    const edge = edges.find((edge) => edge.source === sourceNodeId && edge.target === nodeId);

    if (!edge) return;

    const newEdge: Edge = {
      id: `edge-${Date.now()}`,
      source: sourceNodeId,
      target: newNodeId,
      sourceHandle: edge.sourceHandle,
      animated: true,
    };

    // remove the placeholder node and edge and the new node and edge
    const newNodes = nodes.filter((node) => node.id !== nodeId);
    const newEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);

    newEdges.push(newEdge);

    get().setNodes(newNodes);
    get().setEdges(newEdges);
  },
}));
