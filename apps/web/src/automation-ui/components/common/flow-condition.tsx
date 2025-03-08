import { Label } from "@/components/ui/label";
import DynamicInput from "./dynamic-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlowValueComponent } from "./flow-value-component";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { FlowOperator, FlowValue, FlowVariable } from "@/automation-ui/types";
import { getFlowOperators } from "@/automation-ui/utils/form-utils";
import { ConditionChangeHandler } from "@/automation-ui/types/components";

type FlowConditionProps = {
  field: FlowVariable | null;
  operator: FlowOperator | null;
  value: FlowValue | null;
  onChange: ConditionChangeHandler;
};

export const FlowCondition: FC<FlowConditionProps> = ({ field, operator: initialOperator, value, onChange }) => {
  const [conditionField, setConditionField] = useState<FlowVariable | null>(field || null);
  const [operator, setOperator] = useState<FlowOperator | null>(initialOperator || null);
  const [conditionValue, setConditionValue] = useState<FlowValue | null>(value || null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
  }, []);

  const handleFieldChange = (field: FlowVariable | null) => {
    setConditionField(field);
    onChange("field", field);
  };

  const handleOperatorChange = (operator: FlowOperator | null) => {
    setOperator(operator);
    onChange("operator", operator);
  };

  const handleValueChange = (value: FlowValue | null) => {
    setConditionValue(value);
    onChange("value", value);
  };

  const operators: FlowOperator[] = useMemo(() => {
    if (conditionField) return getFlowOperators(conditionField.type);
    return [];
  }, [conditionField]);

  return (
    <div className="rounded-sm space-y-3">
      <DynamicInput
        label="Field"
        value={conditionField}
        onChange={handleFieldChange}
        inputType="text"
        error={errors.conditionValue}
        supportExpressions={true}
        placeholder="Enter expression, e.g. {{task.priority}} == 'High'"
      />

      <div>
        <Label className="text-xs font-medium text-muted-foreground mb-1 block">Operator</Label>
        <Select value={operator?.value} onValueChange={(value) => handleOperatorChange(operators.find((op) => op.value === value) || null)}>
          <SelectTrigger className="h-8 text-xs" disabled={!operators.length}>
            <SelectValue placeholder="Select Operator" />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}{" "}
          </SelectContent>
        </Select>
      </div>
      <FlowValueComponent
        disabled={!conditionField}
        type={conditionField?.type}
        valueFor={conditionField?.name}
        label="Value"
        value={conditionValue}
        onChange={handleValueChange}
      />
    </div>
  );
};
