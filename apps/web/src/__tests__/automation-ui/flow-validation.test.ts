import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateFlow } from "@/automation-ui/utils/validation";
import { ActionNodeData, ConditionNodeData, Flow, NodeType, TriggerNodeData } from "@/automation-ui/types";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validateFlow", () => {
  it("should validate a correct workflow", () => {
    const flow: Flow = {
      nodes: [
        {
          id: "1",
          type: "TriggerNode",
          data: {
            label: "Trigger",
            type: "Task_Update",
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: { type: "static", value: "Super" },
            },
          } as TriggerNodeData,
          position: { x: 0, y: 0 },
        },
        {
          id: "2",
          type: "ActionNode",
          data: { label: "Action Node", action: "Update_Task", payload: { status: { type: "static", value: "closed" } } } as ActionNodeData,
          position: { x: 0, y: 0 },
        },
      ],
      edges: [{ id: "1", source: "1", target: "2" }],
    };

    expect(() => validateFlow(flow)).not.toThrow();
  });

  it("should return error when no trigger node is found", () => {
    const flow: Flow = {
      nodes: [
        {
          id: "2",
          type: "ActionNode",
          data: { label: "Action Node", action: "Update_Task", payload: { status: { type: "static", value: "closed" } } } as ActionNodeData,
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    };

    validateFlow(flow);
    expect(toast.error).toHaveBeenCalledWith("No TriggerNode found");
  });

  it("should return error when multiple trigger nodes are found", () => {
    const flow: Flow = {
      nodes: [
        {
          id: "1",
          type: "TriggerNode",
          data: {
            label: "Trigger",
            type: "Task_Update",
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: { type: "static", value: "Super" },
            },
          } as TriggerNodeData,
          position: { x: 0, y: 0 },
        },
        {
          id: "2",
          type: "TriggerNode",
          data: {
            label: "Trigger",
            type: "Task_Update",
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: { type: "static", value: "Super" },
            },
          } as TriggerNodeData,
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    };

    validateFlow(flow);
    expect(toast.error).toHaveBeenCalledWith("Multiple TriggerNodes found, workflow is invalid.");
  });

  it("should return error when there are unreachable nodes", () => {
    const flow: Flow = {
      nodes: [
        {
          id: "1",
          type: "TriggerNode",
          data: {
            label: "Trigger",
            type: "Task_Update",
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: { type: "static", value: "Super" },
            },
          } as TriggerNodeData,
          position: { x: 0, y: 0 },
        },
        {
          id: "2",
          type: "ActionNode",
          data: { label: "Action Node", action: "Update_Task", payload: { status: { type: "static", value: "closed" } } } as ActionNodeData,
          position: { x: 0, y: 0 },
        },
        {
          id: "3",
          type: "ConditionNode",
          data: {
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: { type: "static", value: "Super" },
            },
          } as ConditionNodeData,
          position: { x: 0, y: 0 },
        },
      ],
      edges: [{ id: "1", source: "1", target: "2" }],
    };

    validateFlow(flow);
    expect(toast.error).toHaveBeenCalledWith("Unreachable nodes detected");
  });

  it("should return error for invalid ConditionNode", () => {
    const flow: Flow = {
      nodes: [
        {
          id: "1",
          type: "TriggerNode",
          data: {
            label: "Trigger",
            type: "Task_Update",
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: { type: "static", value: "Super" },
            },
          } as TriggerNodeData,
          position: { x: 0, y: 0 },
        },
        {
          id: "2",
          type: "ConditionNode",
          data: {
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: null,
            },
          } as ConditionNodeData,
          position: { x: 0, y: 0 },
        },
      ],
      edges: [{ id: "1", source: "1", target: "2" }],
    };

    validateFlow(flow);
    expect(toast.error).toHaveBeenCalledWith("ConditionNode 2 has missing field/operator/value.");
  });

  it("should return error for invalid ActionNode payload", () => {
    const flow: Flow = {
      nodes: [
        {
          id: "1",
          type: "TriggerNode",
          data: {
            label: "Trigger",
            type: "Task_Update",
            condition: {
              field: { id: "1", name: "Field Name", type: "text", value: "hello" },
              operator: { label: "Equals", value: "eq" },
              value: { type: "static", value: "Super" },
            },
          } as TriggerNodeData,
          position: { x: 0, y: 0 },
        },
        { id: "2", type: "ActionNode", data: { label: "Action Node", action: "Update_Task", payload: { status: null } } as ActionNodeData, position: { x: 0, y: 0 } },
      ],
      edges: [{ id: "1", source: "1", target: "2" }],
    };

    validateFlow(flow);
    expect(toast.error).toHaveBeenCalledWith("Update_Task ActionNode 2 has invalid value for field: status");
  });

  it("should detect cycles and prevent infinite loops", () => {
    const flow: Flow = {
      nodes: [
        { id: "1", type: "TriggerNode" as NodeType, data: { type: "Update_Task", condition: { field: "status", operator: "equals", value: "open" } }, position: { x: 0, y: 0 } },
        {
          id: "2",
          type: "ActionNode",
          data: { label: "Action Node", action: "Update_Task", payload: { status: { type: "static", value: "closed" } } } as ActionNodeData,
          position: { x: 0, y: 0 },
        },
      ],
      edges: [
        { id: "1", source: "1", target: "2" },
        { id: "2", source: "2", target: "1" }, // Cycle
      ],
    };

    validateFlow(flow);
    expect(toast.error).not.toHaveBeenCalled(); // Should not crash
  });
});
