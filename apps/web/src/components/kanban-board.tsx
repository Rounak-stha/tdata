"use client";

import { FC } from "react";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { BoardColumn } from "@components/board-column";
import type { Project, TaskGroupedByStatus } from "@tdata/shared/types";

type KanbanBoardProps = {
  project: Project;
  tasks: TaskGroupedByStatus[];
};

export const KanbanBoard: FC<KanbanBoardProps> = ({ project, tasks }) => {
  return (
    <div className="flex space-y-8">
      {/* https://stackoverflow.com/questions/78341914/how-can-i-make-the-shadcn-ui-scrollarea-take-full-width-and-add-a-scroll-when-th */}
      <ScrollArea className="pb-6 w-1 flex-1">
        <div className="flex gap-4">
          {tasks.map((t) => {
            return <BoardColumn key={t.group.id} project={project} status={t.group} tasks={t.tasks} onTaskUpdate={() => {}} />;
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
