import { FlowNode, FlowEdge, NodeType, NodeDataMap, AutomationFlow } from "@tdata/shared/types";

export class FlowGraph {
  startNode: FlowNode = {} as FlowNode;
  private nodeMap: Map<
    string,
    FlowNode & {
      edges: Record<string, string>; // branch name to target node id
    }
  > = new Map();

  constructor(flow: AutomationFlow) {
    this.buildGraph(flow.nodes, flow.edges);
  }

  private buildGraph(flowNodes: FlowNode[], flowEdges: FlowEdge[]) {
    flowNodes.forEach((node) => {
      if (node.type == "TriggerNode") {
        this.startNode = node;
      }
      this.nodeMap.set(node.id, {
        ...node,
        edges: {},
      });
    });

    // Then, add edges
    flowEdges.forEach((edge) => {
      const sourceNode = this.nodeMap.get(edge.source);
      if (sourceNode) {
        // Use sourceHandle or default to 'true'
        const branchName = this.determineBranchName(sourceNode.type, edge.sourceHandle || undefined);
        sourceNode.edges[branchName] = edge.target;
      }
    });
  }

  private determineBranchName(nodeType: NodeType, sourceHandle?: string): string {
    // For condition nodes, use sourceHandle
    if (nodeType === "ConditionNode") {
      return sourceHandle || "false";
    }
    // For all other nodes, use 'true'
    return "true";
  }

  // O(1) get next node
  getNextNode(currentNodeId: string, branch: string = "true"): FlowNode | null {
    const node = this.nodeMap.get(currentNodeId);
    const nextNodeId = node ? node.edges[branch] || null : null;
    return nextNodeId ? this.nodeMap.get(nextNodeId) || null : null;
  }

  // O(1) get node data
  getNodeData<T extends NodeType>(nodeId: string): NodeDataMap[T] | null {
    const node = this.nodeMap.get(nodeId);
    return node ? (node.data as NodeDataMap[T]) : null;
  }

  // O(1) get node type
  getNodeType(nodeId: string): NodeType | null {
    const node = this.nodeMap.get(nodeId);
    return node ? node.type : null;
  }
}
