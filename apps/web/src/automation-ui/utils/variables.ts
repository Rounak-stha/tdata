import { nanoid } from "nanoid";
import { FlowVariable, FlowVariableType } from "@tdata/shared/types";

export const createCustomVariable = (name: string, value: string | string[], type: FlowVariableType, description: string = ""): FlowVariable => {
  return {
    id: nanoid(),
    name,
    value,
    type,
    description,
  };
};
