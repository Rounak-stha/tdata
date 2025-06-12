import { FC, useState } from "react";

import { LoaderCircleIcon, PlusIcon, XIcon } from "lucide-react";

import { IconComponent } from "@/components/icons";
import { IconSelect } from "@/components/selects/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { IconType } from "@types";
import { Priority } from "@tdata/shared/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizations, useUser } from "@/hooks";
import { useOrganizationPriorities } from "@/hooks/data/organization-priorities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPriority } from "@/lib/actions/organization";
import { toast } from "sonner";

type EditPriorityProps = {
  prioritys: Priority[];
  setPriority: (priorities: Priority[]) => void;
};

export const EditPriority: FC<EditPriorityProps> = ({ prioritys, setPriority }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const addPriority = (newPriority: Priority) => {
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
            <IconComponent name={ppriority.icon as IconType} />
            {ppriority.name}
            <XIcon className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removePriority(index)} />
          </Badge>
        ))}
      </div>
    </div>
  );
};

type CreatePriorityProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (priority: Priority) => void;
};
const CreatePriorityPopover: FC<CreatePriorityProps> = ({ open, onOpenChange, onCreate }) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon className="h-3 w-3 mr-1" />
          Add Priority
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Tabs defaultValue="existing">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
          </TabsList>
          <TabsContent value="existing">
            <ExistingPrioritySelect onSelect={onCreate} />
          </TabsContent>
          <TabsContent value="new">
            <CreateNewPriority onCreate={onCreate} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

type ExistingPrioritySelectProps = {
  onSelect: (priority: Priority) => void;
};

const ExistingPrioritySelect: FC<ExistingPrioritySelectProps> = ({ onSelect }) => {
  const { organization } = useOrganizations();
  const { data, isLoading } = useOrganizationPriorities();

  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);

  const handleValueChange = (value: string) => {
    if (!data) return;
    const taskType = data.find((taskType) => taskType.id === Number(value));
    setSelectedPriority(taskType || null);
  };

  const handleSelect = () => {
    if (selectedPriority) {
      onSelect(selectedPriority);
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
          {selectedPriority && (
            <div className="flex items-center gap-2">
              <IconComponent name={selectedPriority.icon as IconType} />
              <span>{selectedPriority.name}</span>
            </div>
          )}
          {!selectedPriority && <span>Select Priority</span>}
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
        Use Selected Priority
      </Button>
    </div>
  );
};

type CreateNewPriorityProps = {
  onCreate: (priority: Priority) => void;
};

const CreateNewPriority: FC<CreateNewPriorityProps> = ({ onCreate }) => {
  const [newPriority, setNewPriority] = useState({ name: "", icon: "" as IconType });
  const [loading, setLoading] = useState(false);

  const { organization } = useOrganizations();
  const { user } = useUser();

  const setName = (name: string) => setNewPriority({ ...newPriority, name });
  const setIcon = (icon: IconType) => setNewPriority({ ...newPriority, icon });

  const handleCreate = async () => {
    try {
      if (!newPriority.name || !newPriority.icon) return;
      setLoading(true);
      const createdTaskType = await createPriority({ ...newPriority, organizationId: organization.id, createdBy: user.id });
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
        <h4 className="font-medium leading-none">New Priority</h4>
        <p className="text-sm text-muted-foreground">Add a new priority to your project.</p>
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
      <Button size="sm" onClick={handleCreate} disabled={loading}>
        Add Priority
      </Button>
    </div>
  );
};
