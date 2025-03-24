import { FC } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type EditAssigneeProps = {
  singleAssignee: boolean;
  setAssignee: (sinleAssignee: boolean) => void;
};

export const EditAssignee: FC<EditAssigneeProps> = ({ singleAssignee, setAssignee }) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Assignee</h3>
      <div className="flex items-center gap-2">
        <Switch checked={singleAssignee} onCheckedChange={(check) => setAssignee(check)} />
        <Label className="text-xs text-muted-foreground">Single?</Label>
      </div>
    </div>
  );
};
