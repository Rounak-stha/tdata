import { describe, it, expect, beforeEach } from "vitest";
import { FlowVariableManager } from "@/processor/variable";
import { Parser } from "@/processor/parser";
import { NodeEvaluationError } from "src/errors";
import { FlowValue, FlowVariableType } from "@tdata/shared/types";
import { TaskEventBasedFlowContext } from "@/processor/context";
import { MockActionNodeUpdateTaskActionData, MockActionNodeUpdateTaskContext } from "./mocks/action-node-mocks";

export class MockFlowVariableManagerForParserTest extends FlowVariableManager {
  private mockValues: Record<string, any> = {
    "triggering-task.description": "This is an urgent task",
    "triggering-task.statusText": "Completed",
    "triggering-task.completed": "false",
  };

  getValue(variableId: string): any {
    return this.mockValues[variableId];
  }
}

describe("Parser", () => {
  let variableManager: MockFlowVariableManagerForParserTest;
  let parser: Parser;

  beforeEach(() => {
    variableManager = new MockFlowVariableManagerForParserTest();
    const context = new TaskEventBasedFlowContext({
      variableManager: variableManager,
      automation: {} as any,
      message: {} as any,
      task: {} as any,
      project: {} as any,
    });
    parser = new Parser(context);
  });
  it("should parse static number value", () => {
    const flowValue: FlowValue = { type: "static", value: "42" };
    expect(parser.parseFlowValueAsType(flowValue, "number")).toBe(42);
  });

  it("should parse variable text value", () => {
    const flowValue: FlowValue = { type: "variable", value: { id: "triggering-task.description", name: "Description", type: "text", description: "Description of the task" } };
    expect(parser.parseFlowValueAsType(flowValue, "text")).toBe("This is an urgent task");
  });

  it("should parse static boolean value", () => {
    const flowValue: FlowValue = { type: "static", value: "true" };
    expect(parser.parseFlowValueAsType(flowValue, "boolean")).toBe(true);
  });

  it("should parse variable boolean value", () => {
    const flowValue: FlowValue = {
      type: "variable",
      value: { id: "triggering-task.completed", name: "Completed Check", type: "boolean", description: "Completion Status of the task" },
    };
    expect(parser.parseFlowValueAsType(flowValue, "boolean")).toBe(false);
  });

  it("should throw error for invalid number value", () => {
    expect(() => parser.parseNumber("invalid" as any)).toThrow(NodeEvaluationError);
  });

  it("should throw error for invalid boolean value", () => {
    expect(() => parser.parseBoolean("not_boolean" as any)).toThrow(NodeEvaluationError);
  });

  it("should return undefined for missing variable values", () => {
    const flowValue: FlowValue = { type: "variable", value: { id: "not-defined", name: "Not Defined", description: "Not Defined", type: "text" } };
    expect(parser.parseFlowValueAsType(flowValue, "text")).toBeUndefined();
  });

  it("should throw error for unsupported type", () => {
    const flowValue: FlowValue = { type: "static", value: "42" };
    expect(() => parser.parseFlowValueAsType(flowValue, "unknown" as FlowVariableType)).toThrow("Unsupported type: unknown");
  });
});

describe("Parser - Action Node Data Parse Tests", () => {
  let parser: Parser;

  beforeEach(() => {
    parser = new Parser(new MockActionNodeUpdateTaskContext());
  });

  it("Should correctly return parsed data", async () => {
    const result = parser.parseUpdateTaskPayload(MockActionNodeUpdateTaskActionData.PassingActionNodeData.payload);
    expect(result.standardFieldParsedPayloadData["status"]).to.not.be.undefined;
    expect(result.standardFieldParsedPayloadData["status"]).to.equal(1);
    expect(result.userFieldParsedPayoadData["assignee"]).to.not.be.undefined;
    expect(result.userFieldParsedPayoadData["assignee"]).to.equal("c0ffee");
    expect(result.customFieldParsedPayloadData["Story Points"]).to.not.be.undefined;
    expect(result.customFieldParsedPayloadData["Story Points"]).to.equal(2);
    expect(result.userFieldParsedPayoadData["reporter"]).to.not.be.undefined;
    expect(result.userFieldParsedPayoadData["reporter"]).to.equal("c0ffee0");
  });
});
