import { ActionNodeUpdateTaskPayload, FlowValue, FlowVariableType, FlowVariableValue, TaskStandardUpdatableFieldLabels } from "@tdata/shared/types";
import { NodeEvaluationError } from "src/errors";
import { TaskEventBasedFlowContext } from "./context";
import { StandardUpdatableFields } from "@tdata/shared/lib";

export class Parser {
  constructor(private context: TaskEventBasedFlowContext) {}

  public parseFlowValueAsType(flowValue: FlowValue, type: FlowVariableType) {
    let rawValue: FlowVariableValue | undefined = "";
    if (flowValue.type == "static") {
      rawValue = flowValue.value as string;
    } else {
      rawValue = this.context.variableManager.getValue(flowValue.value.id);
    }
    if (!rawValue) return rawValue;
    switch (type) {
      case "number":
      case "status":
      case "priority":
        return this.parseNumber(rawValue);
      case "text":
      case "user":
      case "select":
        return this.parseText(rawValue);
      case "boolean":
        return this.parseBoolean(rawValue);
      case "multiSelect":
        return this.parseMultiSelect(rawValue);
      default:
        throw new Error(`Unsupported type: ${type}`);
    }
  }

  public parseUpdateTaskPayload(payload: ActionNodeUpdateTaskPayload) {
    const customFields = this.context.project.template.taskProperties ?? [];
    const standardUpdatatableTaskFields = StandardUpdatableFields;

    const fieldToType: Record<string, FlowVariableType> = {
      title: "text",
      description: "text",
      status: "status",
      priority: "priority",
      assignee: "user",
    };

    for (const field of customFields) {
      fieldToType[field.name] = field.type;
    }

    const standardFieldParsedPayloadData: Record<string, number | string | string[] | boolean | Date> = {};
    const customFieldParsedPayloadData: Record<string, number | string | string[] | boolean | Date> = {};
    const userFieldParsedPayoadData: Record<string, string> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (fieldToType[key] && value) {
        const parsedValue = this.parseFlowValueAsType(value, fieldToType[key]);
        if (parsedValue) {
          const isStandardField = standardUpdatatableTaskFields.has(key as TaskStandardUpdatableFieldLabels);
          const isUserField = fieldToType[key] === "user";

          if (isUserField) {
            // For user field, the parsed value must be a string
            // This is validated in the parser
            userFieldParsedPayoadData[key] = parsedValue as string;
          } else if (isStandardField) {
            standardFieldParsedPayloadData[key] = parsedValue;
          } else {
            customFieldParsedPayloadData[key] = parsedValue;
          }
        }
      }
    }

    return {
      standardFieldParsedPayloadData,
      customFieldParsedPayloadData,
      userFieldParsedPayoadData,
    };
  }

  public parseNumber(value: unknown): number {
    if (typeof value == "number") return value;
    if (typeof value !== "string") throw new NodeEvaluationError("Invalid value for type number");
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) throw new NodeEvaluationError("Invalid value for type number");
    return parsedValue;
  }

  public parseText(value: FlowVariableValue): string {
    if (typeof value !== "string") throw new NodeEvaluationError("Invalid value for type text");
    return value;
  }

  public isBooleanString(value: FlowVariableValue): value is "true" | "false" {
    if (typeof value !== "string") throw new NodeEvaluationError("Invalid value for type boolean");
    return value === "true" || value === "false";
  }

  public parseBoolean(value: unknown): boolean {
    if (typeof value == "boolean") return value;
    if (typeof value !== "string") throw new NodeEvaluationError("Invalid value for type boolean");
    const isValidBooleanString = this.isBooleanString(value);
    if (!isValidBooleanString) throw new NodeEvaluationError("Invalid value for type boolean");
    return value === "true";
  }

  public parseMultiSelect(value: FlowVariableValue): string[] {
    if (!Array.isArray(value)) throw new NodeEvaluationError("Invalid value for type multiSelect");
    return value;
  }
}
