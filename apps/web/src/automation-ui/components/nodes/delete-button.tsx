import { Trash2 } from "lucide-react";

import { useFlowStore } from "@/automation-ui/store/flow";
import { Button } from "@components/ui/button";
import { FC, MouseEventHandler } from "react";

type NodeDeleteButtonProps = {
  nodeId: string;
  onMouseEnter: MouseEventHandler<HTMLButtonElement>;
  onMouseLeave: MouseEventHandler<HTMLButtonElement>;
};

export const NodeDeleteButton: FC<NodeDeleteButtonProps> = ({ nodeId, onMouseEnter, onMouseLeave }) => {
  const { onDeleteNode } = useFlowStore();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 absolute -top-3 -right-3 bg-background border border-destructive rounded-full text-destructive hover:bg-destructive hover:text-white hover:border-destructive"
      onClick={() => onDeleteNode(nodeId)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
};
