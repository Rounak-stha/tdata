"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";

import { ChevronDownIcon, ChevronRightIcon, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { GroupedTasks, Status } from "@/types/kanban";
import { StatusSelect } from "@/components/selects/status";
import { PrioritySelect } from "@/components/selects/priority";
import { AssigneeSelect } from "@components/selects/assignee";
import { DatePicker } from "@/components/date-picker";
import { TaskDetail } from "@/types/task";

interface ListViewProps {
  groupedTask: GroupedTasks;
  onUpdate: (task: TaskDetail) => void;
}

const statuses = [
  {
    id: 1,
    name: "ToDo",
    icon: "ToDo",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "USER-1",
    organizationId: 1,
    workflowId: 1,
  },
  {
    id: 2,
    name: "InProgress",
    icon: "InProgress",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "USER-1",
    organizationId: 1,
    workflowId: 1,
  },
];

const reducer = (state: GroupedTasks, action: { type: "SET_TASKS"; payload: GroupedTasks } | { type: "TOGGLE_GROUP"; payload: Status }) => {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        ...action.payload,
      };
    case "TOGGLE_GROUP":
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          isExpanded: !state[action.payload].isExpanded,
        },
      };
    default:
      return state;
  }
};

export function ListView({ groupedTask: InitialGroupedTask }: ListViewProps) {
  const [groupedTasks, dispatch] = useReducer(reducer, InitialGroupedTask);

  useEffect(() => {
    dispatch({ type: "SET_TASKS", payload: InitialGroupedTask });
  }, [InitialGroupedTask]);

  const toggleGroup = (status: Status) => {
    dispatch({ type: "TOGGLE_GROUP", payload: status });
  };

  return (
    <div className="space-y-1">
      {Object.entries(groupedTasks).map(
        ([status, group]) =>
          group.tasks.length > 0 && (
            <div key={status} className="space-y-1">
              <button onClick={() => toggleGroup(status as Status)} className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-accent rounded-md text-sm">
                {group.isExpanded ? <ChevronDownIcon className="h-4 w-4 text-muted-foreground" /> : <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />}
                <span className="font-medium">{group.status.name}</span>
                <span className="text-muted-foreground text-xs">{group.tasks.length}</span>
              </button>
              {group.isExpanded && (
                <div className="space-y-1 pl-6">
                  {group.tasks.map((task) => (
                    <div key={task.id} className="group flex items-center gap-4 px-2 py-1.5 hover:bg-accent rounded-md">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
                          <Link href={`/task/${task.id}`} className="text-sm hover:underline truncate">
                            {task.title}
                          </Link>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusSelect size="icon" allStatus={statuses} />
                        <PrioritySelect size="icon" priority={task.priority} />
                        <AssigneeSelect size="icon" />
                        <DatePicker onSelect={() => {}} className="h-8" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link href={`/task/${task.id}`}>View Details</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  <button className="flex items-center gap-2 px-2 py-1.5 w-full hover:bg-accent rounded-md text-sm text-muted-foreground">
                    <Plus className="h-4 w-4" />
                    New Issue
                  </button>
                </div>
              )}
            </div>
          )
      )}
    </div>
  );
}
