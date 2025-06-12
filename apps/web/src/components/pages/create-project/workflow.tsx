import { IconComponent } from "@/components/icons";
import { IconSelect } from "@/components/selects/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizations, useUser } from "@/hooks";
import { useOrganizationStatuses } from "@/hooks/data/organization-statuses";
import { createStatus } from "@/lib/actions/organization";
import { WorkflowStatus } from "@tdata/shared/types";
import { IconType } from "@types";
import { LoaderCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";

type EditWorkflowProps = {
  workflows: WorkflowStatus[];
  setWorkflow: (status: WorkflowStatus[]) => void;
};

export const EditWorkflow: FC<EditWorkflowProps> = ({ workflows, setWorkflow }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addStatus = (status: WorkflowStatus) => {
    setWorkflow([...workflows, status]);
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
        <CreateWorkflowPopover open={popoverOpen} onOpenChange={setPopoverOpen} onCreate={addStatus} />
      </div>
      <div className="flex flex-wrap gap-2">
        {workflows.map((status, index) => (
          <Badge key={index} variant="outline" className="p-2 flex gap-1.5">
            <IconComponent name={status.icon as IconType} />
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
  onCreate: (status: WorkflowStatus) => void;
};
const CreateWorkflowPopover: FC<CreateWorkflowPopoverProps> = ({ open, onOpenChange, onCreate }) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="h-3 w-3 mr-1" />
          Add Workflow
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Tabs defaultValue="existing">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <ExistingStatusSelect onSelect={onCreate} />
          </TabsContent>
          <TabsContent value="new">
            <CreateNewStatus onCreate={onCreate} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

type ExistingStatusSelectProps = {
  onSelect: (status: WorkflowStatus) => void;
};

const ExistingStatusSelect: FC<ExistingStatusSelectProps> = ({ onSelect }) => {
  const { data, isLoading } = useOrganizationStatuses();

  const [selectedWorkflowStatus, setSelectedWorkflowStatus] = useState<WorkflowStatus | null>(null);

  const handleValueChange = (value: string) => {
    if (!data) return;
    const status = data.find((status) => status.id === Number(value));
    setSelectedWorkflowStatus(status || null);
  };

  const handleSelect = () => {
    if (selectedWorkflowStatus) {
      onSelect(selectedWorkflowStatus);
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
          {selectedWorkflowStatus && (
            <div className="flex items-center gap-2">
              <IconComponent name={selectedWorkflowStatus.icon as IconType} />
              <span>{selectedWorkflowStatus.name}</span>
            </div>
          )}
          {!selectedWorkflowStatus && <span>Select Status</span>}
          <SelectContent>
            {data?.map((status) => (
              <SelectItem key={status.id} value={String(status.id)}>
                <div className="flex items-center gap-2">
                  <IconComponent name={status.icon as IconType} />
                  <span>{status.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </SelectTrigger>
      </Select>
      <Button variant="outline" onClick={handleSelect}>
        Use Selected Status
      </Button>
    </div>
  );
};

type CreateNewStatusProps = {
  onCreate: (status: WorkflowStatus) => void;
};

const CreateNewStatus: FC<CreateNewStatusProps> = ({ onCreate }) => {
  const [newStatus, setNewStatus] = useState({ name: "", icon: "" as IconType });
  const [loading, setLoading] = useState(false);
  const setName = (name: string) => setNewStatus({ ...newStatus, name });
  const setIcon = (icon: IconType) => setNewStatus({ ...newStatus, icon });
  const { organization } = useOrganizations();
  const { user } = useUser();

  const handleCreate = async () => {
    try {
      if (!newStatus.name || !newStatus.icon) return;
      setLoading(true);
      const createdStatus = await createStatus({ ...newStatus, organizationId: organization.id, createdBy: user.id });
      onCreate(createdStatus);
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
          <Input id="name" value={newStatus.name} onChange={(e) => setName(e.target.value)} className="col-span-2 h-8" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label>Icon</Label>
          <div className="col-span-2">
            <IconSelect icon={newStatus.icon} onSelect={setIcon} />
          </div>
        </div>
      </div>
      <Button size="sm" onClick={handleCreate} disabled={loading}>
        Add Task Type
      </Button>
    </div>
  );
};
