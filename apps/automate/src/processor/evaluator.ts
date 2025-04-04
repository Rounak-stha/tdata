import {
  ActionNodeAddCommentPayload,
  ActionNodeData,
  ActionNodeUpdateTaskPayload,
  ConditionNodeData,
  FlowNode,
  FlowOperatorValue,
  FlowValue,
  FlowVariableType,
  FlowVariableValue,
  TriggerNodeData,
} from "@tdata/shared/types";
import { isOperatorCompatible, isSupportedType } from "@tdata/shared/utils";
import { NodeEvaluationError } from "src/errors";
import { isArray, isString, isBooleanOrBooleanString, parseBooleanOrBooleanString } from "@/utils";
import { TaskEventBasedFlowContext } from "./context";
import { Parser } from "./parser";
import { AutomationService } from "src/services/automation";

export class FlowEvaluator {
  parser: Parser;
  constructor(private context: TaskEventBasedFlowContext) {
    this.parser = new Parser(context);
  }

  async evaluateNode(node: FlowNode): Promise<string> {
    const nodeType = node.type;
    const nodeData = node.data;

    switch (nodeType) {
      case "TriggerNode":
        return this.evaluateTriggerNode(nodeData as TriggerNodeData);
      case "ConditionNode":
        return this.evaluateConditionNode(nodeData as ConditionNodeData);
      case "ActionNode":
        return this.evaluateActionNode(nodeData as ActionNodeData);
      case "PlaceholderNode":
        return "true";
      default:
        throw new Error(`Unknown node type: ${nodeType}`);
    }
  }

  private async evaluateTriggerNode(nodeData: TriggerNodeData): Promise<string> {
    return "true";
    // (await this.evaluateCondition(nodeData)) ? "true" : "false";
  }

  private async evaluateConditionNode(nodeData: ConditionNodeData): Promise<string> {
    return (await this.evaluateCondition(nodeData)) ? "true" : "false";
  }

  private async evaluateActionNode(nodeData: ActionNodeData): Promise<string> {
    // Perform action and modify variables if needed
    switch (nodeData.action) {
      case "Update_Task":
        await this.updateTask(nodeData.payload as ActionNodeUpdateTaskPayload);
        break;
      case "Add_Comment":
        await this.addComment(nodeData.payload as ActionNodeAddCommentPayload);
        break;
      default:
        throw new Error(`Unsupported action: ${nodeData.action}`);
    }

    return "true";
  }

  private async evaluateCondition(data: ConditionNodeData): Promise<boolean> {
    const condition = data.condition;

    if (!condition.field || !condition.operator || !condition.value) {
      throw new NodeEvaluationError("Invalid Condition: Missing Required Fields", condition);
    }

    if (!isSupportedType(condition.field.type) || !isOperatorCompatible(condition.operator.value, condition.field.type)) {
      throw new NodeEvaluationError("Invalid Condition: Invalid Operator", condition);
    }

    const leftValue = this.context.variableManager.getValue(condition.field.id);
    const rightValue = this.resolveValue(condition.value);

    console.log({
      variables: this.context.variableManager.getAllVariables(),
      leftValue,
      rightValue,
    });

    if (!leftValue || !rightValue) {
      throw new NodeEvaluationError("Invalid Condition: Empty Operands", condition);
    }

    const fieldType = condition.field.type;
    const operator = condition.operator.value;

    return this.assertTypeAndEvaluate(leftValue, rightValue, operator, fieldType);
  }

