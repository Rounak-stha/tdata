import { Automation, ProjectDetail, TaskDetail, TaskMessage } from "@tdata/shared/types";
import { FlowGraph } from "./graph";
import { FlowVariableManager } from "./variable";

export class TaskEventBasedFlowContext {
  readonly automation: Automation;
  readonly variableManager: FlowVariableManager;
  readonly message: TaskMessage;
  readonly task: TaskDetail;
  readonly project: ProjectDetail;

  constructor(params: { automation: Automation; variableManager: FlowVariableManager; message: TaskMessage; task: TaskDetail; project: ProjectDetail }) {
    this.automation = params.automation;
    this.variableManager = params.variableManager;
    this.message = params.message;
    this.task = params.task;
    this.project = params.project;
  }
}
