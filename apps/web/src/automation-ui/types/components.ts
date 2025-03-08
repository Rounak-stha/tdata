import { FlowOperator, FlowValue, FlowVariable, FlowVariableType } from ".";

export type FlowValueComponentBaseProps = {
  type: FlowVariableType;
  value?: FlowValue | null;
  onChange: (value: FlowValue) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string | null;
  disabled?: boolean;
  /**
   * For simple use ases, the type field would be mreo than enough to render the FlowValueComponent.
   * For select types, we need to know the list of options to select from.
   * For pre-defined fields like Stats, Priority, Users there are predefiend values
   * But we also allow users to ceate custom fields and for Select fields we need to know the list of options to select from.
   * This prop must be passed if we want to render one of the User defined Select types for us to know which options to render.
   *
   * IMPORTANT: The check for the name is case-insensitive.
   */
  valueFor?: string;
};

export type ConditionChangeHandler = <T extends "field" | "operator" | "value">(
  key: T,
  value: T extends "field" ? FlowVariable | null : T extends "operator" ? FlowOperator | null : FlowValue | null
) => void;
