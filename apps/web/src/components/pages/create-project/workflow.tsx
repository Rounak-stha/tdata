import { IconComponent } from "@/components/icons";
import { IconSelect } from "@/components/selects/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { ProjectTemplateWorkflow, IconType } from "@types";
import { PlusIcon, XIcon } from "lucide-react";
import { FC, useState } from "react";

type EditWorkflowProps = {
  workflows: ProjectTemplateWorkflow[];
  setWorkflow: (taskTypes: ProjectTemplateWorkflow[]) => void;
};

export const EditWorkflow: FC<EditWorkflowProps> = ({ workflows, setWorkflow }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addWorkflow = (newWorkflow: ProjectTemplateWorkflow) => {
    setWorkflow([...workflows, newWorkflow]);
    setPopoverOpen(false);
  };

  const removeWorkflow = (index: number) => {
    const newWorkflows = [...workflows];
    newWorkflows.splice(index, 1);
    setWorkflow(newWorkflows);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Workflow</h3>
        <CreateWorkflowPopover open={popoverOpen} onOpenChange={setPopoverOpen} onCreate={addWorkflow} />
      </div>
      <div className="flex flex-wrap gap-2">
        {workflows.map((status, index) => (
          <Badge key={index} variant="outline" className="p-2 flex gap-1.5">
            <IconComponent name={status.icon} />
            {status.name}
            <XIcon className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeWorkflow(index)} />
          </Badge>
        ))}
      </div>
    </div>
  );
};

type CreateWorkflowPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (taskType: ProjectTemplateWorkflow) => void;
};
const CreateWorkflowPopover: FC<CreateWorkflowPopoverProps> = ({ open, onOpenChange, onCreate }) => {
  const [newWorkflow, setNewWorkflow] = useState<ProjectTemplateWorkflow>({ name: "", icon: "" as IconType });
  const setName = (name: string) => setNewWorkflow({ ...newWorkflow, name });
  const setIcon = (icon: IconType) => setNewWorkflow({ ...newWorkflow, icon });

  const handleCreate = () => {
    if (!newWorkflow.name || !newWorkflow.icon) return;
    onCreate(newWorkflow);
  };
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="h-3 w-3 mr-1" />
          Add Workflow
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
              <Input id="name" value={newWorkflow.name} onChange={(e) => setName(e.target.value)} className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Icon</Label>
              <div className="col-span-2">
                <IconSelect icon={newWorkflow.icon} onSelect={setIcon} />
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
