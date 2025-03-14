import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { ProjectTemplateDetail, ProjectTemplateProperty } from "@tdata/shared/types";
import { FC, useMemo, useState } from "react";
import { useFlowStore } from "@/automation-ui/store/flow";
import { FlowValue } from "@/automation-ui/types";
import { FlowValueComponent } from "./flow-value-component";

const StandardFields = new Set(["title", "assignee", "status", "priority"]);

// here's what I want to do
// create an array of all fields like for the custom fields
// user will select the fields that they want to update
// the value input type will be based on the type of the field

type ActionNodeUpdateTaskActionProps = {
  onChange: (key: string, value: FlowValue | null) => void;
  onRemove: (key: string) => void;
};

export const ActionNodeUpdateTaskAction: FC<ActionNodeUpdateTaskActionProps> = ({ onChange, onRemove }) => {
  const { project } = useFlowStore();
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const projectTemplate = project.template as ProjectTemplateDetail;

  const customFieldMap = useMemo(() => {
    return (projectTemplate.taskProperties || []).reduce((acc, field) => {
      acc[field.name] = field;
      return acc;
    }, {} as Record<string, ProjectTemplateProperty>);
  }, [projectTemplate]);

  const fieldNames = useMemo(() => Object.keys(customFieldMap).concat(Array.from(StandardFields)), [customFieldMap]);

  const handleAddSelectedFields = (value: string) => {
    setSelectedFields([...selectedFields, value]);
    onChange(value, null);
  };

  const removeSelectedField = (value: string) => {
    setSelectedFields(selectedFields.filter((field) => field !== value));
    onRemove(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <Select onValueChange={handleAddSelectedFields}>
        <SelectTrigger>
          <SelectValue placeholder="Select fields to update" asChild>
            <p>Select fields to update</p>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {fieldNames.map((fieldName) => {
            return (
              <SelectItem className="disabled:cursor-not-allowed opacity-90" key={fieldName} value={fieldName} disabled={selectedFields.includes(fieldName)}>
                {fieldName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-2">
        {selectedFields.map((fieldName) => {
          if (StandardFields.has(fieldName)) {
            return <StandardField key={fieldName} fieldName={fieldName} onChange={onChange} onRemove={removeSelectedField} />;
          }
          const field = customFieldMap[fieldName];
          return (
            <FlowValueComponent
              key={field.name}
              valueFor={fieldName}
              type={field.type}
              label={fieldName}
              onChange={(value) => onChange(fieldName, value)}
              deletable
              onDelete={() => removeSelectedField(fieldName)}
            />
          );
        })}
      </div>
    </div>
  );
};

type StandardFieldProps = {
  fieldName: string;
  onChange: (key: string, value: FlowValue) => void;
  onRemove: (key: string) => void;
};

const StandardField: FC<StandardFieldProps> = ({ fieldName, onChange, onRemove }) => {
  if (fieldName === "status") {
    return <FlowValueComponent type="status" label="Status" onChange={(value) => onChange("status", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  if (fieldName === "priority") {
    return <FlowValueComponent type="priority" label="Priority" onChange={(value) => onChange("priority", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  if (fieldName === "assignee") {
    return <FlowValueComponent type="user" label="Assignee" onChange={(value) => onChange("assignee", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  if (fieldName == "title") {
    return <FlowValueComponent type="text" label="Title" onChange={(value) => onChange("title", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  return null;
};
