import { FC, useMemo, useState } from "react";
import { FlowValueComponentBaseProps } from "@/automation-ui/types/components";
import { useFlowStore } from "@/automation-ui/store/flow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import invariant from "tiny-invariant";
import { TrashIcon } from "lucide-react";

/**
 * FlowValueStatusComponent is allows users to select one of the status for the field.
 * Standard selects like Status, Priority and Assignee have their own Component.
 */
export const FlowValueSelectComponent: FC<FlowValueComponentBaseProps> = ({ type, valueFor, value, onChange, label, className = "", deletable = false, onDelete }) => {
  invariant((type == "select" || type == "multiSelect") && valueFor, "Select can only be used with select fields");
  valueFor = valueFor.toLowerCase();

  const [selectValue, setSelectValue] = useState<string | undefined>(value?.type == "static" ? value.value : value?.type == "variable" ? value.value.value : undefined);
  const { project } = useFlowStore();
  const options = useMemo(() => {
    return project?.template.taskProperties?.find((p) => p.name.toLowerCase() === valueFor && p.type == type)?.options || [];
  }, [project, valueFor, type]);

  const handleValueChange = (value: string) => {
    setSelectValue(value);
    onChange({ type: "static", value });
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <label className="flex-1 block text-xs font-medium text-gray-500 mb-1">{label ? label : "Value"}</label>
        {deletable && <TrashIcon size={14} onClick={handleDelete} className="hover:text-destructive cursor-pointer" />}
      </div>

      <div className="relative flex items-center">
        <Select value={selectValue} onValueChange={handleValueChange}>
          <SelectTrigger className="h-8" disabled={!options.length}>
            <SelectValue placeholder="Select Option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((op) => (
              <SelectItem key={op} value={op}>
                {op}
              </SelectItem>
            ))}{" "}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
