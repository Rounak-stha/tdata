import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";

import { canDeleteNode, getPlaceholderNodeAndedges, isValidConnection, createNode, createEdge } from "@/automation-ui/utils";
import type { AppState, FlowVariable, NodeType } from "@/automation-ui/types";
import { ProjectDetail } from "@tdata/shared/types";

const InitialTriggerNode = createNode("TriggerNode");
const InitialPlaceholderNode = createNode("PlaceholderNode", InitialTriggerNode, { label: "Placeholder Node", parentId: InitialTriggerNode.id });

export const InitialNodes = [InitialTriggerNode, InitialPlaceholderNode];

export const InitialEdges = [createEdge(InitialTriggerNode, InitialPlaceholderNode)];

export const useFlowStore = create<AppState>((set, get) => ({
  nodes: InitialNodes,
  edges: InitialEdges,
  invalidConnection: false,
  project: {} as ProjectDetail,
  variables: { system: [] as FlowVariable[], custom: [] as FlowVariable[] },
  getFlow: () => {
    return { nodes: get().nodes, edges: get().edges };
  },
  setVariables: (variables) => {
    set({ variables });
  },
  setCustomVariable: (variable) => {
    const variables = get().variables;
    variables.custom.push(variable);
    set({ variables });
  },
  deleteCustomVariable: (id) => {
    // NOTE: We also need to check if the variable is used somewhere in the flow before actually deleting it
    const variables = get().variables;
    variables.custom = variables.custom.filter((variable) => variable.id !== id);
    set({ variables });
  },
  updateCustomVariable: (id, newVariable) => {
    const variables = get().variables;
    variables.custom = variables.custom.map((variable) => (variable.id === id ? newVariable : variable));
    set({ variables });
  },
  getVariables: () => {
    return [...get().variables.system, ...get().variables.custom];
  },
  getSystemVariables: () => {
    return get().variables.system;
  },
  getCustomVariables: () => {
    return get().variables.custom;
  },
  removeCustomVariable: (id) => {
    const variables = get().variables;
    variables.custom = variables.custom.filter((variable) => variable.id !== id);
    set({ variables });
  },
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
  updateNodeData: (nodeId, data) => {
    const nodes = get().nodes;
    const node = nodes.find((node) => node.id === nodeId);
    if (!node) return;
    node.data = { ...node.data, ...data };
    set({ nodes });
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
    const newNode = createNode(type, sourceNode, { label: type === "ActionNode" ? "Action" : "Condition" });
    const newEdge = createEdge(sourceNode, newNode);
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
          const placeholderNode = createNode("PlaceholderNode", parentNode);
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
    const nodeToReplace = nodes.find((node) => node.id === nodeId);

    if (!nodeToReplace) return;

    if (nodeToReplace?.type !== ("PlaceholderNode" as NodeType)) {
      console.warn("No a placeholder node");
      console.warn(`Cannot replace node with ${newNodeType} due to existing node type restrictions`);
    }

    const parentId = nodeToReplace.data.parentId;
    const parentNode = nodes.find((node) => node.id === parentId);
    if (!parentNode) return;

    const newNode: Node = createNode(newNodeType, parentNode, { label: newNodeType === "ActionNode" ? "Action" : "Condition" });
    newNode.position = nodeToReplace.position;

    const newEdge: Edge = createEdge(parentNode, newNode);

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
