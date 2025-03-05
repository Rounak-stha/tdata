import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Settings, Clock, RefreshCw, ListTodo, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@components/ui/input";
import { LucideIcon } from "lucide-react";

interface TriggerType {
  value: string;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
}

interface TriggerCategory {
  category: string;
  triggers: TriggerType[];
}

const triggerTypes: TriggerCategory[] = [
  {
    category: "Time-based",
    triggers: [
      { value: "interval", label: "Run at intervals", icon: Clock, isNew: true },
      { value: "schedule", label: "Run on schedule", icon: Calendar, isNew: true },
    ],
  },
  {
    category: "Task-based",
    triggers: [
      { value: "task_created", label: "When task is created", icon: ListTodo, isNew: false },
      { value: "task_updated", label: "When task is updated", icon: RefreshCw, isNew: false },
    ],
  },
];

const taskFields = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "assignee", label: "Assignee" },
  { value: "dueDate", label: "Due Date" },
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
];

const intervalOptions = [
  { value: "5m", label: "Every 5 minutes" },
  { value: "15m", label: "Every 15 minutes" },
  { value: "30m", label: "Every 30 minutes" },
  { value: "1h", label: "Every hour" },
  { value: "4h", label: "Every 4 hours" },
  { value: "12h", label: "Every 12 hours" },
  { value: "24h", label: "Every day" },
];

interface TriggerNodeData {
  label: string;
  triggerType?: string;
}

export const TriggerNode = memo(function TriggerNode({ data, id }: { data: TriggerNodeData; id: string }) {
  const form = useForm({
    defaultValues: {
      triggerType: data.triggerType || "",
      config: {
        interval: "1h",
        schedule: "",
        watchedFields: [] as string[],
      },
    },
  });

  const triggerType = form.watch("triggerType");

  const selectedTrigger = triggerTypes.flatMap((category) => category.triggers).find((trigger) => trigger.value === triggerType);

  const TriggerIcon = selectedTrigger?.icon || Clock;

  return (
    <div className="px-4 py-2 shadow-lg rounded-lg border-2 min-w-[200px] relative transition-colors border-green-500 ">
      <div className="flex items-center gap-2">
        <TriggerIcon className="w-4 h-4 text-green-500" />
        <input type="text" defaultValue={data.label} className="text-sm font-medium bg-transparent border-none focus:outline-none w-full" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-50 dark:hover:bg-green-900">
              <Settings className="h-4 w-4 text-green-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm">Configure Trigger</h4>
              </div>

              {!triggerType ? (
                <div className="p-2 space-y-4">
                  {triggerTypes.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-500 px-2">{category.category}</h5>
                      <div className="space-y-1">
                        {category.triggers.map((trigger) => (
                          <Button
                            key={trigger.value}
                            variant="ghost"
                            className="w-full justify-start hover:text-green-600 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                            onClick={() => form.setValue("triggerType", trigger.value)}
                          >
                            <trigger.icon className="h-4 w-4 mr-2" />
                            <span className="flex-1 text-left">{trigger.label}</span>
                            {trigger.isNew && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">NEW</span>}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => form.setValue("triggerType", "")}>
                      <Settings className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                    <span className="text-gray-500">→</span>
                    <div className="flex items-center gap-2">
                      <TriggerIcon className="h-4 w-4" />
                      <span>{selectedTrigger?.label}</span>
                    </div>
                  </div>

                  <Form {...form}>
                    <form className="space-y-4">
                      {triggerType === "interval" && (
                        <FormField
                          control={form.control}
                          name="config.interval"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Run Interval</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select interval" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {intervalOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      )}

                      {triggerType === "schedule" && (
                        <FormField
                          control={form.control}
                          name="config.schedule"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cron Schedule</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter cron expression (e.g., 0 9 * * 1-5)" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}

                      {triggerType === "task_updated" && (
                        <FormField
                          control={form.control}
                          name="config.watchedFields"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Watch for changes in</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  const current = field.value || [];
                                  const newValue = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
                                  field.onChange(newValue);
                                }}
                                value={field.value?.[0] || ""}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select fields to watch" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {taskFields.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
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

      <Handle type="source" position={Position.Bottom} className="!bg-green-500 hover:!h-3 hover:!w-3" />
    </div>
  );
});
