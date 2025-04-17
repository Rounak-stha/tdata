import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon } from "lucide-react";
import { TaskMinimalGroupedByStatus } from "@tdata/shared/types";
import { FC, useMemo } from "react";
import { TaskList } from "../pages/my-tasks";

type ChatTaskCardProps = {
  tasks: TaskMinimalGroupedByStatus[];
};

export const ChatTaskAssignedTaskList: FC<ChatTaskCardProps> = ({ tasks }) => {
  const total = useMemo(() => tasks.reduce((acc, group) => acc + group.tasks.length, 0), [tasks]);
  return (
    <Card className="p-4 bg-[#1a1a1a] border-[#2a2a2a] text-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center">
          <CheckCircleIcon className="h-4 w-4 mr-2 text-[#3b82f6]" />
          Your Tasks
        </h3>
        <Badge variant="outline" className="bg-[#2a2a2a] text-white border-[#3b82f6]">
          {total} {total === 1 ? "task" : "tasks"}
        </Badge>
      </div>

      {tasks.length === 0 ? <div className="text-center py-6 text-gray-400 text-sm">No tasks assigned to you right now.</div> : <TaskList tasks={tasks} />}
    </Card>
  );
};
