import { useState, useRef, useEffect, FC } from "react";
import { containsExpression, createVariablePlaceholder, extractVariableNameFromPlaceholder, validateExpression } from "@/automation-ui/utils/form-utils";
import VariableSelector from "./variable-selector";
import { Input } from "@/components/ui/input";
import { FlowVariable } from "@/automation-ui/types";
import { FlowValueComponentBaseProps } from "@/automation-ui/types/components";
import { TrashIcon } from "lucide-react";

/**
 * PrimitiveValueComponent is allows users to input a primitive value.
 * Boolean is not supported by this component because although it is a primitive type, there are only 2 possible values and would be practical to use a select instead
 */
export const FlowValuePrimitiveComponent: FC<FlowValueComponentBaseProps> = ({
  value,
  onChange,
  placeholder = "",
  label,
  className = "",
  error = null,
  disabled = false,
  deletable = false,
  onDelete,
}) => {
  const [inputValue, setInputValue] = useState(value?.type == "static" ? value.value : value?.type == "variable" ? value.value.name : "");
  const [showVariableSelector, setShowVariableSelector] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
  const variableOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (variableOptionsRef.current && !variableOptionsRef.current.contains(event.target as Node)) {
        setShowVariableSelector(false);
      }
    };

    if (showVariableSelector) {
      document.addEventListener("mousedown", handleClickOutside, { capture: true });
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVariableSelector]);

  const handleSelectVariable = (variable: FlowVariable) => {
    setInputValue(createVariablePlaceholder(variable.name));
    onChange({ type: "variable", value: variable });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ type: "static", value: newValue });
    if (!showVariableSelector) {
      setShowVariableSelector(true);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const isExpression = containsExpression(inputValue);
  const isValidExpression = isExpression ? validateExpression(inputValue) : true;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <label className="flex-1 block text-xs font-medium text-gray-500 mb-1">{label ? label : "Field"}</label>
        {deletable && <TrashIcon size={14} onClick={handleDelete} className="hover:text-destructive cursor-pointer" />}
      </div>

      <div className="relative flex items-center">
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-8  ${isExpression ? "border-blue-400 bg-blue-50" : ""} ${!isValidExpression ? "border-red-400" : ""} ${error ? "border-red-400" : ""}`}
        />
      </div>

      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

      {!isValidExpression && <div className="text-xs text-red-500 mt-1">Invalid expression format</div>}

      {showVariableSelector && (
        <VariableSelector
          ref={variableOptionsRef}
          isOpen={showVariableSelector}
          onClose={() => setShowVariableSelector(false)}
          onSelect={handleSelectVariable}
          searchTerm={extractVariableNameFromPlaceholder(inputValue)}
          setSearchTerm={(term) => setInputValue(term)}
          types={["text", "number"]}
        />
      )}
    </div>
  );
};
