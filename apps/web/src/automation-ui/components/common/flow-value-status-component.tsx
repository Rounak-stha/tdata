import invariant from "tiny-invariant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useMemo, useState } from "react";
import { IconColorMap, IconMap } from "@/lib/constants/icon";
import { IconType } from "@types";
import { FlowValueComponentBaseProps } from "@/automation-ui/types/components";
import { useFlowStore } from "@/automation-ui/store/flow";
import { extractValueFromFlowValue } from "@/automation-ui/utils/variables";
import { FlowTaskStatus } from "@/automation-ui/types";
import { Label } from "@/components/ui/label";

const statusIcons = IconMap;
const statusColors = IconColorMap;

/**
 * The value of the select component is the id of one of the WorkflowStatus.
 */
export const FlowValueStatusComponent: FC<FlowValueComponentBaseProps> = ({ type, value, onChange, className, label }) => {
  invariant(type == "status", "Status Select can only be used with status fields");
  const { project, getVariables } = useFlowStore();
  const workflowStatuses: FlowTaskStatus[] = useMemo(() => {
    const ws: FlowTaskStatus[] = (project?.template.workflow.statuses || []).map((s) => ({
      id: s.id,
      name: s.name,
      type: "static",
      icon: s.icon as IconType,
    }));
    const wsVariables: FlowTaskStatus[] = getVariables()
      .filter((v) => v.type == "status")
      .map((v) => ({
        id: v.id,
        name: `{{${v.name}}}`,
        type: "variable",
        icon: "Database",
      }));
    return [...wsVariables, ...ws];
  }, [project, getVariables]);

  const initialValue = value ? parseInt(extractValueFromFlowValue(value) || "") : null;
  const [status, setStatus] = useState(initialValue ? workflowStatuses.find((ws) => ws.id == initialValue) : undefined);

  const handleChange = (statusId: string) => {
    const newStatus = workflowStatuses.find((s) => s.id == statusId);
    if (newStatus) {
      setStatus(newStatus);
      if (newStatus.type == "static") onChange({ type: "static", value: statusId });
      if (newStatus.type == "variable") onChange({ type: "variable", value: getVariables().find((v) => v.id == newStatus.id)! });
    }
  };

  const SelectedStatusIcon = status ? statusIcons[status.icon as IconType] : null;
  return (
    <div className={className}>
      <Label className="block text-xs font-medium text-muted-foreground mb-1">{label ? label : "value"}</Label>
      <Select value={String(status?.id)} onValueChange={handleChange}>
        <SelectTrigger className="h-8 p-0 px-2 [&>svg]:mt-0.5 w-full">
          <SelectValue asChild>
            <p className="flex items-center space-x-2 mr-2">
              {status && SelectedStatusIcon && (
                <>
                  <SelectedStatusIcon className={`h-4 w-4 ${statusColors[status.icon as IconType]}`} />
                  <span className="text-sm">{status.name}</span>
                </>
              )}
              {!status && <span>Select Status</span>}
            </p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {workflowStatuses.map((status) => {
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
    </div>
  );
};
