import { FC } from "react";
import { getProjectBoardData } from "@/lib/server/project";
import { KanbanBoard } from "@/components/kanban-board";
import { Project, TaskGroupedByStatus } from "@tdata/shared/types";

type ProjectBoardProps = {
  project: Project;
  tasks: TaskGroupedByStatus[];
};

export const ProjectBoard: FC<ProjectBoardProps> = async ({ project, tasks }) => {
  return (
    <div className="px-6">
      <KanbanBoard project={project} tasks={tasks} />
    </div>
  );
};
