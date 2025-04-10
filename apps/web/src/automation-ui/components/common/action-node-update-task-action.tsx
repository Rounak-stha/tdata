import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { ActionNodeData, FlowValue, ProjectTemplateDetail, ProjectTemplateProperty, TaskStandardUpdatableFieldLabels } from "@tdata/shared/types";
import { StandardUpdatableFields } from "@tdata/shared/lib";
import { FC, useMemo, useState } from "react";
import { useFlowStore } from "@/automation-ui/store/flow";
import { FlowValueComponent } from "./flow-value-component";

// here's what I want to do
// create an array of all fields like for the custom fields
// user will select the fields that they want to update
// the value input type will be based on the type of the field

type ActionNodeUpdateTaskActionProps = {
  data: ActionNodeData<"Update_Task">;
  onChange: (key: string, value: FlowValue | null) => void;
  onRemove: (key: string) => void;
};

type SelectedFields = {
  name: string;
  value: FlowValue | null;
};

export const ActionNodeUpdateTaskAction: FC<ActionNodeUpdateTaskActionProps> = ({ data, onChange, onRemove }) => {
  const { project } = useFlowStore();
  const initiaFields = useMemo(() => Object.keys(data.payload || {}).map((key) => ({ name: key, value: data.payload?.[key] || null })), [data.payload]);
  const [selectedFields, setSelectedFields] = useState<SelectedFields[]>(initiaFields);
  const projectTemplate = project.template as ProjectTemplateDetail;

  const customFieldMap = useMemo(() => {
    return (projectTemplate.taskProperties || []).reduce((acc, field) => {
      acc[field.name] = field;
      return acc;
    }, {} as Record<string, ProjectTemplateProperty>);
  }, [projectTemplate]);

  const fieldNames = useMemo(() => Object.keys(customFieldMap).concat(Array.from(StandardUpdatableFields)), [customFieldMap]);

  const handleAddSelectedFields = (name: string) => {
    setSelectedFields([...selectedFields, { name, value: null }]);
    onChange(name, null);
  };

  const removeSelectedField = (name: string) => {
    setSelectedFields(selectedFields.filter((field) => field.name !== name));
    onRemove(name);
  };

  return (
    <div className="flex flex-col gap-4">
      <Select onValueChange={handleAddSelectedFields}>
        <SelectTrigger>
          <SelectValue placeholder="Select fields to update" />
        </SelectTrigger>
        <SelectContent>
          {fieldNames.map((fieldName) => {
            return (
              <SelectItem className="disabled:cursor-not-allowed opacity-90" key={fieldName} value={fieldName} disabled={selectedFields.some((field) => field.name == fieldName)}>
                {fieldName}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <div className="flex flex-col gap-2">
        {selectedFields.map(({ name: fieldName, value }) => {
          if (StandardUpdatableFields.has(fieldName as TaskStandardUpdatableFieldLabels)) {
            return <StandardField key={fieldName} fieldName={fieldName} value={value} onChange={onChange} onRemove={removeSelectedField} />;
          }
          const field = customFieldMap[fieldName];
          return (
            <FlowValueComponent
              key={field.name}
              valueFor={fieldName}
              type={field.type}
              label={fieldName}
              value={value}
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
  value: FlowValue | null;
  onChange: (key: string, value: FlowValue) => void;
  onRemove: (key: string) => void;
};

const StandardField: FC<StandardFieldProps> = ({ fieldName, value, onChange, onRemove }) => {
  if (fieldName === "status") {
    return <FlowValueComponent type="status" label="Status" value={value} onChange={(value) => onChange("status", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  if (fieldName === "priority") {
    return <FlowValueComponent type="priority" label="Priority" value={value} onChange={(value) => onChange("priority", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  if (fieldName === "assignee") {
    return <FlowValueComponent type="user" label="Assignee" value={value} onChange={(value) => onChange("assignee", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  if (fieldName == "title") {
    return <FlowValueComponent type="text" label="Title" value={value} onChange={(value) => onChange("title", value)} deletable onDelete={() => onRemove(fieldName)} />;
  }

  return null;
};
