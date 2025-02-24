import { FC, useState } from "react";

import { PlusIcon, XIcon } from "lucide-react";

import { IconComponent } from "@/components/icons";
import { IconSelect } from "@/components/selects/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { IconType, ProjectTemplatePriority } from "@types";

type EditPriorityProps = {
  prioritys: ProjectTemplatePriority[];
  setPriority: (taskTypes: ProjectTemplatePriority[]) => void;
};

export const EditPriority: FC<EditPriorityProps> = ({ prioritys, setPriority }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addPriority = (newPriority: ProjectTemplatePriority) => {
    setPriority([...prioritys, newPriority]);
    setPopoverOpen(false);
  };

  const removePriority = (index: number) => {
    const newPrioritys = [...prioritys];
    newPrioritys.splice(index, 1);
    setPriority(newPrioritys);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Priority</h3>
        <CreatePriorityPopover open={popoverOpen} onOpenChange={setPopoverOpen} onCreate={addPriority} />
      </div>
      <div className="flex flex-wrap gap-2">
        {prioritys.map((ppriority, index) => (
          <Badge key={index} variant="outline" className="p-2 flex gap-1.5">
            <IconComponent name={ppriority.icon} />
            {ppriority.name}
            <XIcon className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removePriority(index)} />
          </Badge>
        ))}
      </div>
    </div>
  );
};

type CreatePriorityPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (taskType: ProjectTemplatePriority) => void;
};
const CreatePriorityPopover: FC<CreatePriorityPopoverProps> = ({ open, onOpenChange, onCreate }) => {
  const [newPriority, setNewPriority] = useState<ProjectTemplatePriority>({ name: "", icon: "" as IconType });
  const setName = (name: string) => setNewPriority({ ...newPriority, name });
  const setIcon = (icon: IconType) => setNewPriority({ ...newPriority, icon });

  const handleCreate = () => {
    if (!newPriority.name || !newPriority.icon) return;
    onCreate(newPriority);
  };
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="h-3 w-3 mr-1" />
          Add Priority
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
              <Input id="name" value={newPriority.name} onChange={(e) => setName(e.target.value)} className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Icon</Label>
              <div className="col-span-2">
                <IconSelect icon={newPriority.icon} onSelect={setIcon} />
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
