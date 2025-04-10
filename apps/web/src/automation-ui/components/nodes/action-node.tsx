import { FC, useReducer, useEffect, memo } from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { LucidePlayCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionOptions } from "@/automation-ui/lib/constants/node";
import { Tooltip } from "@/components/common/tooltip";
import { ActionNodeUpdateTaskAction } from "../common/action-node-update-task-action";
import { useFlowStore } from "@/automation-ui/store/flow";

import { ActionNodeData, ActionPayloadMap, ActionType } from "@tdata/shared/types";

type ActionNodeReducerAction<T extends ActionType = ActionType> =
  | { type: "SET_LABEL"; payload: { label: string } }
  | { type: "SET_ACTION"; payload: { action: ActionType } }
  | { type: "ADD_TO_PAYLOAD"; payload: { key: string | keyof ActionPayloadMap[T]; value: ActionPayloadMap[T][keyof ActionPayloadMap[T]] } }
  | { type: "REMOVE_FROM_PAYLOAD"; payload: { key: string | keyof ActionPayloadMap[T] } };

function actionNodeReducer<T extends ActionType>(state: ActionNodeData<T>, action: ActionNodeReducerAction<T>): ActionNodeData<T> {
  switch (action.type) {
    case "SET_LABEL":
      return { ...state, label: action.payload.label };

    case "SET_ACTION":
      return {
        ...state,
        action: action.payload.action,
      } as ActionNodeData<T>;

    case "ADD_TO_PAYLOAD":
      return {
        ...state,
        payload: { ...state.payload, [action.payload.key]: action.payload.value },
      };
    case "REMOVE_FROM_PAYLOAD":
      const { [action.payload.key]: _, ...newPayload } = state.payload;
      return {
        ...state,
        payload: newPayload,
      } as ActionNodeData<T>;

    default:
      return state;
  }
}

type ActionNodeProps<T extends ActionType = ActionType> = NodeProps<Node<ActionNodeData<T>, "ActionNode">>;

export const ActionNode: FC<ActionNodeProps<ActionType>> = memo(function ActionNode({ id, data, selected }) {
  const { updateNodeData } = useFlowStore();
  const [nodeData, dispatchNodeDataAction] = useReducer(actionNodeReducer, data);

  useEffect(() => {
    updateNodeData(id, nodeData);
  }, [nodeData, updateNodeData, id]);

  // Handle action type change
  const handleActionTypeChange = (type: ActionType) => {
    dispatchNodeDataAction({ type: "SET_ACTION", payload: { action: type } });
  };

  const handleAddToPayload = (key: string | keyof ActionPayloadMap[ActionType], value: ActionPayloadMap[ActionType][keyof ActionPayloadMap[ActionType]]) => {
    dispatchNodeDataAction({ type: "ADD_TO_PAYLOAD", payload: { key, value } });
  };

  const onRemovePayloadItem = (key: string | keyof ActionPayloadMap[ActionType]) => {
    dispatchNodeDataAction({ type: "REMOVE_FROM_PAYLOAD", payload: { key } });
  };

  return (
    <div className={`rounded-sm bg-background shadow-sm border ${selected ? "border-[#0091FF]" : ""} w-[280px]`}>
      <div className="border-b px-4 h-12 flex items-center gap-1">
        <div className="flex-1  flex items-center gap-2">
          <LucidePlayCircle className="w-6 h-6 text-[#0091FF]" />
          <Select onValueChange={(value) => handleActionTypeChange(value as ActionType)}>
            <SelectTrigger className="h-fit border-none hover:bg-accent">
              <SelectValue placeholder="Select Action" />
            </SelectTrigger>
            <SelectContent>
              {ActionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tooltip content="This node starts your workflow when the specified task event occurs" />
      </div>

      <div className="px-4 py-3 space-y-3">
        {nodeData.action && <ActionForm action={nodeData.action} data={nodeData} onChange={handleAddToPayload} onRemove={onRemovePayloadItem} />}
        {!nodeData.action && <p className="text-muted-foreground text-sm">Select an action</p>}
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#0091FF] border-2 border-white" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#0091FF] border-2 border-white" />
    </div>
  );
});

const ActionForm: FC<{
  action: ActionType;
  data: ActionNodeData;
  onChange: (key: string | keyof ActionPayloadMap[ActionType], value: ActionPayloadMap[ActionType][keyof ActionPayloadMap[ActionType]]) => void;
  onRemove: (key: string | keyof ActionPayloadMap[ActionType]) => void;
}> = ({ action, data, onChange, onRemove }) => {
  switch (action) {
    case "Update_Task":
      return <ActionNodeUpdateTaskAction data={data as ActionNodeData<"Update_Task">} onChange={onChange} onRemove={onRemove} />;
    case "Add_Comment":
      return <div>Add Comment Form (Coming Soon)</div>;
    default:
      return <div>No form available for this action</div>;
  }
};
