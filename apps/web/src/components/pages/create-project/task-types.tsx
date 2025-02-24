import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlusIcon, XIcon } from "lucide-react";
import { FC, useState } from "react";
import { IconSelect } from "@/components/selects/Icon";
import { IconType, ProjectTemplateTaskType } from "@types";
import { Badge } from "@/components/ui/badge";
import { IconComponent } from "@/components/icons";

type TaskTypesProps = {
  types: ProjectTemplateTaskType[];
  setTaskTypes: (taskTypes: ProjectTemplateTaskType[]) => void;
};

export const EditTaskTypes: FC<TaskTypesProps> = ({ types, setTaskTypes }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addTaskTypes = (newTaskType: ProjectTemplateTaskType) => {
    setTaskTypes([...types, newTaskType]);
    setPopoverOpen(false);
  };

  const removeTaskType = (index: number) => {
    const newTaskTypes = [...types];
    newTaskTypes.splice(index, 1);
    setTaskTypes(newTaskTypes);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Task Types</h3>
        <CreateTaskTypePopover open={popoverOpen} onOpenChange={setPopoverOpen} onCreate={addTaskTypes} />
      </div>
      <div className="flex flex-wrap gap-2">
        {types.map((type, index) => (
          <Badge key={index} variant="outline" className="p-2 flex gap-1.5">
            <IconComponent name={type.icon} />
            <span>{type.name}</span>
            <XIcon className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeTaskType(index)} />
          </Badge>
        ))}
      </div>
    </div>
  );
};

type CreateTaskTypePopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (taskType: ProjectTemplateTaskType) => void;
};

const CreateTaskTypePopover: FC<CreateTaskTypePopoverProps> = ({ open, onOpenChange, onCreate }) => {
  const [newTaskType, setNewTaskType] = useState<ProjectTemplateTaskType>({ name: "", icon: "" as IconType });
  const setName = (name: string) => setNewTaskType({ ...newTaskType, name });
  const setIcon = (icon: IconType) => setNewTaskType({ ...newTaskType, icon });

  const handleCreate = () => {
    if (!newTaskType.name || !newTaskType.icon) return;
    onCreate(newTaskType);
  };
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="h-3 w-3 mr-1" />
          Add Task Type
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">New Task Type</h4>
            <p className="text-sm text-muted-foreground">Add a new type of task to your project.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={newTaskType.name} onChange={(e) => setName(e.target.value)} className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Icon</Label>
              <div className="col-span-2">
                <IconSelect icon={newTaskType.icon} onSelect={setIcon} />
              </div>
            </div>
          </div>
          <Button size="sm" onClick={handleCreate}>
            Add Task Type
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
