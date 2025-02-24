import { FC } from "react";
import { getProjectBoardData } from "@/lib/server/project";
import { KanbanBoard } from "@/components/kanban-board";

type ProjectBoardProps = {
  projectId: number;
};

export const ProjectBoard: FC<ProjectBoardProps> = async ({ projectId }) => {
  const taskGroupedByStatus = await getProjectBoardData(projectId);

  return (
    <div className="px-6">
      <KanbanBoard tasks={taskGroupedByStatus} />
    </div>
  );
};
