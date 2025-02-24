"use client";

import { FC } from "react";
import Link from "next/link";

import { PrioritySelect, StatusSelect } from "@/components/selects";
import { TaskMinimalGroupedByStatus } from "@tdata/shared/types";
import { Heading4, TextSmall } from "@/components/typography";
import { Paths } from "@/lib/constants";
import { useOrganizations } from "@/hooks";

type MyTaskPageProps = {
  tasks: TaskMinimalGroupedByStatus[];
};

export const MyTaskPage: FC<MyTaskPageProps> = ({ tasks }) => {
  const { organization } = useOrganizations();
  return (
    <div className=" px-6 py-4">
      <Heading4 text="My Tasks" />
      <div className="flex flex-col gap-2 mt-4">
        {tasks.map((t) => (
          <div key={t.group.id}>
            <TextSmall className="font-bold text-muted-foreground" text={t.group.name} />
            {t.tasks.map((task) => (
              <div key={task.id} className="group flex items-center gap-4 hover:bg-accent rounded-sm">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono">TT-1</span>
                    <Link href={Paths.task(organization.key, task.taskNumber)} className="text-sm hover:underline truncate">
                      {task.title}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusSelect displayOnly size="icon" status={task.status} allStatus={[task.status]} />
                  <PrioritySelect displayOnly size="icon" priority={task.priority} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
