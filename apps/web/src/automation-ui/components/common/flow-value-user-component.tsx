import invariant from "tiny-invariant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC, useMemo, useState } from "react";
import { FlowValueComponentBaseProps } from "@/automation-ui/types/components";
import { useFlowStore } from "@/automation-ui/store/flow";

import { useOrganizationMembers } from "@/hooks";
import { Avatar } from "@/components/ui/avatar";
import { TrashIcon, UserIcon } from "lucide-react";
import { FlowTaskUser } from "@tdata/shared/types";
import { extractValueFromFlowValue } from "@tdata/shared/utils";

/**
 * The value of the select component is the id of one of the WorkflowStatus.
 */
export const FlowValueUserComponent: FC<FlowValueComponentBaseProps> = ({ type, value, onChange, className, label, deletable = false, onDelete }) => {
  invariant(type == "user", "StatusSelect can only be used with status fields");
  const { getVariables } = useFlowStore();
  const organizationMembers = useOrganizationMembers();
  const users: FlowTaskUser[] = useMemo(() => {
    const ws: FlowTaskUser[] = organizationMembers.map((user) => ({
      id: user.id,
      name: user.name,
      imageUrl: user.imageUrl,
      type: "static",
    }));
    const wsVariables: FlowTaskUser[] = getVariables()
      .filter((v) => v.type == "user")
      .map((v) => ({
        id: v.id,
        name: `{{${v.name}}}`,
        type: "variable",
        imageUrl: null,
        icon: "Database",
      }));
    return [...wsVariables, ...ws];
  }, [getVariables, organizationMembers]);

  const initialValue = value ? extractValueFromFlowValue(value) || "" : null;
  const [user, setUser] = useState(initialValue ? users.find((user) => user.id == initialValue) : undefined);

  const handleChange = (userId: string) => {
    const newUser = users.find((user) => user.id == userId);
    if (newUser) {
      setUser(newUser);
      if (newUser.type == "static") onChange({ type: "static", value: userId });
      if (newUser.type == "variable") onChange({ type: "variable", value: getVariables().find((v) => v.id == newUser.id)! });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center">
        <label className="flex-1 block text-xs font-medium text-gray-500 mb-1">{label ? label : "Value"}</label>
        {deletable && <TrashIcon size={14} onClick={handleDelete} className="hover:text-destructive cursor-pointer" />}
      </div>{" "}
      <Select value={String(user?.id)} onValueChange={handleChange}>
        <SelectTrigger className="h-8 p-0 px-2 [&>svg]:mt-0.5 w-full">
          <SelectValue asChild>
            <p className="flex items-center space-x-2 mr-2">
              {user ? (
                <>
                  <Avatar src={user.imageUrl} alt={`${user.name} avatar`} />
                  <span className="ml-0.5">{user.name}</span>
                </>
              ) : (
                <>
                  <UserIcon className="h-4 w-4" />
                  <span className="ml-0.5">Select User</span>
                </>
              )}
            </p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={String(user.id)}>
              <div className="flex items-center">
                <Avatar size="sm" src={user.imageUrl} alt={`${user.name} avatar`} />
                <span className="ml-0.5">{user.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