  private assertTypeAndEvaluate(leftValue: FlowVariableValue, rightValue: FlowVariableValue, operator: FlowOperatorValue, fieldType: FlowVariableType): boolean {
    const fieldTypeHandlers: Record<string, (lv: any, rv: any) => boolean> = {
      text: (lv, rv) => {
        if (!isString(lv) || !isString(rv)) throw new NodeEvaluationError("Type mismatch: expected text", { leftValue: lv, rightValue: rv });
        return this.compareText(lv, rv, operator);
      },
      number: (lv, rv) => {
        const parsedLv = parseInt(lv);
        const parsedRv = parseInt(rv);
        if (isNaN(parsedLv) || isNaN(parsedRv)) throw new NodeEvaluationError("Type Mismatch: Expected Number", { leftValue: lv, rightValue: rv });
        return this.compareNumber(parsedLv, parsedRv, operator);
      },
      status: (lv, rv) => {
        const parsedLv = parseInt(lv);
        const parsedRv = parseInt(rv);
        if (isNaN(parsedLv) || isNaN(parsedRv)) throw new NodeEvaluationError("Type Mismatch: Expected Number", { leftValue: lv, rightValue: rv });
        return this.compareNumber(parsedLv, parsedRv, operator);
      },
      priority: (lv, rv) => {
        const parsedLv = parseInt(lv);
        const parsedRv = parseInt(rv);
        if (isNaN(parsedLv) || isNaN(parsedRv)) throw new NodeEvaluationError("Type Mismatch: Expected Number", { leftValue: lv, rightValue: rv });
        return this.compareNumber(parsedLv, parsedRv, operator);
      },
      boolean: (lv, rv) => {
        const isValidBooleanString = isBooleanOrBooleanString(lv) && isBooleanOrBooleanString(rv);
        if (!isValidBooleanString) throw new NodeEvaluationError("Type Mismatch: Expected Boolean", { leftValue: lv, rightValue: rv });
        const parsedLv = parseBooleanOrBooleanString(lv);
        const parsedRv = parseBooleanOrBooleanString(rv);
        return this.compareBoolean(parsedLv, parsedRv, operator);
      },
      date: (lv, rv) => {
        if (!isString(lv) || !isString(rv)) throw new NodeEvaluationError("Type Mismatch: Expected Text", { leftValue: lv, rightValue: rv });
        const parsedLv = new Date(lv);
        const parsedRv = new Date(rv);
        if (isNaN(parsedLv.getTime()) || isNaN(parsedRv.getTime())) throw new NodeEvaluationError("Type Mismatch: Expected Date", { leftValue: lv, rightValue: rv });
        return this.compareDate(parsedLv, parsedRv, operator);
      },
      select: (lv, rv) => {
        if (!isString(lv) || !isString(rv)) throw new NodeEvaluationError("Type Mismatch: Expected Select (string)", { leftValue: lv, rightValue: rv });
        return this.compareSelect(lv, rv, operator);
      },
      multiSelect: (lv, rv) => {
        if (!isArray(lv) || !isString(rv)) throw new NodeEvaluationError("Type Mismatch: Expected MultiSelect (array)", { leftValue: lv, rightValue: rv });
        return this.compareMultiSelect(lv, rv, operator);
      },
    };

    if (!fieldTypeHandlers[fieldType]) {
      throw new NodeEvaluationError(`Unsupported Field Type: ${fieldType}`, { fieldType, leftValue, rightValue });
    }

    return fieldTypeHandlers[fieldType](leftValue, rightValue);
  }

  private compareText(leftValue: string, rightValue: string, operator: FlowOperatorValue): boolean {
    switch (operator) {
      case "eq":
        return leftValue === rightValue;
      case "neq":
        return leftValue !== rightValue;
      case "contains":
        return leftValue.includes(rightValue);
      default:
        return false;
    }
  }

  private compareNumber(leftValue: number, rightValue: number, operator: FlowOperatorValue): boolean {
    switch (operator) {
      case "eq":
        return leftValue === rightValue;
      case "neq":
        return leftValue !== rightValue;
      case "gt":
        return leftValue > rightValue;
      case "gte":
        return leftValue >= rightValue;
      case "lt":
        return leftValue < rightValue;
      case "lte":
        return leftValue <= rightValue;
      default:
        return false;
    }
  }

  private compareBoolean(leftValue: boolean, rightValue: boolean, operator: FlowOperatorValue): boolean {
    switch (operator) {
      case "eq":
        return leftValue === rightValue;
      case "neq":
        return leftValue !== rightValue;
      default:
        return false;
    }
  }

  private compareDate(leftValue: Date, rightValue: Date, operator: FlowOperatorValue): boolean {
    switch (operator) {
      case "eq":
        return leftValue.getTime() === rightValue.getTime();
      case "neq":
        return leftValue.getTime() !== rightValue.getTime();
      case "gt":
        return leftValue > rightValue;
      case "gte":
        return leftValue >= rightValue;
      case "lt":
        return leftValue < rightValue;
      case "lte":
        return leftValue <= rightValue;
      default:
        return false;
    }
  }

  private compareSelect(leftValue: string, rightValue: string, operator: FlowOperatorValue): boolean {
    switch (operator) {
      case "eq":
        return leftValue === rightValue;
      case "neq":
        return leftValue !== rightValue;
      default:
        return false;
    }
  }

  private compareMultiSelect(leftValue: string[], rightValue: string, operator: FlowOperatorValue): boolean {
    switch (operator) {
      case "contains":
        return leftValue.includes(rightValue);
      default:
        return false;
    }
  }

  private resolveValue(flowValue: FlowValue): FlowVariableValue | undefined {
    return flowValue.type === "static" ? flowValue.value : this.context.variableManager.getValue(flowValue.value.id);
  }

  private async updateTask(payload: ActionNodeUpdateTaskPayload) {
    const parsedPayload = this.parser.parseUpdateTaskPayload(payload);

    await AutomationService.updateTaskFields(this.context.task, {
      standardFields: parsedPayload.standardFieldParsedPayloadData,
      customFields: parsedPayload.customFieldParsedPayloadData,
      userFields: parsedPayload.userFieldParsedPayoadData,
    } as Parameters<(typeof AutomationService)["updateTaskFields"]>[1]);
  }

  private async addComment(payload: { taskId: number; comment: string }) {
    // Could update variables or perform side effects
    console.log("Adding comment", payload);
  }
}
