import { describe, it, expect, beforeEach } from "vitest";

import { NodeEvaluationError } from "src/errors";
import { FlowEvaluator } from "@/processor/evaluator";

import {
  MockConditionNodeWithBooleanFieldCondition,
  MockConditionNodeWithMultiSelectFieldCondition,
  MockConditionNodeWithNumberFieldCondition,
  MockConditionNodeWithSelectFieldCondition,
  MockConditionNodeWithTextFieldCondition,
  MockFlowVariableManagerForConditionNodeBooleanFieldTest,
  MockFlowVariableManagerForConditionNodeMultiSelectFieldTest,
  MockFlowVariableManagerForConditionNodeNumericFieldTest,
  MockFlowVariableManagerForConditionNodeSelectFieldTest,
  MockFlowVariableManagerForConditionNodeTextFieldTest,
} from "./mocks/condition-node-mocks";
import { TaskEventBasedFlowContext } from "@/processor/context";

describe("FlowEvaluator - Condition Node Number Field Tests", () => {
  let flowEvaluator: FlowEvaluator;

  beforeEach((testContext) => {
    const mockContext = {
      automation: {} as any,
      variableManager: new MockFlowVariableManagerForConditionNodeNumericFieldTest(),
      message: {} as any,
      task: {} as any,
      project: {} as any,
    };

    // Mock FlowEvaluator to use our partial context
    flowEvaluator = new FlowEvaluator(mockContext as TaskEventBasedFlowContext);
  });

  it('Should return "true" when the GTE numeric condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.PassingGTENumericCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the GTE numeric condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.FailingGTENumericCondition);
    expect(result).toBe("false");
  });

  it('Should return "true" when the LTE numeric condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.PassingLTENumericCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the LTE numeric condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.FailingLTENumericCondition);
    expect(result).toBe("false");
  });

  it('Should return "true" when the GT numeric condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.PassingGTNumericCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the GT numeric condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.FailingGTNumericCondition);
    expect(result).toBe("false");
  });

  it('Should return "true" when the LT numeric condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.PassingLTNumericCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the LT numeric condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.FailingLTNumericCondition);
    expect(result).toBe("false");
  });

  it('Should return "true" when the EQ numeric condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.PassingEQNumericCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the LE numeric condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.FailingEQNumericCondition);
    expect(result).toBe("false");
  });

  it("Should throw when the numeric condition has unsupported value", async () => {
    await expect(flowEvaluator.evaluateNode(MockConditionNodeWithNumberFieldCondition.ThrowingNumericCondition)).rejects.toThrow(NodeEvaluationError);
  });
});

describe("FlowEvaluator - Condition Node Text Field Tests", () => {
  let flowEvaluator: FlowEvaluator;

  beforeEach(() => {
    const mockContext = {
      automation: {} as any,
      variableManager: new MockFlowVariableManagerForConditionNodeTextFieldTest(),
      message: {} as any,
      task: {} as any,
      project: {} as any,
    };

    // Mock FlowEvaluator to use our partial context
    flowEvaluator = new FlowEvaluator(mockContext as TaskEventBasedFlowContext);
  });

  it('Should return "true" when the text equal is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithTextFieldCondition.PassingEqualsTextCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the text equal condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithTextFieldCondition.FailingEqualsTextCondition);
    expect(result).toBe("false");
  });

  it('Should return "true" when the text not equal condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithTextFieldCondition.PassingNotEqualsTextCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the text not equal condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithTextFieldCondition.FailingNotEqualsTextCondition);
    expect(result).toBe("false");
  });

  it("Should throw when the text condition has an unsupported value type", async () => {
    await expect(flowEvaluator.evaluateNode(MockConditionNodeWithTextFieldCondition.ThrowingTextCondition)).rejects.toThrowError("Type mismatch: expected text");
  });
});

