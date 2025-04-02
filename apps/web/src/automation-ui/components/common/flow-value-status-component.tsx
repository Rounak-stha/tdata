import invariant from "tiny-invariant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useMemo, useState } from "react";
import { IconColorMap, IconMap } from "@/lib/constants/icon";
import { IconType } from "@types";
import { FlowValueComponentBaseProps } from "@/automation-ui/types/components";
import { useFlowStore } from "@/automation-ui/store/flow";

import { FlowTaskStatus } from "@/automation-ui/types";
import { TrashIcon } from "lucide-react";
import { extractValueFromFlowValue } from "@tdata/shared/utils";

const statusIcons = IconMap;
const statusColors = IconColorMap;

/**
 * The value of the select component is the id of one of the WorkflowStatus.
 */
export const FlowValueStatusComponent: FC<FlowValueComponentBaseProps> = ({ type, value, onChange, className, label, deletable = false, onDelete }) => {
  invariant(type == "status", "Status Select can only be used with status fields");
  const { project, getVariables } = useFlowStore();
  const workflowStatuses: FlowTaskStatus[] = useMemo(() => {
    const ws: FlowTaskStatus[] = (project?.template.statuses || []).map((s) => ({
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

  // For select component, the value is the strinified id of the status
  const initialValue = value ? parseInt((extractValueFromFlowValue(value) || "") as string) : null;
  const [status, setStatus] = useState(initialValue ? workflowStatuses.find((ws) => ws.id == initialValue) : undefined);

  const handleChange = (statusId: string) => {
    const newStatus = workflowStatuses.find((s) => s.id == statusId);
    if (newStatus) {
      setStatus(newStatus);
      if (newStatus.type == "static") onChange({ type: "static", value: statusId });
      if (newStatus.type == "variable") onChange({ type: "variable", value: getVariables().find((v) => v.id == newStatus.id)! });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const SelectedStatusIcon = status ? statusIcons[status.icon as IconType] : null;
  return (
    <div className={className}>
      <div className="flex items-center">
        <label className="flex-1 block text-xs font-medium text-gray-500 mb-1">{label ? label : "Value"}</label>
        {deletable && <TrashIcon size={14} onClick={handleDelete} className="hover:text-destructive cursor-pointer" />}
      </div>
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
