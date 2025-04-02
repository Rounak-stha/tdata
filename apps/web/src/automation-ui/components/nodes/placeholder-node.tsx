import { Handle, Position } from "@xyflow/react";
import { CheckSquareIcon, GitBranchIcon, PlusIcon } from "lucide-react";

import { Button } from "@components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@components/ui/popover";
import { useFlowStore } from "@/automation-ui/store/flow";

import { FC, memo } from "react";

type PlaceholderNodeProps = {
  id: string;
  data: {
    parentId: string;
  };
};

export const PlaceholderNode: FC<PlaceholderNodeProps> = memo(function PlaceholderNode({ id }) {
  const { replaceNode } = useFlowStore();

  return (
    <div className="relative bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[calc(100%+16px)] flex flex-col items-center">
      <Handle type="target" position={Position.Top} className="!bg-green-500 hover:!h-3 hover:!w-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-green-500 hover:!h-3 hover:!w-3" />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full mt-1 border-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-950">
            <PlusIcon className="h-4 w-4 text-green-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2 border">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={() => replaceNode(id, "ActionNode")}
            >
              <CheckSquareIcon className="h-4 w-4 mr-2" />
              Add Action Node
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start hover:text-yellow-600 dark:hover:text-yellow-100 hover:bg-yellow-50 dark:hover:bg-yellow-950"
              onClick={() => replaceNode(id, "ConditionNode")}
            >
              <GitBranchIcon className="h-4 w-4 mr-2" />
              Add Condition Node
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});
