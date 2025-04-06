import { useState, useRef, useEffect, forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useFlowStore } from "@/automation-ui/store/flow";

import { Badge } from "@/components/ui/badge";
import { FlowVariable, FlowVariableType } from "@tdata/shared/types";

interface VariableSelectorProps {
  onSelect: (variable: FlowVariable) => void;
  isOpen: boolean;
  onClose: () => void;
  filterType?: string;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  compatibleWith?: string; // For compatibility filtering
  types?: FlowVariableType[];
}

export const VariableSelector = forwardRef<HTMLDivElement, VariableSelectorProps>(function VariableSelector(
  { onSelect, isOpen, onClose, searchTerm = "", setSearchTerm, types, compatibleWith },
  forwardedRef
) {
  const { getVariables } = useFlowStore();
  const allVariables = useMemo(() => {
    const v = getVariables();
    if (types) {
      return v.filter((v) => types.includes(v.type));
    }
    return v;
  }, [getVariables, types]);
  const [variables, setVariables] = useState(allVariables);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filteredVars = allVariables;

    const searchString = (searchTerm || "").trim().toLowerCase();
    if (searchString) {
      filteredVars = filteredVars.filter((v) => v.name.toLowerCase().includes(searchString) || (v.description && v.description.toLowerCase().includes(searchString)));
    }

    setVariables(filteredVars);
    setHighlightedIndex(0);
  }, [searchTerm, compatibleWith]);

  useEffect(() => {
    if (highlightedRef.current && containerRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < variables.length - 1 ? prev + 1 : prev));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (variables[highlightedIndex]) {
            handleVariableSelect(variables[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, variables, highlightedIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  if (!isOpen) return null;

  const handleVariableSelect = (variable: FlowVariable) => {
    onSelect(variable);
    onClose();
  };

  const showCategoryFilters = !compatibleWith;

  const style = {
    position: "absolute",
    left: "0",
    top: "calc(100% + 1px)",
    zIndex: 1000,
  } as React.CSSProperties;

  return (
    <div ref={forwardedRef}>
      <div ref={containerRef} className="bg-background rounded-sm border variable-selector" style={style} onWheel={handleWheel}>
        {showCategoryFilters && (
          <div className="flex gap-1 p-2 border-b">
            <button
              className={cn("px-2 py-1 text-xs bg-muted text-muted-foreground rounded-sm hover:bg-accent", { "bg-accent": searchTerm == "task" })}
              onClick={() => setSearchTerm?.("task")}
            >
              Task
            </button>
            <button
              className={cn("px-2 py-1 text-xs bg-muted text-muted-foreground rounded-sm hover:bg-accent", { "bg-accent": searchTerm == "user" })}
              onClick={() => setSearchTerm?.("user")}
            >
              User
            </button>
            <button
              className={cn("px-2 py-1 text-xs bg-muted text-muted-foreground rounded-sm hover:bg-accent", { "bg-accent": searchTerm == "project" })}
              onClick={() => setSearchTerm?.("project")}
            >
              Project
            </button>
            <button
              className={cn("px-2 py-1 text-xs bg-muted text-muted-foreground rounded-sm hover:bg-accent", { "bg-accent": searchTerm == "trigger" })}
              onClick={() => setSearchTerm?.("trigger")}
            >
              Trigger
            </button>
            <button
              className={cn("px-2 py-1 text-xs bg-muted text-muted-foreground rounded-sm hover:bg-accent", { "bg-accent": searchTerm == "variables" })}
              onClick={() => setSearchTerm?.("variables")}
            >
              Custom
            </button>
          </div>
        )}

        {compatibleWith && (
          <div className="p-2 border-b">
            <div className="text-xs font-medium text-gray-500">
              Showing variables compatible with <span className="text-blue-600">{compatibleWith}</span>
            </div>
          </div>
        )}

        <div className="max-h-[300px] overflow-y-auto p-1" onWheel={handleWheel}>
          {variables.length === 0 ? (
            <div className="py-3 px-4 text-sm text-gray-500 text-center">No variables match your search</div>
          ) : (
            variables.map((variable, index) => (
              <div
                key={variable.name}
                ref={index === highlightedIndex ? highlightedRef : null}
                className={cn("py-2 px-3 text-sm rounded-md cursor-pointer flex flex-col hover:bg-accent")}
                onClick={() => handleVariableSelect(variable)}
                onMouseOver={() => setHighlightedIndex(index)}
                onWheel={handleWheel}
              >
                <span className="flex items-center font-medium text-muted-foreground">
                  <span className="mr-1">{variable.name}</span>
                  {variable.type && (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {variable.type}
                    </Badge>
                  )}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">{variable.description}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

export default VariableSelector;
