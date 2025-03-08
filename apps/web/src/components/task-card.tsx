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

interface TaskCardProps {
  task: TaskDetail;
  disabled?: boolean;
  onUpdate: (updatedTask: TaskDetail) => void;
}

export function TaskCard({ task, disabled = false }: TaskCardProps) {
  const { organization } = useOrganizations();
  return (
    <Card
      className={cn("p-4 cursor-pointer transition-colors border shadow-sm rounded-sm", {
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
        <StatusSelect size="icon" status={task.projectTemplate.workflow.statuses.find((s) => s.id === task.statusId)} allStatus={task.projectTemplate.workflow.statuses} />
        <PrioritySelect size="icon" priority="HIGH" />
        {/* <DatePicker
					date={task.dueDate ? new Date(task.dueDate) : undefined}
					onSelect={handleDateChange}
					className='h-8 text-xs'
				/> */}
      </div>
    </Card>
  );
}
