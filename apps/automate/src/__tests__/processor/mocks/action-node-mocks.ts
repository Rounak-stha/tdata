import { TaskEventBasedFlowContext } from "@/processor/context";
import { FlowVariableManager } from "@/processor/variable";
import { ConditionNodeData, FlowNode } from "@tdata/shared/types";

export class MockFlowVariableManagerForActionNode extends FlowVariableManager {
  private mockValues: Record<string, any> = {
    "triggering-task.status": 1,
  };

  getValue(variableId: string): any {
    return this.mockValues[variableId];
  }
}
const mockContext = {
  automation: {} as any,
  variableManager: new MockFlowVariableManagerForActionNode(),
  message: {} as any,
  task: {} as any,
  project: {
    template: {
      taskProperties: [
        {
          name: "Story Points",
          type: "number",
        },
        {
          name: "reporter",
          type: "user",
        },
      ],
    },
  } as any,
};

export class MockActionNodeUpdateTaskContext extends TaskEventBasedFlowContext {
  constructor() {
    super(mockContext);
  }
}

export const MockActionNodeUpdateTaskActionData = {
  PassingActionNodeData: {
    label: "Action",
    action: "Update_Task",
    payload: {
      status: {
        type: "variable",
        value: {
          id: "triggering-task.status",
          name: "triggering-task.status",
          type: "status",
          value: "undefined",
          description: "The description of the task",
        },
      },
      assignee: {
        type: "static",
        value: "c0ffee",
      },
      "Story Points": {
        type: "static",
        value: "2",
      },
      reporter: {
        type: "static",
        value: "c0ffee0",
      },
    },
  },
} as const;
