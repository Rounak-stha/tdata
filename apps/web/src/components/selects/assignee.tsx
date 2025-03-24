import { CheckIcon, ChevronsUpDownIcon, XIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { FC, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/tooltip";
import { useOrganizationMembers } from "@/hooks";
import { User } from "@tdata/shared/types";
import { ChangeParams } from "@/types";

interface AssigneeSelectProps {
  assignee?: User[];
  onChange?: (change: ChangeParams<User[]>) => void;
  size?: "icon" | "default" | "full";
  singleUser?: boolean;
}

const NUMBER_OF_USERS_TO_SHOW = 2;

export const AssigneeSelect: FC<AssigneeSelectProps> = ({ singleUser, ...rest }) => {
  if (singleUser) return <SingleAssigneeSelect {...rest} />;
  return <MultiAssigneeSelect {...rest} />;
};

type SingleAssigneeSelectProps = Omit<AssigneeSelectProps, "singleUser">;

const SingleAssigneeSelect: FC<SingleAssigneeSelectProps> = ({ assignee, onChange, size = "default" }) => {
  const [open, setOpen] = useState(false);
  const assignees = useOrganizationMembers();
  const [selectedAssignee, setSelectedAssignee] = useState(assignee?.length ? assignee[0] : null);

  const handleSelect = (id: string) => {
    const newAssignee = assignees.find((a) => a.id === id);
    if (newAssignee) {
      setSelectedAssignee(newAssignee);
      if (onChange) onChange({ newValue: [newAssignee], previousValue: selectedAssignee ? [selectedAssignee] : [] });
    }
    setOpen(false);
  };

  const handleUnAssign = () => {
    setSelectedAssignee(null);
    if (onChange) onChange({ newValue: [], previousValue: selectedAssignee ? [selectedAssignee] : [] });
    setOpen(false);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={open} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn("p-0 px-2 flex items-center justify-start bg-inherit hover:bg-inherit", {
                  "h-8 w-8 border-none": size == "default" || size == "icon",
                  "h-10 w-full": size == "full",
                })}
              >
                {selectedAssignee ? (
                  <>
                    <Avatar src={selectedAssignee.imageUrl} alt={`${selectedAssignee.name} avatar`} />
                    {size != "icon" && <span className="ml-0.5">{selectedAssignee.name}</span>}
                  </>
                ) : (
                  <>
                    <UserIcon className="h-6 w-6" />
                    {size != "icon" && <span className="ml-0.5">Assign</span>}
                  </>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>{selectedAssignee ? selectedAssignee.name : "Assign task"}</TooltipContent>
          <PopoverContent align="start" className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search assignee..." />
              <CommandEmpty>No assignee found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {selectedAssignee && (
                    <CommandItem onSelect={handleUnAssign} value={"UnAssigned"}>
                      <Avatar />
                      {"UnAssign"}
                    </CommandItem>
                  )}
                  {assignees.map((assignee) => (
                    <CommandItem key={assignee.id} onSelect={() => handleSelect(assignee.id)} value={assignee.name}>
                      <Avatar src={assignee.imageUrl} alt={`${assignee.name} avatar`} />
                      {assignee.name}
                      <CheckIcon className={cn("ml-auto h-4 w-4", selectedAssignee?.id === assignee.id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </TooltipProvider>
  );
};

type MultiAssigneeSelecProps = Omit<AssigneeSelectProps, "singleUser">;

export const MultiAssigneeSelect: FC<MultiAssigneeSelecProps> = ({ assignee, onChange, size = "default" }) => {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(assignee || []);
  const [isHovering, setIsHovering] = useState(false);
  const members = useOrganizationMembers();

  const toggleUser = (user: User) => {
    const newUsers = selectedUsers.some((u) => u.id === user.id) ? selectedUsers.filter((u) => u.id !== user.id) : [...selectedUsers, user];
    setSelectedUsers(newUsers);
    if (onChange) onChange({ newValue: newUsers, previousValue: selectedUsers });
  };

  const removeUser = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newUsers = selectedUsers.filter((u) => u.id !== userId);
    setSelectedUsers(newUsers);
    if (onChange) onChange({ newValue: newUsers, previousValue: selectedUsers });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex items-center border rounded-md bg-inherit py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "hover:bg-accent",
            {
              "px-2": selectedUsers.length == 0,
              "h-8 w-8 border-none justify-center [&>svg]:hidden": size == "default" || size == "icon",
              "h-10 w-full justify-between": size == "full",
            }
          )}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => setOpen(true)}
        >
          {selectedUsers.length > 0 ? (
            <div className="flex items-center">
              {(isHovering ? selectedUsers : selectedUsers.slice(0, NUMBER_OF_USERS_TO_SHOW)).map((user, index) => (
                <TooltipProvider key={user.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn("relative transition-all duration-200 ease-in-out", {
                          "ml-1": isHovering && index !== 0,
                          "-ml-2": !isHovering && index !== 0,
                        })}
                      >
                        <Avatar src={user.imageUrl} alt={user.name} />
                        {isHovering && (
                          <div
                            data-testid={`assignee-remove-btn-${user.id}`}
                            onClick={(e) => removeUser(user.id, e)}
                            className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive border border-input h-4 w-4 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <XIcon className="h-2 w-2" />
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {!isHovering && selectedUsers.length > NUMBER_OF_USERS_TO_SHOW && (
                <div className="z-10 h-6 w-6 -ml-2 rounded-full border-2 border-background flex items-center justify-center bg-muted text-muted-foreground text-xs font-medium">
                  +{selectedUsers.length - NUMBER_OF_USERS_TO_SHOW}
                </div>
              )}
            </div>
          ) : (
            <span className="flex items-center">
              <UserIcon size={16} />
              {size != "icon" && <span className="ml-2">Select assignees</span>}
            </span>
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search assignees..." />
          <CommandList>
            <CommandEmpty>No assignee found.</CommandEmpty>
            <CommandGroup>
              {members.map((user) => (
                <CommandItem key={user.id} onSelect={() => toggleUser(user)} className="flex items-center">
                  <Avatar src={user.imageUrl} alt={user.name} />
                  {user.name}
                  <CheckIcon className={cn("ml-auto h-4 w-4", selectedUsers.some((u) => u.id === user.id) ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
