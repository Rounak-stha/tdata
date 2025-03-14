import { FlowVariableType } from "@tdata/shared/types";
import { FlowOperators } from "../lib/constants";
import { FlowOperator, FlowOperatorValue } from "@/automation-ui/types";

const TemplateValueRegex = /{{\s*(\w+)\s*/;

export const extractVariableNameFromPlaceholder = (input: string): string => {
  const match = input.match(TemplateValueRegex);
  return match ? match[1].trim() : input.startsWith("{") ? "" : input;
};

export const createVariablePlaceholder = (variable: string): string => {
  return `{{${variable}}}`;
};

const OperatorCompatibility: Record<FlowVariableType, FlowOperatorValue[]> = {
  boolean: ["eq", "neq"],
  number: ["eq", "neq", "gt", "gte", "lt", "lte"],
  text: ["eq", "neq"],
  date: ["eq", "neq", "gt", "gte", "lt", "lte"],
  status: ["eq", "neq"],
  priority: ["eq", "neq"],
  multiSelect: ["contains"],
  select: ["eq", "neq"],
  user: ["eq", "neq"],
};

export const getFlowOperators = (type: FlowVariableType): FlowOperator[] => {
  return FlowOperators.filter((operator) => OperatorCompatibility[type].includes(operator.value));
};

// Function to check if a string contains a variable expression {{var}}
export const containsExpression = (value: string): boolean => {
  return /\{\{.*?\}\}/.test(value);
};

// Function to extract variables from an expression string
export const extractVariables = (expression: string): string[] => {
  const regex = /\{\{(.*?)\}\}/g;
  const matches = [];
  let match;

  while ((match = regex.exec(expression)) !== null) {
    matches.push(match[1].trim());
  }

  return matches;
};

// Validate if an expression is valid (has proper format)
export const validateExpression = (expression: string): boolean => {
  // Simple validation for now - just check if brackets are balanced
  return expression.startsWith("{{") && expression.endsWith("}}") && expression.split("{{").length === expression.split("}}").length;
};

// Fetch options for dropdowns based on the field type
export const fetchOptionsForField = async (fieldType: string): Promise<string[]> => {
  // In a real app, this would connect to your backend
  // For now, we'll return dummy data based on the field type

  switch (fieldType) {
    case "status":
      return ["To Do", "In Progress", "In Review", "Completed"];
    case "priority":
      return ["Low", "Medium", "High", "Urgent"];
    case "assignee":
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return ["John Doe", "Jane Smith", "Alex Johnson", "Sam Wilson"];
    case "team":
      return ["Engineering", "Design", "Marketing", "Sales", "Support"];
    default:
      return [];
  }
};

// Validate a form field based on its type and value
export const validateField = (type: string, value: unknown): string | null => {
  if (!value) {
    return "This field is required";
  }

  // If it's an expression, validate the expression format
  if (typeof value === "string" && containsExpression(value)) {
    return validateExpression(value) ? null : "Invalid expression format";
  }

  // Add specific validations based on type
  switch (type) {
    case "email":
      return /\S+@\S+\.\S+/.test(value as string) ? null : "Invalid email format";
    case "number":
      return isNaN(Number(value)) ? "Must be a number" : null;
    default:
      return null; // No validation errors
  }
};
