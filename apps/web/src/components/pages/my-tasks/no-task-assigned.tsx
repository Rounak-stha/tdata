"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ClipboardList, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NewTaskPopup } from "@/components/new-task-popup";
import { useOrganizations, useUser } from "@/hooks";
import { TaskDetail } from "@tdata/shared/types";
import { Paths } from "@/lib/constants";

export const NoTaskAssigedInfo = () => {
  const [newTaskPopupOpen, setNewTaskPopupOpen] = useState(false);
  const { organization } = useOrganizations();
  const { user } = useUser();
  const router = useRouter();

  const handleTaskCreate = (task: TaskDetail) => {
    router.push(Paths.task(task.taskNumber));
    setNewTaskPopupOpen(false);
  };
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] p-6 text-center">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <ClipboardList className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No tasks assigned</h3>
      <p className="text-muted-foreground mb-6 max-w-md">You don&apos;t have any tasks assigned to you right now. Create a new task or ask your team to assign you some tasks.</p>
      <Button className="flex items-center" onClick={() => setNewTaskPopupOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create New Task
      </Button>
      <NewTaskPopup open={newTaskPopupOpen} onOpenChange={setNewTaskPopupOpen} assignee={[user]} onCreate={handleTaskCreate} />
    </div>
  );
};
