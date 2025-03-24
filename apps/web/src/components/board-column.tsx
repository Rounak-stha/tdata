import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import { useState } from "react";
import { NewTaskPopup } from "./new-task-popup";
import { Project, TaskDetail, TaskDetailOptimistic, WorkflowStatus } from "@tdata/shared/types";

interface BoardColumnProps {
  status: WorkflowStatus;
  project: Project;
  tasks: TaskDetailOptimistic[];
  onTaskUpdate: (updatedTask: TaskDetail) => void;
}

export function BoardColumn({ status, project, tasks: initialTasks, onTaskUpdate }: BoardColumnProps) {
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);

  // we do not need optimistic create here but for future use the implemenattion functionality is left here as is
  const handleOptimisticCreate = (task: TaskDetailOptimistic) => {
    setTasks((prev) => [{ ...task, disabled: true }, ...prev]);
  };

  const handleCreate = (task: TaskDetailOptimistic) => {
    setTasks((prev) => {
      const tasks = [...prev];
      const tempId = task.tempId;
      const tempTaskIndex = tempId ? tasks.findIndex((t) => t.id == tempId) : undefined;

      if (tempTaskIndex != undefined) {
        tasks[tempTaskIndex] = task;
        return tasks;
      }

      return [task, ...prev];
    });
    setNewTaskDialogOpen(false);
  };

  const handleError = (tempId: number) => {
    setTasks((prev) => prev.filter((t) => t.id != tempId));
  };

  return (
    <div className="w-80 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium">{status.name}</h2>
        <Button onClick={() => setNewTaskDialogOpen(true)} variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onUpdate={onTaskUpdate} disabled={task.id == 0} />
        ))}
      </div>
      {newTaskDialogOpen && (
        <NewTaskPopup
          status={status}
          open={newTaskDialogOpen}
          onOpenChange={setNewTaskDialogOpen}
          onOptimisticAdd={handleOptimisticCreate}
          onCreate={handleCreate}
          onError={handleError}
          project={project}
        />
      )}
    </div>
  );
}
