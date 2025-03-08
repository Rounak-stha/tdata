import invariant from "tiny-invariant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useMemo, useState } from "react";
import { IconColorMap, IconMap } from "@/lib/constants/icon";
import { IconType } from "@types";
import { FlowValueComponentBaseProps } from "@/automation-ui/types/components";
import { useFlowStore } from "@/automation-ui/store/flow";
import { extractValueFromFlowValue } from "@/automation-ui/utils/variables";
import { FlowTaskPriority } from "@/automation-ui/types";
import { Label } from "@/components/ui/label";
import { Priorities } from "@tdata/shared/db/schema";

const PriorityIcons: Record<(typeof Priorities)[number], IconType> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

/**
 * The value of the select component is the id of one of the WorkflowStatus.
 */
export const FlowValuePriorityComponent: FC<FlowValueComponentBaseProps> = ({ type, value, onChange, className, label }) => {
  invariant(type == "priority", "StatusSelect can only be used with status fields");
  const { getVariables } = useFlowStore();
  const priorities: FlowTaskPriority[] = useMemo(() => {
    const ws: FlowTaskPriority[] = Priorities.map((p) => ({
      id: p,
      name: p,
      type: "static",
      icon: PriorityIcons[p],
    }));
    const wsVariables: FlowTaskPriority[] = getVariables()
      .filter((v) => v.type == "priority")
      .map((v) => ({
        id: v.id,
        name: `{{${v.name}}}`,
        type: "variable",
        icon: "Database",
      }));
    return [...wsVariables, ...ws];
  }, [getVariables]);

  const initialValue = value ? extractValueFromFlowValue(value) || "" : null;
  const [status, setStatus] = useState(initialValue ? priorities.find((ws) => ws.id == initialValue) : undefined);

  const handleChange = (statusId: string) => {
    const newStatus = priorities.find((s) => s.id == statusId);
    if (newStatus) {
      setStatus(newStatus);
      if (newStatus.type == "static") onChange({ type: "static", value: statusId });
      if (newStatus.type == "variable") onChange({ type: "variable", value: getVariables().find((v) => v.id == newStatus.id)! });
    }
  };

  const SelectedStatusIcon = status ? IconMap[status.icon as IconType] : null;
  return (
    <div className={className}>
      <Label className="block text-xs font-medium text-muted-foreground mb-1">{label ? label : "value"}</Label>
      <Select value={String(status?.id)} onValueChange={handleChange}>
        <SelectTrigger className="h-8 p-0 px-2 [&>svg]:mt-0.5 w-full">
          <SelectValue asChild>
            <p className="flex items-center space-x-2 mr-2">
              {status && SelectedStatusIcon && (
                <>
                  <SelectedStatusIcon className={`h-4 w-4 ${IconColorMap[status.icon as IconType]}`} />
                  <span className="text-sm">{status.name}</span>
                </>
              )}
              {!status && <span>Select Priority</span>}
            </p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {priorities.map((priority) => {
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
    </div>
  );
};
