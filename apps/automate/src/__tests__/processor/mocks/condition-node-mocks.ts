import { FlowVariableManager } from "@/processor/variable";
import { ConditionNodeData, FlowNode } from "@tdata/shared/types";

export class MockFlowVariableManagerForConditionNodeTextFieldTest extends FlowVariableManager {
  private mockValues: Record<string, any> = {
    "triggering-task.description": "This is an urgent task",
    "triggering-task.statusText": "Completed",
  };

  getValue(variableId: string): any {
    return this.mockValues[variableId];
  }
}

export class MockFlowVariableManagerForConditionNodeBooleanFieldTest extends FlowVariableManager {
  private mockValues: Record<string, any> = {
    "triggering-task.completed": true,
  };

  getValue(variableId: string): any {
    return this.mockValues[variableId];
  }
}

export class MockFlowVariableManagerForConditionNodeNumericFieldTest extends FlowVariableManager {
  private mockValues: Record<string, any> = {
    "triggering-task.status": 1,
    "triggering-task.story_point": 5,
    "triggering-task.status.withNoValue": undefined,
  };

  getValue(variableId: string): any {
    return this.mockValues[variableId];
  }
}

export class MockFlowVariableManagerForConditionNodeSelectFieldTest extends FlowVariableManager {
  private mockValues: Record<string, any> = {
    "task.category": "bug",
    "task.type": "feature_request",
    "task.invalid": 123, // Invalid value (not a string)
  };

  getValue(variableId: string): any {
    return this.mockValues[variableId];
  }
}

export class MockFlowVariableManagerForConditionNodeMultiSelectFieldTest extends FlowVariableManager {
  private mockValues: Record<string, any> = {
    "task.labels": ["bug", "urgent", "backend"],
    "task.tags": ["feature_request"],
    "task.invalid": "not_an_array", // Invalid value (not an array)
  };

  getValue(variableId: string): any {
    return this.mockValues[variableId];
  }
}

export const MockConditionNodeWithNumberFieldCondition = {
  PassingGTENumericCondition: {
    id: "OcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Greater Than or Equal", value: "gte" },
        value: { type: "static", value: "3" },
      },
    } as ConditionNodeData,
  },
  FailingGTENumericCondition: {
    id: "PcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Greater Than or Equal", value: "gte" },
        value: { type: "static", value: "6" },
      },
    } as ConditionNodeData,
  },

  PassingLTENumericCondition: {
    id: "QcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Less Than or Equal", value: "lte" },
        value: { type: "static", value: "6" },
      },
    } as ConditionNodeData,
  },
  FailingLTENumericCondition: {
    id: "RcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Less Than or Equal", value: "lte" },
        value: { type: "static", value: "3" },
      },
    } as ConditionNodeData,
  },

  PassingLTNumericCondition: {
    id: "QcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Less Than", value: "lt" },
        value: { type: "static", value: "6" },
      },
    } as ConditionNodeData,
  },
  FailingLTNumericCondition: {
    id: "RcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Less Than", value: "lt" },
        value: { type: "static", value: "3" },
      },
    } as ConditionNodeData,
  },
  PassingGTNumericCondition: {
    id: "QcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Greater Than", value: "gt" },
        value: { type: "static", value: "3" },
      },
    } as ConditionNodeData,
  },
  FailingGTNumericCondition: {
    id: "RcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Greater Than", value: "gt" },
        value: { type: "static", value: "6" },
      },
    } as ConditionNodeData,
  },
  PassingEQNumericCondition: {
    id: "QcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "5" },
      },
    } as ConditionNodeData,
  },
  FailingEQNumericCondition: {
    id: "RcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "4" },
      },
    } as ConditionNodeData,
  },
  ThrowingNumericCondition: {
    id: "PcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.story_point", name: "triggering-task.story_point", type: "number" },
        operator: { label: "Greater Than or Equal", value: "gte" },
        value: { type: "static", value: "NotANumber" },
      },
    } as ConditionNodeData,
  },
} as const;

export const MockConditionNodeWithTextFieldCondition = {
  PassingEqualsTextCondition: {
    id: "VcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.statusText", name: "triggering-task.statusText", type: "text" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "Completed" },
      },
    } as ConditionNodeData,
  },
  FailingEqualsTextCondition: {
    id: "WcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.statusText", name: "triggering-task.statusText", type: "text" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "In Progress" },
      },
    } as ConditionNodeData,
  },
  PassingNotEqualsTextCondition: {
    id: "VcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.statusText", name: "triggering-task.statusText", type: "text" },
        operator: { label: "Not Equals", value: "neq" },
        value: { type: "static", value: "In Progress" },
      },
    } as ConditionNodeData,
  },
  FailingNotEqualsTextCondition: {
    id: "WcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.statusText", name: "triggering-task.statusText", type: "text" },
        operator: { label: "Not Equals", value: "neq" },
        value: { type: "static", value: "Completed" },
      },
    } as ConditionNodeData,
  },
  ThrowingTextCondition: {
    id: "XcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.description", name: "triggering-task.description", type: "text" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: 123 as any }, // value must be a string but we want to simulate an error
      },
    } as ConditionNodeData,
  },
} as const;

