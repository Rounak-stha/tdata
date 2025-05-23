"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IconColorMap, IconMap } from "@/lib/constants/icon";
import { WorkflowStatus } from "@tdata/shared/types";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { ChangeParams, IconType } from "@types";
import { useProjectTemplate } from "@/hooks/data";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

/**
 * TODO:
 * Since we want the Status (Workflow) to be fully custimizable, we also want the user to be able to select icons for each status.
 * We want to limit the number of custom WF Status to be 10 to make it manageable
 * Also, we want to provide a default set of icons for the user to choose from
 * Currently, we don;t have the ability to add custom icons
 */
const statusIcons = IconMap;

const statusColors = IconColorMap;

const getSelectTriggerStyle = (size: Size, isLoading: boolean) => {
  return cn("p-0 px-2 hover:bg-muted", {
    "h-8 w-8 border-none": size == "default" || size == "icon",
    "h-10 w-full": size == "full",
    "[&>svg]:hidden": isLoading || size == "icon",
    "[&>svg]:mt-0.5": !isLoading || size != "icon",
  });
};

type Size = "icon" | "default" | "full";
interface StatusSelectProps {
  status?: WorkflowStatus;
  projectId: number;
  onChange?: (change: ChangeParams<WorkflowStatus>) => void;
  size?: Size;
  isLoading?: boolean;
  displayOnly?: boolean;
}

export function StatusSelect({ status: InitialStatus, projectId, onChange, size = "default", isLoading, displayOnly }: StatusSelectProps) {
  const { data: projectTemplate, isLoading: isLoadingProjectTemplate } = useProjectTemplate(projectId);
  const [status, setStatus] = useState(InitialStatus);

  useEffect(() => {
    if (!projectTemplate || InitialStatus) return;
    setStatus(projectTemplate.statuses[0]);
    if (onChange) onChange({ newValue: projectTemplate.statuses[0], previousValue: projectTemplate.statuses[0] });
  }, [projectTemplate, InitialStatus, onChange]);

  const handleChange = (statusId: string) => {
    if (!projectTemplate || !status) return;
    const newStatus = projectTemplate.statuses.find((s) => s.id === Number(statusId))!;
    setStatus(newStatus);
    if (onChange) onChange({ newValue: newStatus, previousValue: status });
  };

  if (!projectTemplate || isLoading || isLoadingProjectTemplate || !status) return <StatusSelectLoading size={size} />;

  const Icon = statusIcons[status!.icon as IconType];

  return (
    <Select value={String(status!.id)} onValueChange={handleChange}>
      <SelectTrigger disabled={isLoading || displayOnly} className={getSelectTriggerStyle(size, false)}>
        <SelectValue asChild>
          <p className={cn("flex items-center space-x-2", { "mr-2": size != "icon" })}>
            <Icon className={`h-4 w-4 ${statusColors[status!.icon as IconType]}`} />
            {size != "icon" && <span className="text-sm">{status!.name}</span>}
          </p>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {projectTemplate.statuses.map((status) => {
          const IcomComp = statusIcons[status.icon as IconType];
          return (
            <SelectItem key={status.id} value={String(status.id)}>
              <div className="flex items-center">
                <IcomComp className={`mr-2 h-4 w-4 ${statusColors[status.icon as IconType]}`} />
                {status.name}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

type StatusSelectLoadingProps = {
  size: Size;
};

const StatusSelectLoading: FC<StatusSelectLoadingProps> = ({ size }) => {
  return (
    <Select value="Temp">
      <SelectTrigger disabled className={getSelectTriggerStyle(size, true)}>
        <SelectValue asChild>
          <div className="w-full h-full flex items-center justify-center">
            <LoaderCircleIcon className="animate-spin h-4 w-4" />
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Temp">
          <span>Temp</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

type StatusSelectListProps = {
  options: WorkflowStatus[];
  onSelect: (value: WorkflowStatus) => void;
};

export type StatusBadgeProps = {
  status: WorkflowStatus;
  onRemove?: () => void;
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status, onRemove }) => {
  const IcomComp = statusIcons[status.icon as IconType];
  return (
    <div className="flex items-center text-sm border rounded-sm py-1 px-1.5">
      <IcomComp className={`mr-2 h-4 w-4 ${statusColors[status.icon as IconType]}`} />
      {status.name}

      {onRemove ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
          aria-label={`Remove ${status.name} filter`}
        >
          <XIcon size={14} strokeWidth={2.5} className="hover:scale-110 transition-transform" />
        </button>
      ) : null}
    </div>
  );
};

export const StatusSelectList: FC<StatusSelectListProps> = ({ options, onSelect }) => {
  return (
    <Command>
      <CommandInput placeholder="Search Status..." />
      <CommandList>
        <CommandEmpty>No values found.</CommandEmpty>
        <CommandGroup>
          {options.map((status) => {
            const IcomComp = statusIcons[status.icon as IconType];
            return (
              <CommandItem key={status.id} onSelect={() => onSelect(status)} className="flex items-center justify-between">
                <div className="flex items-center">
                  <IcomComp className={`mr-2 h-4 w-4 ${statusColors[status.icon as IconType]}`} />
                  {status.name}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