describe("FlowEvaluator - Condition Node Boolean Field Tests", () => {
  let flowEvaluator: FlowEvaluator;

  beforeEach(() => {
    const mockContext = {
      automation: {} as any,
      variableManager: new MockFlowVariableManagerForConditionNodeBooleanFieldTest(),
      message: {} as any,
      task: {} as any,
      project: {} as any,
    };

    // Mock FlowEvaluator to use our partial context
    flowEvaluator = new FlowEvaluator(mockContext as TaskEventBasedFlowContext);
  });

  it('Should return "true" when the boolean equal condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithBooleanFieldCondition.PassingEQBooleanCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the boolean equal condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithBooleanFieldCondition.FailingEQBooleanCondition);
    expect(result).toBe("false");
  });

  it('Should return "true" when the boolean not equal condition is met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithBooleanFieldCondition.PassingNEQBooleanCondition);
    expect(result).toBe("true");
  });

  it('Should return "false" when the boolean not equal condition is not met', async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithBooleanFieldCondition.FailingNEQBooleanCondition);
    expect(result).toBe("false");
  });

  it("Should throw when the boolean condition has an unsupported value", async () => {
    await expect(flowEvaluator.evaluateNode(MockConditionNodeWithBooleanFieldCondition.ThrowingBooleanCondition)).rejects.toThrow("Type Mismatch: Expected Boolean");
  });
});

describe("FlowEvaluator - Select Field Tests", () => {
  let flowEvaluator: FlowEvaluator;

  beforeEach(() => {
    const mockContext = {
      automation: {} as any,
      variableManager: new MockFlowVariableManagerForConditionNodeSelectFieldTest(),
      message: {} as any,
      task: {} as any,
      project: {} as any,
    };

    // Mock FlowEvaluator to use our partial context
    flowEvaluator = new FlowEvaluator(mockContext as TaskEventBasedFlowContext);
  });

  it("Should return 'true' when select EQ condition is met", async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithSelectFieldCondition.PassingEQSelectCondition);
    expect(result).toBe("true");
  });

  it("Should return 'false' when select EQ condition is not met", async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithSelectFieldCondition.FailingEQSelectCondition);
    expect(result).toBe("false");
  });

  it("Should return 'true' when select NEQ condition is met", async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithSelectFieldCondition.PassingNEQSelectCondition);
    expect(result).toBe("true");
  });

  it("Should return 'false' when select NEQ condition is not met", async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithSelectFieldCondition.FailingNEQSelectCondition);
    expect(result).toBe("false");
  });

  it("Should throw an error when the select field has an invalid type", async () => {
    await expect(flowEvaluator.evaluateNode(MockConditionNodeWithSelectFieldCondition.ThrowingSelectCondition)).rejects.toThrow(NodeEvaluationError);
  });
});

describe("FlowEvaluator - Multi-Select Field Tests", () => {
  let flowEvaluator: FlowEvaluator;

  beforeEach(() => {
    const mockContext = {
      automation: {} as any,
      variableManager: new MockFlowVariableManagerForConditionNodeMultiSelectFieldTest(),
      message: {} as any,
      task: {} as any,
      project: {} as any,
    };

    // Mock FlowEvaluator to use our partial context
    flowEvaluator = new FlowEvaluator(mockContext as TaskEventBasedFlowContext);
  });

  it("Should return 'true' when multi-select CONTAINS condition is met", async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithMultiSelectFieldCondition.PassingContainsMultiSelectCondition);
    expect(result).toBe("true");
  });

  it("Should return 'false' when multi-select CONTAINS condition is not met", async () => {
    const result = await flowEvaluator.evaluateNode(MockConditionNodeWithMultiSelectFieldCondition.FailingContainsMultiSelectCondition);
    expect(result).toBe("false");
  });

  it("Should throw an error when the multi-select field has an invalid type", async () => {
    await expect(flowEvaluator.evaluateNode(MockConditionNodeWithMultiSelectFieldCondition.ThrowingMultiSelectCondition)).rejects.toThrow(NodeEvaluationError);
  });
});
