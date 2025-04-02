import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, Trash2Icon, PencilIcon, UserIcon, ClipboardCheckIcon, FolderIcon, FlameIcon, DatabaseIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VariablesTypes } from "@/automation-ui/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { createCustomVariable } from "@/automation-ui/utils/variables";
import { FlowVariable, FlowVariableCateory, FlowVariableType } from "@tdata/shared/types";
import { useFlowStore } from "@/automation-ui/store/flow";

/**
 * This component defines sucomopnent inside it but its an antipattern as o every render the subcomponent are recreated and remounted which is not good for performance
 * But I don't have time to refactor it now
 */
export const FlowVariablesModal = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("custom");
  const [newVarName, setNewVarName] = useState("");
  const [newVarValue, setNewVarValue] = useState<string | string[]>("");
  const [newVarType, setNewVarType] = useState<FlowVariableType>("text");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { getSystemVariables, getCustomVariables, setCustomVariable, updateCustomVariable, deleteCustomVariable } = useFlowStore();

  const customVariables = getCustomVariables();

  // Reset form when closing
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setNewVarName("");
    setNewVarValue("");
    setNewVarType("text");
    setEditingId(null);
    setSearchTerm("");
    setCategoryFilter("all");
  };

  // Handle wheel events to prevent propagation to ReactFlow
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  const handleSaveVariable = () => {
    if (!newVarName.trim()) {
      toast.error("Variable name is required");
      return;
    }

    if (!newVarName.match(/^[a-zA-Z0-9_]+$/)) {
      toast.error("Variable name can only contain letters, numbers, and underscores");
      return;
    }

    try {
      const variable: FlowVariable = createCustomVariable(newVarName, newVarValue, newVarType, `Custom variable: ${newVarName}`);

      if (editingId !== null) {
        updateCustomVariable(editingId, variable);
      } else setCustomVariable(variable);

      resetForm();
      toast.success(editingId !== null ? "Variable updated" : "Variable created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save variable");
    }
  };

  const handleEditVariable = (id: string) => {
    const variable = customVariables.find((v) => v.id === id);
    if (!variable) return;
    setNewVarName(variable.name.replace("variables.", ""));
    setNewVarValue(variable.value || "");
    setNewVarType(variable.type);
    setEditingId(variable.id);
  };

  const handleDeleteVariable = (id: string) => {
    try {
      deleteCustomVariable(id);
      resetForm();
      toast.success("Variable deleted");
    } catch (_) {
      toast.error("Failed to delete variable");
    }
  };

  // Filter system variables based on search and category
  const filteredSystemVariables = getSystemVariables().filter((variable) => {
    const matchesSearch =
      searchTerm === "" || variable.name.toLowerCase().includes(searchTerm.toLowerCase()) || variable.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (categoryFilter === "all") return matchesSearch;

    if (categoryFilter === "task") return matchesSearch && variable.name.startsWith("task.");
    if (categoryFilter === "user") return matchesSearch && (variable.name.startsWith("user.") || variable.name.startsWith("trigger.user."));
    if (categoryFilter === "project") return matchesSearch && variable.name.startsWith("project.");
    if (categoryFilter === "trigger") return matchesSearch && variable.name.startsWith("trigger.") && !variable.name.startsWith("trigger.user.");

    return matchesSearch;
  });

  // Filter custom variables based on search
  const filteredCustomVariables = customVariables.filter((variable) => searchTerm === "" || variable.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Get variable category style
  const getVariableCategoryStyle = (name: string) => {
    if (name.startsWith("task.")) return "variable-task";
    if (name.startsWith("current_user.") || name.startsWith("trigger.user.")) return "variable-user";
    if (name.startsWith("project.")) return "variable-project";
    if (name.startsWith("trigger.") && !name.startsWith("trigger.user.")) return "variable-trigger";
    if (name.startsWith("variables.")) return "variable-custom";
    return "";
  };

  const VariableTypeSelect = () => {
    return (
      <Select value={newVarType} onValueChange={(val) => setNewVarType(val as FlowVariableType)}>
        <SelectTrigger className="text-xs">
          <SelectValue placeholder="Select Var Type" />
        </SelectTrigger>
        <SelectContent>
          {VariablesTypes.map((v) => (
            <SelectItem key={v.value} value={v.value}>
              {v.label}
            </SelectItem>
          ))}{" "}
        </SelectContent>
      </Select>
    );
  };

  const SystemVariableCategoryFilter = () => {
    return (
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Button
          size="sm"
          className={`flex items-center gap-1 transition-colors ${
            categoryFilter === "all"
              ? "bg-gray-200 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
              : "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          }`}
          onClick={() => setCategoryFilter("all")}
        >
          <DatabaseIcon size={14} />
          All
        </Button>
        <Button
          size="sm"
          className={`flex items-center gap-1 transition-colors ${
            categoryFilter === "task"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
              : "bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
          }`}
          onClick={() => setCategoryFilter("task")}
        >
          <ClipboardCheckIcon size={14} />
          Task
        </Button>
        <Button
          size="sm"
          className={`flex items-center gap-1 transition-colors ${
            categoryFilter === "user"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400"
              : "bg-purple-50 text-purple-600 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800"
          }`}
          onClick={() => setCategoryFilter("user")}
        >
          <UserIcon size={14} />
          User
        </Button>
        <Button
          size="sm"
          className={`flex items-center gap-1 transition-colors ${
            categoryFilter === "project"
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800"
          }`}
          onClick={() => setCategoryFilter("project")}
        >
          <FolderIcon size={14} />
          Project
        </Button>
        <Button
          size="sm"
          className={`flex items-center gap-1 transition-colors ${
            categoryFilter === "trigger"
              ? "bg-orange-100 text-orange-700 dark:bg-orange-950  dark:text-orange-400"
              : "bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-800"
          }`}
          onClick={() => setCategoryFilter("trigger")}
        >
          <FlameIcon size={14} />
          Trigger
        </Button>
      </div>
    );
  };

  const VariableList = (category: FlowVariableCateory) => {
    const filteredVars = category === "custom" ? filteredCustomVariables : filteredSystemVariables;
    return (
      <div className="max-h-[300px] overflow-y-auto rounded-sm border">
        {filteredVars.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">{searchTerm ? "No matching variables found" : "No variables yet"}</div>
        ) : (
          <div className="divide-y divide-border">
            {filteredVars.map((variable, index) => (
              <div key={index} className="p-3 hover:bg-accent flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn("inline-block py-0.5 rounded text-xs font-medium", getVariableCategoryStyle(variable.name))}>{variable.name}</span>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {variable.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 truncate max-w-[400px]">Value: {variable.value}</p>
                </div>
                {category == "custom" && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditVariable(variable.id)}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                      title="Edit variable"
                    >
                      <PencilIcon size={14} />
                    </button>
                    <button onClick={() => handleDeleteVariable(variable.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md" title="Delete variable">
                      <Trash2Icon size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="outline" size="icon" className="h-8 w-8 rounded-sm border border-blue-500">
          <DatabaseIcon className="h-4 w-4 text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 bg-background" onWheel={handleWheel}>
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <DatabaseIcon className="h-6 w-6 text-blue-500" />
            <span>Variables Library</span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 pt-0">
          <div className="mb-4">
            <Input placeholder="Search variables..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <Tabs defaultValue="custom" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="custom">Custom Variables</TabsTrigger>
              <TabsTrigger value="system">System Variables</TabsTrigger>
            </TabsList>

            <TabsContent value="custom" className="mt-0">
              <div className="px-1">
                <h3 className="text-sm font-medium mb-2 ">{editingId !== null ? "Edit Variable" : "New Custom Variable"}</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label className="block text-xs font-medium text-muted-foreground mb-1">Name</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-2 border border-r-0 rounded-l-sm text-xs texttext-muted-foreground">variables.</span>
                      <Input value={newVarName} onChange={(e) => setNewVarName(e.target.value)} placeholder="my_variable" className="rounded-l-none" />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-xs font-medium text-muted-foreground mb-1">Type</Label>
                    <VariableTypeSelect />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                  <Input value={newVarValue} onChange={(e) => setNewVarValue(e.target.value)} placeholder="Variable value" />
                </div>
                <div className="flex justify-end gap-2 mb-2">
                  {editingId !== null && (
                    <Button variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                  <Button onClick={handleSaveVariable} className="flex items-center gap-1">
                    <PlusIcon size={14} />
                    {editingId !== null ? "Update" : "Add"} Variable
                  </Button>
                </div>
              </div>
              {VariableList("custom")}
            </TabsContent>

            <TabsContent value="system" className="mt-0">
              <SystemVariableCategoryFilter />
              {VariableList("system")}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
