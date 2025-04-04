import { Automation, AutomationFlow, FlowNode, FlowVariable } from "@tdata/shared/types";
import { FlowGraph } from "./graph";
import { FlowEvaluator } from "./evaluator";
import { TaskEventBasedFlowContext } from "./context";

export class AutomationProcessor {
  evaluator: FlowEvaluator;
  context: TaskEventBasedFlowContext;

  constructor(context: TaskEventBasedFlowContext) {
    this.context = context;
    this.evaluator = new FlowEvaluator(this.context);
  }

  async processFlow() {
    const graph = new FlowGraph(this.context.automation.flow);
    const startNode = graph.startNode;

    if (!startNode) {
      throw new Error("No start node found");
    }

    let currentNode: FlowNode | null = startNode;

    while (currentNode) {
      const branch = await this.evaluator.evaluateNode(currentNode);
      currentNode = graph.getNextNode(currentNode.id, branch) || null;
    }
  }
}
