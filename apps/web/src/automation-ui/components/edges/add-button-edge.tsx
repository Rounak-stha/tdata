import React from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";
import { Popover, PopoverTrigger, PopoverContent } from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { CheckSquare, GitBranch, Plus } from "lucide-react";
import { useFlowStore } from "@/automation-ui/store/flow";

export default function AddButtonEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: EdgeProps) {
  const { onAddNode } = useFlowStore();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {/* Add button at the bottom */}
          <div className="h-10 w-px bg-gray-300"></div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full mt-1 border-green-200 bg-white shadow-sm hover:bg-green-50">
                <Plus className="h-4 w-4 text-green-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2 shadow-lg border-gray-100">
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => onAddNode("ActionNode", id)}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Add Action Node
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-yellow-600 hover:bg-yellow-50" onClick={() => onAddNode("ConditionNode", id)}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Add Condition Node
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
