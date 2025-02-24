import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { Priority } from "@tdata/shared/types";

interface FiltersProps {
  selectedPriorities: Priority[];
  selectedStatuses: string[];
  onPriorityChange: (priorities: Priority[]) => void;
  onStatusChange: (statuses: string[]) => void;
}

const orgStatuses = [
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

export function Filters({ selectedPriorities, selectedStatuses, onPriorityChange, onStatusChange }: FiltersProps) {
  const [open, setOpen] = useState(false);

  const priorities: { label: string; value: Priority }[] = [
    { label: "High", value: "HIGH" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Low", value: "LOW" },
  ];

  const statuses: { label: string; value: string }[] = useMemo(() => orgStatuses.map((s) => ({ label: s.name, value: s.name })), [orgStatuses]);

  const togglePriority = (priority: Priority) => {
    if (selectedPriorities.includes(priority)) {
      onPriorityChange(selectedPriorities.filter((p) => p !== priority));
    } else {
      onPriorityChange([...selectedPriorities, priority]);
    }
  };

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Filters</h4>
          <div className="space-y-2">
            <h5 className="text-sm font-medium leading-none">Priority</h5>
            <div className="space-y-2">
              {priorities.map(({ label, value }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox id={`priority-${value}`} checked={selectedPriorities.includes(value)} onCheckedChange={() => togglePriority(value)} />
                  <label htmlFor={`priority-${value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="text-sm font-medium leading-none">Status</h5>
            <div className="space-y-2">
              {statuses.map(({ label, value }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox id={`status-${value}`} checked={selectedStatuses.includes(value)} onCheckedChange={() => toggleStatus(value)} />
                  <label htmlFor={`status-${value}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
