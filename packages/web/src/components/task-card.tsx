import { Card } from "@/components/ui/card";
import { StatusSelect } from "@components/selects/status";
import { PrioritySelect } from "@components/selects/priority";
// import { DatePicker } from './date-picker'
import { AssigneeSelect } from "@components/selects/assignee";
import type { TaskDetail } from "@type/task";
import Link from "next/link";
import { AssigneeFieldName } from "@/lib/constants";

interface TaskCardProps {
  task: TaskDetail;
  onUpdate: (updatedTask: TaskDetail) => void;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="p-4 cursor-pointer bg-background hover:bg-accent/50 transition-colors border shadow-sm rounded-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground font-mono">{task.taskNumber}</span>
        <AssigneeSelect size="icon" assignee={task.userRelations[AssigneeFieldName]} />
      </div>
      <Link href={`/task/${task.id}`} className="block">
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
