import { useEffect, FC, useReducer } from "react";
import { Handle, Node, NodeProps, Position, XYPosition } from "@xyflow/react";
import { LucideGitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConditionNodeData, FlowOperator, FlowValue, FlowVariable } from "@/automation-ui/types";
import { FlowCondition } from "../common/flow-condition";
import { ConditionChangeHandler } from "@/automation-ui/types/components";
import { useFlowStore } from "@/automation-ui/store/flow";
import { Tooltip } from "@/components/common/tooltip";

type ConditionNodeAction =
  | { type: "SET_LABEL"; payload: string }
  | { type: "SET_FIELD"; payload: FlowVariable | null }
  | { type: "SET_OPERATOR"; payload: FlowOperator | null }
  | { type: "SET_VALUE"; payload: FlowValue | null };

const conditionNodeReducer = (state: ConditionNodeData, action: ConditionNodeAction): ConditionNodeData => {
  switch (action.type) {
    case "SET_LABEL":
      return { ...state, label: action.payload };

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

type ConditionNodeProps = NodeProps<Node<ConditionNodeData, "ConditionNode">>;

export const ConditionNode: FC<ConditionNodeProps> = ({ id, data, selected }) => {
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

  // Update node data when form changes
  useEffect(() => {
    updateNodeData(id, nodeData);
  }, [nodeData, updateNodeData, id]);

  return (
    <div className={cn("w-[280px] rounded-sm bg-background border", { "border-[#FF8800]": selected })}>
      <div className="px-4 h-12 flex items-center border-b">
        <div className="flex-1 flex items-center gap-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#FFF3EA]">
            <LucideGitBranch className="w-3 h-3 text-[#FF8800]" />
          </div>
          <span className="font-medium text-sm">Check Condition</span>
        </div>
        <Tooltip content="This node evaluates your condition and runs the associated action based on the condition." />
      </div>

      <div className="p-3">
        <FlowCondition field={data.condition.field} operator={data.condition.operator} value={data.condition.value} onChange={handleConditionChange} />
      </div>

      {/* <button className="w-full mt-2 py-1.5 px-3 bg-orange-50 text-orange-600 rounded-md text-sm font-medium hover:bg-orange-100 transition-colors" onClick={validateCondition}>
        Validate Condition
      </button> */}
      <div className="flex justify-around text-xs mb-2">
        <div className="text-[#22C55E]">True ↓</div>
        <div className="text-[#EF4444]">↓ False</div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#FF8800] border-2 border-white" />
      <Handle type="source" position={Position.Bottom} id="true" className="!w-3 !h-3 !bg-[#22C55E] !border-2 !border-white !left-[30%]" />
      <Handle type="source" position={Position.Bottom} id="false" className="!w-3 !h-3 !bg-[#EF4444] !border-2 !border-white !left-[70%]" />
    </div>
  );
};
