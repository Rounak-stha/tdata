import { FC } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { ProjectTemplateAssignee } from "@types";

type EditAssigneeProps = {
  assignee: ProjectTemplateAssignee;
  setAssignee: (assignee: ProjectTemplateAssignee) => void;
};

export const EditAssignee: FC<EditAssigneeProps> = ({ assignee, setAssignee }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Assignee</h3>
      <div className="flex items-center gap-2">
        <Switch checked={assignee.single} onCheckedChange={(check) => setAssignee({ ...assignee, single: check })} />
        <Label className="text-xs text-muted-foreground">Single?</Label>
      </div>
    </div>
  );
};
