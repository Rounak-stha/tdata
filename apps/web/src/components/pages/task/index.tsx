import { FC } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TaskContent, TaskTitle } from "./TaskInputs";
import { TaskActions } from "./actions";
import { TaskActivities } from "./activities";
import { PropertiesPanel } from "./properties-panel";

import { TaskDetail } from "@tdata/shared/types";

type TaskPageProps = {
  task: TaskDetail;
};
export const TaskPage: FC<TaskPageProps> = ({ task }) => {
  return (
    <div className="min-h-screen px-6 py-4">
      <div className="text-sm text-muted-foreground mb-4">{task.taskNumber}</div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_200px] lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          <TaskTitle taskId={task.id} title={task.title} />

          <TaskContent taskId={task.id} content={task.content || ""} />

          <TaskActions />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Activity</h2>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <RotateCcwIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  Filters
                </Button>
              </div>
            </div>

            <TaskActivities taskId={task.id} />
          </div>
        </div>

        {/* Properties Sidebar */}
        <div className="lg:mr-24">
          <PropertiesPanel task={task} />
        </div>
      </div>
    </div>
  );
};
