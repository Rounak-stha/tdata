import { FlowOperator, FlowVariableType } from "@tdata/shared/types";

export const VERTICAL_SPACING = 350;
export const HORIZONTAL_OFFSET = 50;
export const SIBLING_DISTANCE = 200;
export const NODE_WIDTH = 280;

export const VariablesTypes: { label: string; value: FlowVariableType }[] = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Boolean", value: "boolean" },
  { label: "Date", value: "date" },
  { label: "User", value: "user" },
  { label: "Select", value: "select" },
  { label: "Status", value: "status" },
  { label: "Priority", value: "priority" },
];
