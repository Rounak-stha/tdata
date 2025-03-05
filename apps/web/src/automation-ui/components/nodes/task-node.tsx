import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckSquare, Plus, Settings, X, Layers, Bell, GitBranch } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/automation-ui/store/flow";

const taskFields = [
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" },
  { value: "assignee", label: "Assignee" },
  { value: "dueDate", label: "Due Date" },
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
];

export const TaskNode = memo(function TaskNode({ data, id }: { data: { label: string }; id: string }) {
  const { onAddNode } = useFlowStore();
  const form = useForm({
    defaultValues: {
      updates: [{ field: "", value: "" }],
    },
  });

  const updates = form.watch("updates") || [];

  const addUpdate = () => {
    const currentUpdates = form.getValues("updates") || [];
    form.setValue("updates", [...currentUpdates, { field: "", value: "" }]);
  };

  const removeUpdate = (index: number) => {
    const currentUpdates = form.getValues("updates") || [];
    form.setValue(
      "updates",
      currentUpdates.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-blue-500 min-w-[200px]">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-blue-500" />
        <input type="text" defaultValue={data.label} className="text-sm font-medium bg-transparent border-none focus:outline-none w-full" />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
              <Settings className="h-4 w-4 text-blue-500" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-blue-600">
                <Settings className="h-5 w-5" />
                Configure Task Update
              </SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <Form {...form}>
                <form className="space-y-6">
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    {updates.map((_, index) => (
                      <div key={index} className="flex items-end gap-2 bg-white p-3 rounded-md shadow-sm">
                        <FormField
                          control={form.control}
                          name={`updates.${index}.field`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-xs text-gray-600">Field</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-200">
                                    <SelectValue placeholder="Select field" />
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
                        <FormField
                          control={form.control}
                          name={`updates.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="text-xs text-gray-600">Value</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter value" className="border-gray-200" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="button" variant="ghost" size="icon" className="h-10 w-10 mt-6 hover:bg-red-50" onClick={() => removeUpdate(index)}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" onClick={addUpdate} className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                    Add Another Field
                  </Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
              <Plus className="h-4 w-4 text-blue-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 shadow-lg border-gray-100">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50" onClick={() => onAddNode("TaskNode", id)}>
                <Layers className="h-4 w-4 mr-2" />
                Add Task Node
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-purple-600 hover:bg-purple-50" onClick={() => onAddNode("NotificationNode", id)}>
                <Bell className="h-4 w-4 mr-2" />
                Add Notification Node
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-700 hover:text-yellow-600 hover:bg-yellow-50" onClick={() => onAddNode("ConditionNode", id)}>
                <GitBranch className="h-4 w-4 mr-2" />
                Add Condition Node
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
});
