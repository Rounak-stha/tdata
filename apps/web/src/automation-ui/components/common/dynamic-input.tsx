import { useState, useRef, useEffect } from "react";
import { containsExpression, createVariablePlaceholder, extractVariableNameFromPlaceholder, validateExpression } from "@/automation-ui/utils/form-utils";
import VariableSelector from "./variable-selector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FlowVariable } from "@/automation-ui/types";

interface DynamicInputProps {
  value: FlowVariable | null;
  onChange: (value: FlowVariable) => void;
  placeholder?: string;
  label?: string;
  supportExpressions?: boolean;
  className?: string;
  inputType?: "text" | "textarea";
  error?: string | null;
  isRightOperand?: boolean;
}

const DynamicInput = ({ value, onChange, placeholder = "", label, supportExpressions = true, className = "", inputType = "text", error = null }: DynamicInputProps) => {
  const [inputValue, setInputValue] = useState(value?.name || "");
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
    onChange(variable);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputFocus = () => {
    if (supportExpressions) {
      setShowVariableSelector(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (!showVariableSelector && supportExpressions) {
      setShowVariableSelector(true);
    }
  };

  const isExpression = supportExpressions && containsExpression(inputValue);
  const isValidExpression = isExpression ? validateExpression(inputValue) : true;

  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>}

      <div className="relative flex items-center">
        {inputType === "textarea" ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className={`w-full bg-white border rounded-md py-1.5 px-3 text-sm ${!isValidExpression ? "border-red-400" : ""} ${error ? "border-red-400" : ""}`}
            rows={3}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e)}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className={`w-full h-8  ${!isValidExpression ? "border-red-400" : ""} ${error ? "border-red-400" : ""}`}
          />
        )}
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
        />
      )}
    </div>
  );
};

export default DynamicInput;
