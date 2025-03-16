import { FC } from "react";
import { getProjectBoardData } from "@/lib/server/project";
import { KanbanBoard } from "@/components/kanban-board";
import { Project } from "@tdata/shared/types";

type ProjectBoardProps = {
  project: Project;
};

export const ProjectBoard: FC<ProjectBoardProps> = async ({ project }) => {
  const taskGroupedByStatus = await getProjectBoardData(project.id);

  return (
    <div className="px-6">
      <KanbanBoard project={project} tasks={taskGroupedByStatus} />
    </div>
  );
};
