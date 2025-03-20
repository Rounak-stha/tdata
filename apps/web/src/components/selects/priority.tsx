import { FC, useEffect, useState } from "react";

import { LoaderCircleIcon } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Priority } from "@tdata/shared/types";
import { cn } from "@/lib/utils";
import { ChangeParams, IconType } from "@types";
import { useProjectTemplate } from "@/hooks/data";
import { IconColorMap, IconMap } from "@/lib/constants/icon";

type Size = "icon" | "default" | "full";

const getSelectTriggerStyle = (size: Size, isLoading: boolean) => {
  return cn("p-0 px-2 hover:bg-muted", {
    "h-8 w-8 border-none": size == "default" || size == "icon",
    "h-10 w-full": size == "full",
    "[&>svg]:hidden": isLoading || size == "icon",
    "[&>svg]:mt-0.5": !isLoading || size != "icon",
  });
};

interface PrioritySelectProps {
  priority?: Priority;
  projectId: number;
  onChange?: (change: ChangeParams<Priority>) => void;
  size?: Size;
  isLoading?: boolean;
  displayOnly?: boolean;
}

export function PrioritySelect({ priority: initialPriority, projectId, onChange, size = "default", isLoading, displayOnly }: PrioritySelectProps) {
  const { data: projectTemplate, isLoading: isLoadingProjectTemplate } = useProjectTemplate(projectId);

  const [priority, setPriority] = useState(initialPriority);

  useEffect(() => {
    if (!projectTemplate || initialPriority) return;
    setPriority(projectTemplate.priorities[0]);
  }, [projectTemplate, initialPriority]);

  const handleChange = (priorityId: string) => {
    if (!projectTemplate || !priority) return;
    const nePriority = projectTemplate.priorities.find((p) => p.id === Number(priorityId))!;
    setPriority(nePriority);
    if (onChange) onChange({ newValue: nePriority, previousValue: priority });
  };

  if (!projectTemplate || isLoading || isLoadingProjectTemplate || !priority) return <PriorityPriorityLoading size={size} />;

  const Icon = IconMap[priority!.icon as IconType];

  return (
    <Select value={String(priority!.id)} onValueChange={handleChange}>
      <SelectTrigger
        disabled={displayOnly}
        className={cn("p-0 px-2 hover:bg-muted", {
          "h-8 w-8 border-none": size == "default" || size == "icon",
          "w-full h-10": size == "full",
          "[&>svg]:hidden": isLoading || size == "icon",
          "[&>svg]:mt-0.5": !isLoading || size != "icon",
        })}
      >
        <SelectValue asChild>
          <p className={cn("flex items-center space-x-2", { "mr-2": size != "icon" })}>
            <Icon className={`h-4 w-4 ${IconColorMap[priority!.icon as IconType]}`} />
            {size != "icon" && <span className="text-sm">{priority!.name}</span>}
          </p>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {projectTemplate.priorities.map((priority) => {
          const IcomComp = IconMap[priority.icon as IconType];
          return (
            <SelectItem key={priority.id} value={String(priority.id)}>
              <div className="flex items-center">
                <IcomComp className={`mr-2 h-4 w-4 ${IconColorMap[priority.icon as IconType]}`} />
                {priority.name}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

type PriorityPriorityLoadingProps = {
  size: Size;
};

const PriorityPriorityLoading: FC<PriorityPriorityLoadingProps> = ({ size }) => {
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
