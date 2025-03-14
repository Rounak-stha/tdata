import { FC, useEffect, useReducer, useState } from "react";
import { Handle, Node, NodeProps, Position, XYPosition } from "@xyflow/react";
import { LucideCircleDot } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { FlowOperator, FlowValue, FlowVariable, TriggerNodeData, TriggerType } from "@/automation-ui/types";
import { useFlowStore } from "@/automation-ui/store/flow";
import { ConditionChangeHandler } from "@/automation-ui/types/components";
import { FlowCondition } from "../common/flow-condition";
import { Tooltip } from "@/components/common/tooltip";

type TriggerNodeAction =
  | { type: "SET_LABEL"; payload: string }
  | { type: "SET_TYPE"; payload: TriggerType }
  | { type: "SET_FIELD"; payload: FlowVariable | null }
  | { type: "SET_OPERATOR"; payload: FlowOperator | null }
  | { type: "SET_VALUE"; payload: FlowValue | null };

const conditionNodeReducer = (state: TriggerNodeData, action: TriggerNodeAction): TriggerNodeData => {
  switch (action.type) {
    case "SET_LABEL":
      return { ...state, label: action.payload };

    case "SET_TYPE":
      return { ...state, type: action.payload };

    case "SET_FIELD":
      return { ...state, condition: { ...state.condition, field: action.payload } };

    case "SET_OPERATOR":
      return { ...state, condition: { ...state.condition, operator: action.payload } };

    case "SET_VALUE":
      return { ...state, condition: { ...state.condition, value: action.payload } };

    default:
      return state;
  }
};

export const TriggerNode: FC<NodeProps<Node<TriggerNodeData, "TriggerNode">>> = ({ id, data, selected }) => {
  const { updateNodeData } = useFlowStore();
  const [nodeData, dispatchNodeDataAction] = useReducer(conditionNodeReducer, data);

  const handleConditionChange: ConditionChangeHandler = (key, value) => {
    if (key === "field") {
      dispatchNodeDataAction({ type: "SET_FIELD", payload: value as FlowVariable });
    } else if (key === "operator") {
      dispatchNodeDataAction({ type: "SET_OPERATOR", payload: value as FlowOperator });
    } else if (key === "value") {
      dispatchNodeDataAction({ type: "SET_VALUE", payload: value as FlowValue });
    }
  };

  useEffect(() => {
    updateNodeData(id, nodeData);
  }, [nodeData, updateNodeData, id]);

  return (
    <div className={cn("w-[280px] rounded-sm bg-background border", { "border-[#9E77ED]": selected })}>
      <div className="px-4 h-12 flex items-center border-b">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F4EBFF]">
            <LucideCircleDot className="w-3 h-3 text-[#9E77ED]" />
          </div>
          <span className="font-medium text-sm">Trigger</span>
        </div>
        <Tooltip content="This node starts your workflow when the specified task event occurs" />
      </div>

      <div className="bg-background p-3 flex flex-col gap-2">
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-1">Trigger when</Label>
          <Select value={nodeData.type} onValueChange={(value) => dispatchNodeDataAction({ type: "SET_TYPE", payload: value as TriggerType })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="When" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="disabled:cursor-not-allowed opacity-90" value={"TASK_CREATED" as TriggerType}>
                Task is created
              </SelectItem>
              <SelectItem className="disabled:cursor-not-allowed opacity-90" value={"TASK_UPDATED" as TriggerType}>
                Task is updated
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <FlowCondition field={data.condition.field} operator={data.condition.operator} value={data.condition.value} onChange={handleConditionChange} />
      </div>
      {/* Only output handle for trigger node */}
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 hover:!w-3 hover:!h-3 !bg-[#9E77ED] !border-2" />
    </div>
  );
};
