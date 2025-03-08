import { FlowValueComponentBaseProps } from "@/automation-ui/types/components";
import { FC } from "react";
import { FlowValuePrimitiveComponent } from "./flow-value-primitive-component";
import { FlowValueComponentDisabledPlaceholer } from "./flow-value-component-disabled-placeholder";
import { FlowVariableType } from "@/automation-ui/types";
import { FlowValueSelectComponent } from "./flow-value-select-component";
import { FlowValueStatusComponent } from "./flow-value-status-component";
import { FlowValuePriorityComponent } from "./flow-value-priority-component";
import { FlowValueUserComponent } from "./flow-value-user-component";

type FlowValueComponentProps = Omit<FlowValueComponentBaseProps, "type"> & {
  type?: FlowVariableType | null;
};

export const FlowValueComponent: FC<FlowValueComponentProps> = ({ type, ...props }) => {
  if (!type) return <FlowValueComponentDisabledPlaceholer />;
  switch (type) {
    case "text":
    case "number":
      return <FlowValuePrimitiveComponent type={type} {...props} />;
    case "select":
    case "multiSelect":
      return <FlowValueSelectComponent type={type} {...props} />;
    case "status":
      return <FlowValueStatusComponent type={type} {...props} />;
    case "priority":
      return <FlowValuePriorityComponent type={type} {...props} />;
    case "user":
      return <FlowValueUserComponent type={type} {...props} />;
    default:
      return <p>To be implemented</p>;
  }
};
