import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconColorMap, IconMap } from "@/lib/constants/icon";
import { WorkflowStatus } from "@tdata/shared/types";
import { LoaderCircleIcon } from "lucide-react";
import { ChangeParams, IconType } from "@types";

/**
 * TODO:
 * Since we want the Status (Workflow) to be fully custimizable, we also want the user to be able to select icons for each status.
 * We want to limit the number of custom WF Status to be 10 to make it manageable
 * Also, we want to provide a default set of icons for the user to choose from
 * Currently, we don;t have the ability to add custom icons
 */
const statusIcons = IconMap;

const statusColors = IconColorMap;

interface StatusSelectProps {
  status?: WorkflowStatus;
  allStatus: WorkflowStatus[];
  onChange?: (change: ChangeParams<WorkflowStatus>) => void;
  size?: "icon" | "default" | "full";
  isLoading?: boolean;
  displayOnly?: boolean;
}

export function StatusSelect({ status: InitialStatus, allStatus, onChange, size = "default", isLoading, displayOnly }: StatusSelectProps) {
  const [status, setStatus] = useState(InitialStatus || allStatus[0]);
  const Icon = statusIcons[status.icon as IconType];

  const handleChange = (statusId: string) => {
    const newStatus = allStatus.find((s) => s.id === Number(statusId))!;
    setStatus(newStatus);
    if (onChange) onChange({ newValue: newStatus, previousValue: status });
  };
  return (
    <Select value={String(status.id)} onValueChange={handleChange}>
      <SelectTrigger
        disabled={isLoading || displayOnly}
        className={cn("p-0 px-2 hover:bg-muted", {
          "h-8 w-8 border-none": size == "default" || size == "icon",
          "h-10 w-full": size == "full",
          "[&>svg]:hidden": isLoading || size == "icon",
          "[&>svg]:mt-0.5": !isLoading || size != "icon",
        })}
      >
        <SelectValue asChild>
          {isLoading ? (
            <span
              className={cn({
                "w-16 !flex justify-center": size != "icon",
              })}
            >
              <LoaderCircleIcon className="animate-spin h-4 w-4" />
            </span>
          ) : (
            <p className={cn("flex items-center space-x-2", { "mr-2": size != "icon" })}>
              <Icon className={`h-4 w-4 ${statusColors[status.icon as IconType]}`} />
              {size != "icon" && <span className="text-sm">{status.name}</span>}
            </p>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {allStatus.map((status) => {
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
