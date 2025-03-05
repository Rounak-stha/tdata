import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { GitBranch, Settings, Variable } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { VariableReference } from "../../types";
import { NodeDeleteButton } from "./delete-button";

interface ConditionNodeData {
  label: string;
  leftOperand?: VariableReference;
  operator?: string;
  rightOperand?: string;
}

const operators = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "in", label: "In" },
  { value: "not_in", label: "Not In" },
];

export const ConditionNode = memo(function ConditionNode({ data, id }: { data: ConditionNodeData; id: string }) {
  const form = useForm({
    defaultValues: {
      leftOperand: data.leftOperand || { variableName: "", path: [] },
      operator: data.operator || "equals",
      rightOperand: data.rightOperand || "",
    },
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleteHovering, setIsDeleteHovering] = useState(false);

  const availableVariables = [
    { name: "trigger_task", type: "system", systemType: "trigger_record" },
    { name: "current_user", type: "system", systemType: "current_user" },
    { name: "matching_tasks", type: "query" },
    { name: "custom_var", type: "user", dataType: "string" },
  ];

  return (
    <div
      className={`px-4 py-2 shadow-lg rounded-lg border-2 min-w-[200px] relative transition-colors ${
        isDeleteHovering ? "border-destructive bg-destructive/5" : "border-yellow-500"
      }`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-yellow-500" />
        <input type="text" defaultValue={data.label} className="text-sm font-medium bg-transparent border-none focus:outline-none w-full" />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-500 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-950">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <div className="p-4 border-b">
                <h4 className="font-medium text-sm">Configure Condition</h4>
              </div>

              <Form {...form}>
                <form className="space-y-4 p-4">
                  <FormField
                    control={form.control}
                    name="leftOperand.variableName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variable</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select variable" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableVariables.map((variable) => (
                              <SelectItem key={variable.name} value={variable.name}>
                                <div className="flex items-center gap-2">
                                  <Variable className="h-4 w-4" />
                                  <span>{variable.name}</span>
                                  <span className="text-xs text-gray-500">({variable.type})</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operator</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {operators.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rightOperand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter value" value={String(field.value)} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isHovering && <NodeDeleteButton nodeId={id} onMouseEnter={() => setIsDeleteHovering(true)} onMouseLeave={() => setIsDeleteHovering(false)} />}

      {/* Target handle at the top */}
      <Handle type="target" position={Position.Top} className="!bg-yellow-500 hover:!h-3 hover:!w-3" />

      {/* Single source handle that connects to both paths */}
      <Handle type="source" position={Position.Bottom} className="!bg-yellow-500 hover:!h-3 hover:!w-3" />
      <Handle type="source" position={Position.Bottom} className="!bg-yellow-500 hover:!h-3 hover:!w-3" />
    </div>
  );
});
