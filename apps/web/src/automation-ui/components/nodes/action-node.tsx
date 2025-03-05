import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Settings, X, Plus, Bell, MessageSquare, CheckSquare, Webhook, Slack, Github, Server } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@components/ui/input";
import { LucideIcon } from "lucide-react";
import { NodeDeleteButton } from "./delete-button";
import { UpdateTask } from "../update-task";

interface ActionType {
  value: string;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
}

interface ActionCategory {
  category: string;
  actions: ActionType[];
}

const actionTypes: ActionCategory[] = [
  {
    category: "Recommended",
    actions: [
      { value: "github_branch", label: "Create branch in GitHub", icon: Github, isNew: true },
      { value: "server_restart", label: "Restart Server", icon: Server, isNew: true },
    ],
  },
  {
    category: "Issue actions",
    actions: [
      { value: "create_issue", label: "Create issue", icon: Plus, isNew: false },
      { value: "update_issue", label: "Update issue", icon: CheckSquare, isNew: false },
    ],
  },
  {
    category: "Notifications",
    actions: [
      { value: "send_notification", label: "Send notification", icon: Bell, isNew: false },
      { value: "slack_message", label: "Send to Slack", icon: Slack, isNew: false },
      { value: "teams_message", label: "Send to Teams", icon: MessageSquare, isNew: false },
      { value: "webhook", label: "Send web request", icon: Webhook, isNew: false },
    ],
  },
];

const issueFields = [
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
  { value: "assignee", label: "Assignee" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
];

interface ActionNodeData {
  label: string;
  actionType?: string;
}

export const ActionNode = memo(function ActionNode({ data, id }: { data: ActionNodeData; id: string }) {
  const form = useForm({
    defaultValues: {
      actionType: data.actionType || "",
      config: {
        updates: [{ field: "", value: "" }],
        message: "",
        webhook_url: "",
        branch_name: "",
        server_name: "",
      },
    },
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleteHovering, setIsDeleteHovering] = useState(false);

  const actionType = form.watch("actionType");
  const updates = form.watch("config.updates") || [];

  const selectedAction = actionTypes.flatMap((category) => category.actions).find((action) => action.value === actionType);

  const ActionIcon = selectedAction?.icon || CheckSquare;

  const addUpdate = () => {
    const currentUpdates = form.watch("config.updates") || [];
    form.setValue("config.updates", [...currentUpdates, { field: "", value: "" }]);
  };

  const removeUpdate = (index: number) => {
    const currentUpdates = form.watch("config.updates") || [];
    form.setValue(
      "config.updates",
      currentUpdates.filter((_, i) => i !== index)
    );
  };

  return (
    <div
      className={`px-4 py-2 shadow-lg rounded-lg border-2 min-w-[200px] relative transition-colors ${isDeleteHovering ? "border-destructive bg-destructive/5" : "border-blue-500"}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center gap-2">
        <ActionIcon className="w-4 h-4 text-blue-500" />
        <input type="text" defaultValue={data.label} className="text-sm font-medium bg-transparent border-none focus:outline-none w-full" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm">Configure Action</h4>
              </div>

              {!actionType ? (
                <div className="p-2 space-y-4">
                  {actionTypes.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-500 px-2">{category.category}</h5>
                      <div className="space-y-1">
                        {category.actions.map((action) => (
                          <Button
                            key={action.value}
                            variant="ghost"
                            className="w-full justify-start hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950"
                            onClick={() => form.setValue("actionType", action.value)}
                          >
                            <action.icon className="h-4 w-4 mr-2" />
                            <span className="flex-1 text-left">{action.label}</span>
                            {action.isNew && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">NEW</span>}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => form.setValue("actionType", "")}>
                      <X className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <span className="text-gray-500">→</span>
                    <div className="flex items-center gap-2">
                      <ActionIcon className="h-4 w-4" />
                      <span>{selectedAction?.label}</span>
                    </div>
                  </div>

                  <Form {...form}>
                    <form className="space-y-4">
                      {actionType === "github_branch" && (
                        <FormField
                          control={form.control}
                          name="config.branch_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter branch name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {actionType === "server_restart" && (
                        <FormField
                          control={form.control}
                          name="config.server_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Server Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter server name" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {(actionType === "update_issue" || actionType === "create_issue") && <UpdateTask />}

                      {(actionType === "send_notification" || actionType === "slack_message" || actionType === "teams_message") && (
                        <FormField
                          control={form.control}
                          name="config.message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter message" className="border-gray-200" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {actionType === "webhook" && (
                        <FormField
                          control={form.control}
                          name="config.webhook_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Webhook URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter webhook URL" className="border-gray-200" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </form>
                  </Form>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Delete button - visible on hover */}
      {isHovering && <NodeDeleteButton nodeId={id} onMouseEnter={() => setIsDeleteHovering(true)} onMouseLeave={() => setIsDeleteHovering(false)} />}

      <Handle type="target" position={Position.Top} className="!bg-blue-500 hover:!h-3 hover:!w-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 hover:!h-3 hover:!w-3" />
    </div>
  );
});
