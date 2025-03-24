import { Card } from "@/components/ui/card";
import { StatusSelect } from "@components/selects/status";
import { PrioritySelect } from "@components/selects/priority";
// import { DatePicker } from './date-picker'
import { AssigneeSelect } from "@components/selects/assignee";
import type { TaskDetail } from "@tdata/shared/types";
import Link from "next/link";
import { AssigneeFieldName, Paths } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useOrganizations } from "@/hooks";
import { useMemo } from "react";

interface TaskCardProps {
  task: TaskDetail;
  disabled?: boolean;
  onUpdate: (updatedTask: TaskDetail) => void;
}

export function TaskCard({ task, disabled = false }: TaskCardProps) {
  const { organization } = useOrganizations();
  const initialTaskStatus = useMemo(() => task.projectTemplate.statuses.find((s) => s.id === task.statusId), [task]);
  const initialTaskPriority = useMemo(() => task.projectTemplate.priorities.find((p) => p.id === task.priorityId), [task]);
  return (
    <Card
      className={cn("p-4 cursor-pointer transition-colors border shadow-sm", {
        "bg_muted cursor-not-allowed pointer-events-none": disabled,
        "hover:bg-accent/50": !disabled,
      })}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-mono">{task.taskNumber}</span>
        <AssigneeSelect size="icon" assignee={task.userRelations[AssigneeFieldName]} />
      </div>
      <Link href={Paths.task(organization.key, task.taskNumber)} className="block">
        <h3 className="text-sm font-medium leading-none mb-3 hover:underline">{task.title}</h3>
      </Link>
      <div className="flex items-center gap-2">
        <StatusSelect size="icon" projectId={task.projectId} status={initialTaskStatus} />
        <PrioritySelect size="icon" projectId={task.projectId} priority={initialTaskPriority} />
      </div>
    </Card>
  );
}
