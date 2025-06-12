"use client";

import { FC } from "react";
import Link from "next/link";

import { TaskDetailMinimal, TaskMinimalGroupedByStatus } from "@tdata/shared/types";
import { TextSmall } from "@/components/typography";
import { Paths } from "@/lib/constants";
import { useOrganizations } from "@/hooks";
import { PrioritySelect, StatusSelect } from "@/components/selects";
import { NoTaskAssigedInfo } from "./no-task-assigned";

type MyTaskPageProps = {
  tasks: TaskMinimalGroupedByStatus[];
};

export const MyTaskPage: FC<MyTaskPageProps> = ({ tasks }) => {
  return <div className=" px-6 py-4">{tasks.length > 0 ? <TaskList tasks={tasks} /> : <NoTaskAssigedInfo />}</div>;
};

export const TaskList: FC<{ tasks: TaskMinimalGroupedByStatus[] }> = ({ tasks }) => {
  const { organization } = useOrganizations();
  return (
    <div className="flex flex-col gap-2 mt-4">
      {tasks.map((t) => (
        <div key={t.group.id}>
          <TextSmall className="font-bold text-muted-foreground" text={t.group.name} />
          {t.tasks.map((task) => (
            <TaskLine key={task.id} task={task} orgKey={organization.key} />
          ))}
        </div>
      ))}
    </div>
  );
};

type TaskLineProps = {
  orgKey: string;
  task: TaskDetailMinimal;
};

const TaskLine: FC<TaskLineProps> = ({ task, orgKey }) => {
  return (
    <div
      //href={`/lndev-ui/issue/${issue.identifier}`}
      className="w-full flex items-center gap-2 justify-start h-11 rounded-sm hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        <PrioritySelect size="icon" priority={task.priority} projectId={task.projectId} />
        <span className="text-sm hidden sm:inline-block text-muted-foreground font-medium w-[50px] truncate shrink-0">{task.taskNumber}</span>
        <StatusSelect size="icon" status={task.status} projectId={task.projectId} />
      </div>
      <span className="min-w-0 flex items-center justify-start mr-1 ml-0.5">
        <Link href={Paths.task(task.taskNumber)} className="text-xs sm:text-sm font-medium sm:font-semibold truncate hover:underline">
          {task.title}
        </Link>
      </span>
    </div>
  );
};