export const MockConditionNodeWithBooleanFieldCondition = {
  PassingEQBooleanCondition: {
    id: "BcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.completed", name: "triggering-task.completed", type: "boolean" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "true" },
      },
    } as ConditionNodeData,
  },

  FailingEQBooleanCondition: {
    id: "CcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.completed", name: "triggering-task.completed", description: "as", type: "boolean" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "false" },
      },
    } as ConditionNodeData,
  },

  PassingNEQBooleanCondition: {
    id: "BcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.completed", name: "triggering-task.completed", type: "boolean" },
        operator: { label: "Not Equals", value: "neq" },
        value: { type: "static", value: "false" },
      },
    } as ConditionNodeData,
  },

  FailingNEQBooleanCondition: {
    id: "CcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.completed", name: "triggering-task.completed", description: "as", type: "boolean" },
        operator: { label: "Not Equals", value: "neq" },
        value: { type: "static", value: "true" },
      },
    } as ConditionNodeData,
  },

  ThrowingBooleanCondition: {
    id: "DcLpY8WaeHLL0149kYljn",
    type: "ConditionNode",
    position: { x: -58, y: 786 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "triggering-task.completed", name: "triggering-task.completed", type: "boolean" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "notABoolean" }, // Invalid boolean value
      },
    } as ConditionNodeData,
  },
} as const;

export const MockConditionNodeWithSelectFieldCondition = {
  PassingEQSelectCondition: {
    id: "SelectEQPass",
    type: "ConditionNode",
    position: { x: 100, y: 200 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.category", name: "task.category", type: "select" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "bug" },
      },
    } as ConditionNodeData,
  },

  FailingEQSelectCondition: {
    id: "SelectEQFail",
    type: "ConditionNode",
    position: { x: 100, y: 250 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.category", name: "task.category", type: "select" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "feature" },
      },
    } as ConditionNodeData,
  },

  PassingNEQSelectCondition: {
    id: "SelectNEQPass",
    type: "ConditionNode",
    position: { x: 100, y: 300 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.type", name: "task.type", type: "select" },
        operator: { label: "Not Equals", value: "neq" },
        value: { type: "static", value: "bug" },
      },
    } as ConditionNodeData,
  },

  FailingNEQSelectCondition: {
    id: "SelectNEQFail",
    type: "ConditionNode",
    position: { x: 100, y: 350 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.type", name: "task.type", type: "select" },
        operator: { label: "Not Equals", value: "neq" },
        value: { type: "static", value: "feature_request" },
      },
    } as ConditionNodeData,
  },

  ThrowingSelectCondition: {
    id: "SelectThrow",
    type: "ConditionNode",
    position: { x: 100, y: 400 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.invalid", name: "task.invalid", type: "select" },
        operator: { label: "Equals", value: "eq" },
        value: { type: "static", value: "bug" }, // `task.invalid` is a number, so this should throw
      },
    } as ConditionNodeData,
  },
} as const;

export const MockConditionNodeWithMultiSelectFieldCondition = {
  PassingContainsMultiSelectCondition: {
    id: "MultiSelectContainsPass",
    type: "ConditionNode",
    position: { x: 100, y: 200 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.labels", name: "task.labels", type: "multiSelect" },
        operator: { label: "Contains", value: "contains" },
        value: { type: "static", value: "bug" },
      },
    } as ConditionNodeData,
  },

  FailingContainsMultiSelectCondition: {
    id: "MultiSelectContainsFail",
    type: "ConditionNode",
    position: { x: 100, y: 250 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.tags", name: "task.tags", type: "multiSelect" },
        operator: { label: "Contains", value: "contains" },
        value: { type: "static", value: "bug" },
      },
    } as ConditionNodeData,
  },

  ThrowingMultiSelectCondition: {
    id: "MultiSelectThrow",
    type: "ConditionNode",
    position: { x: 100, y: 300 },
    data: {
      label: "Condition",
      condition: {
        field: { id: "task.invalid", name: "task.invalid", type: "multiSelect" },
        operator: { label: "Contains", value: "contains" },
        value: { type: "static", value: "bug" }, // `task.invalid` is a string, so this should throw
      },
    } as ConditionNodeData,
  },
} as const;
