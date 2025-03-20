import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { FC, useState } from "react";
import { IconSelect } from "@/components/selects/Icon";
import { IconType, ProjectTemplateTaskType } from "@types";
import { Badge } from "@/components/ui/badge";
import { IconComponent } from "@/components/icons";
import { TaskType } from "@tdata/shared/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizationTaskTypes } from "@/hooks/data/organization-task-types";
import { useOrganizations, useUser } from "@/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { createTaskType } from "@/lib/actions/organization";
import { toast } from "sonner";

type TaskTypesProps = {
  types: TaskType[];
  setTaskTypes: (taskTypes: TaskType[]) => void;
};

export const EditTaskTypes: FC<TaskTypesProps> = ({ types, setTaskTypes }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addTaskTypes = (newTaskType: TaskType) => {
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
            <IconComponent name={type.icon as IconType} />
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
  onCreate: (taskType: TaskType) => void;
};

const CreateTaskTypePopover: FC<CreateTaskTypePopoverProps> = ({ open, onOpenChange, onCreate }) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="h-3 w-3 mr-1" />
          Add Task Type
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Tabs defaultValue="existing">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <ExistingTaskTypeSelect onSelect={onCreate} />
          </TabsContent>
          <TabsContent value="new">
            <CreatenNewTaskType onCreate={onCreate} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

type ExistingTaskTypeSelectProps = {
  onSelect: (taskType: TaskType) => void;
};

export const ExistingTaskTypeSelect: FC<ExistingTaskTypeSelectProps> = ({ onSelect }) => {
  const { organization } = useOrganizations();
  const { data, isLoading } = useOrganizationTaskTypes(organization.id);

  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null);

  const handleValueChange = (value: string) => {
    if (!data) return;
    const taskType = data.find((taskType) => taskType.id === Number(value));
    setSelectedTaskType(taskType || null);
  };

  const handleSelect = () => {
    if (selectedTaskType) {
      onSelect(selectedTaskType);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <LoaderCircleIcon className="animate-spin h-4 w-4" />
      </div>
    );

  return (
    <div className="flex flex-col gap-1">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger>
          {selectedTaskType && (
            <div className="flex items-center gap-2">
              <IconComponent name={selectedTaskType.icon as IconType} />
              <span>{selectedTaskType.name}</span>
            </div>
          )}
          {!selectedTaskType && <span>Select Task Type</span>}
          <SelectContent>
            {data?.map((taskType) => (
              <SelectItem key={taskType.id} value={String(taskType.id)}>
                <div className="flex items-center gap-2">
                  <IconComponent name={taskType.icon as IconType} />
                  <span>{taskType.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </SelectTrigger>
      </Select>
      <Button variant="outline" onClick={handleSelect}>
        Use Selected Task Type
      </Button>
    </div>
  );
};

type CreatenNewTaskTypeProps = {
  onCreate: (taskType: TaskType) => void;
};

export const CreatenNewTaskType: FC<CreatenNewTaskTypeProps> = ({ onCreate }) => {
  const [newTaskType, setNewTaskType] = useState<ProjectTemplateTaskType>({ name: "", icon: "" as IconType });
  const [loading, setLoading] = useState(false);
  const setName = (name: string) => setNewTaskType({ ...newTaskType, name });
  const setIcon = (icon: IconType) => setNewTaskType({ ...newTaskType, icon });
  const { organization } = useOrganizations();
  const { user } = useUser();

  const handleCreate = async () => {
    try {
      if (!newTaskType.name || !newTaskType.icon) return;
      setLoading(true);
      const createdTaskType = await createTaskType({ ...newTaskType, organizationId: organization.id, createdBy: user.id });
      onCreate(createdTaskType);
    } catch (e) {
      console.error(e);
      toast.error("Failed to create task type");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <Button size="sm" onClick={handleCreate} disabled={loading}>
        Add Task Type
      </Button>
    </div>
  );
};
