import { CheckIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FC, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { TaskType } from "@tdata/shared/types";
import { useProjectTemplate } from "@/hooks/data";
import { IconColorMap, IconMap } from "@/lib/constants/icon";
import { IconType } from "@/types";

interface TaskTypeSelectProps {
  projectId: number;
  onSelect: (taskType: TaskType) => void;
}

export const TaskTypeSelect: FC<TaskTypeSelectProps> = ({ projectId, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | undefined>(undefined);
  const { data: projectTemplate, isLoading: isLoadingProjectTemplate } = useProjectTemplate(projectId);

  useEffect(() => {
    if (!projectTemplate || selectedTaskType) return;
    setSelectedTaskType(projectTemplate.taskTypes[0]);
    onSelect(projectTemplate.taskTypes[0]);
  }, [projectTemplate, selectedTaskType, onSelect]);

  const handleSelect = (id: number) => {
    if (!projectTemplate) return;
    const taskType = projectTemplate.taskTypes.find((tt) => tt.id === id);
    setSelectedTaskType(taskType!);
    setOpen(false);
    if (onSelect) onSelect(taskType!);
  };

  if (isLoadingProjectTemplate || !projectTemplate || !selectedTaskType) {
    return <TaskTypeSelectLoading />;
  }

  const IconComp = IconMap[selectedTaskType.icon as IconType];

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild disabled={isLoadingProjectTemplate}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-fit p-0 px-2 flex items-center justify-center bg-inherit">
                {selectedTaskType ? (
                  <span className="flex items-center space-x-2 px-1">
                    <IconComp className={`h-4 w-4 ${IconColorMap[selectedTaskType!.icon as IconType]}`} />
                    <span className="text-sm">{selectedTaskType!.name}</span>
                  </span>
                ) : (
                  <span className="ml-0.5">Select Project</span>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{selectedTaskType ? selectedTaskType.name : "Select Task Type"}</TooltipContent>
          <PopoverContent align="start" className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search assignee..." />
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {projectTemplate.taskTypes.map((taskType) => {
                    const IconComp = IconMap[taskType.icon as IconType];
                    return (
                      <CommandItem key={taskType.id} onSelect={() => handleSelect(taskType.id)} value={taskType.name}>
                        <IconComp className={`h-4 w-4 ${IconColorMap[taskType.icon as IconType]}`} />
                        <span className="text-sm">{taskType.name}</span>
                        <CheckIcon className={cn("ml-auto h-4 w-4", selectedTaskType?.id === taskType.id ? "opacity-100" : "opacity-0")} />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

const TaskTypeSelectLoading: FC = () => {
  return (
    <Button disabled className="h-8 w-14 flex justify-center items-center">
      <LoaderCircleIcon className="animate-spin h-4 w-4" />
    </Button>
  );
};

export type TaskTypeBadgeProps = {
  tasktype: TaskType;
  onRemove?: () => void;
};

export const TaskTypeBadge: FC<TaskTypeBadgeProps> = ({ tasktype, onRemove }) => {
  const IcomComp = IconMap[tasktype.icon as IconType];
  return (
    <div className="flex items-center text-sm border rounded-sm py-1 px-1.5">
      <IcomComp className={`mr-2 h-4 w-4 ${IconColorMap[tasktype.icon as IconType]}`} />
      {tasktype.name}

      {onRemove ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
          aria-label={`Remove ${tasktype.name} filter`}
        >
          <XIcon size={14} strokeWidth={2.5} className="hover:scale-110 transition-transform" />
        </button>
      ) : null}
    </div>
  );
};

type TaskTypeSelectListProps = {
  options: TaskType[];
  onSelect: (value: TaskType) => void;
};

export const TaskTypeSelectList: FC<TaskTypeSelectListProps> = ({ options, onSelect }) => {
  return (
    <Command>
      <CommandInput placeholder="Search Status..." />
      <CommandList>
        <CommandEmpty>No values found.</CommandEmpty>
        <CommandGroup>
          {options.map((tasktype) => {
            const IcomComp = IconMap[tasktype.icon as IconType];
            return (
              <CommandItem key={tasktype.id} onSelect={() => onSelect(tasktype)} className="flex items-center justify-between">
                <div className="flex items-center">
                  <IcomComp className={`mr-2 h-4 w-4 ${IconColorMap[tasktype.icon as IconType]}`} />
                  {tasktype.name}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
