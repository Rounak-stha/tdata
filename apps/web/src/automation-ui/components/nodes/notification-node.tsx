import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Bell, Plus, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export const NotificationNode = memo(function NotificationNode({ data }: { data: { label: string } }) {
  const form = useForm({
    defaultValues: {
      notificationType: "email",
      recipient: "",
      template: "",
    },
  });

  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-purple-500 min-w-[200px]">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-purple-500" />
        <input type="text" defaultValue={data.label} className="text-sm font-medium bg-transparent border-none focus:outline-none w-full" />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Configure Notification</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notificationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="slack">Slack</SelectItem>
                            <SelectItem value="in_app">In-App</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select recipient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="assignee">Task Assignee</SelectItem>
                            <SelectItem value="creator">Task Creator</SelectItem>
                            <SelectItem value="team">Entire Team</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" onClick={() => console.log("Add task node")}>
                Add Task Node
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => console.log("Add notification node")}>
                Add Notification Node
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => console.log("Add condition node")}>
                Add Condition Node
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500" />
    </div>
  );
});
