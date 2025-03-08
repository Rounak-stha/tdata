import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { ProjectTemplateDetail, ProjectTemplateProperty } from "@tdata/shared/types";
import { FC, useMemo, useState } from "react";
import { useFlowStore } from "@/automation-ui/store/flow";
import { FlowValue } from "@/automation-ui/types";
import { FlowValueComponent } from "./flow-value-component";

const StandardFields = new Set(["Title", "Assignee", "Status", "Priority"]);

// here's what I want to do
// create an array of all fields like for the custom fields
// user will select the fields that they want to update
// the value input type will be based on the type of the field

type ActionNodeUpdateTaskActionProps = {
  onChange: (key: string, value: FlowValue) => void;
};

export const ActionNodeUpdateTaskAction: FC<ActionNodeUpdateTaskActionProps> = ({ onChange }) => {
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

  return (
    <div className="flex flex-col gap-4">
      <Select onValueChange={(value) => setSelectedFields([...selectedFields, value])}>
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
            return <StandardField key={fieldName} fieldName={fieldName} onChange={onChange} />;
          }
          const field = customFieldMap[fieldName];
          return <FlowValueComponent key={field.name} valueFor={fieldName} type={field.type} label={fieldName} onChange={(value) => onChange(fieldName, value)} />;
        })}
      </div>
    </div>
  );
};

type StandardFieldProps = {
  fieldName: string;
  onChange: (key: string, value: FlowValue) => void;
};

const StandardField: FC<StandardFieldProps> = ({ fieldName, onChange }) => {
  if (fieldName === "Status") {
    return <FlowValueComponent type="status" label="Status" onChange={(value) => onChange("status", value)} />;
  }
  if (fieldName === "Priority") {
    return <FlowValueComponent type="priority" label="Priority" onChange={(value) => onChange("priority", value)} />;
  }
  if (fieldName === "Assignee") {
    return <FlowValueComponent type="user" label="Assignee" onChange={(value) => onChange("assignee", value)} />;
  }

  if (fieldName == "Title") {
    return <FlowValueComponent type="text" label="Title" onChange={(value) => onChange("title", value)} />;
  }

  return null;
};
