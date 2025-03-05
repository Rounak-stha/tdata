import { CustomProperty, CustomUserProperty } from "@/components/common/custom-property";
import { AssigneeSelect, PrioritySelect, StatusSelect } from "@/components/selects";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { ProjectTemplateDetail, ProjectTemplateProperty } from "@tdata/shared/types";
import { FC, useMemo, useState } from "react";
import { useFlowStore } from "../store/flow";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const StandardFields = new Set(["Title", "Assignee", "Status", "Priority"]);

// here's what I want to do
// create an array of all fields like for the custom fields
// user will select the fields that they want to update
// the value input type will be based on the type of the field

export const UpdateTask: FC = () => {
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
            return <StandardField key={fieldName} fieldName={fieldName} template={projectTemplate} />;
          }
          const field = customFieldMap[fieldName];
          return <CustomField key={fieldName} template={field} />;
        })}
      </div>
    </div>
  );
};

function StandardField({ fieldName, template }: { fieldName: string; template: ProjectTemplateDetail }) {
  if (fieldName === "Status") {
    return (
      <div>
        <Label className="peer text-muted-foreground">{fieldName}</Label>
        <StatusSelect size="full" allStatus={template.workflow.statuses} />
      </div>
    );
  }
  if (fieldName === "Priority") {
    return (
      <div>
        <Label className="peer text-muted-foreground">{fieldName}</Label>
        <PrioritySelect size="full" />
      </div>
    );
  }
  if (fieldName === "Assignee") {
    return (
      <div>
        <Label className="peer text-muted-foreground">{fieldName}</Label>
        <AssigneeSelect size="full" singleUser={template.singleAssignee} />
      </div>
    );
  }

  if (fieldName == "Title") {
    return (
      <div>
        <Label className="peer text-muted-foreground">{fieldName}</Label>
        <Input />
      </div>
    );
  }

  return null;
}

function CustomField({ template }: { template: ProjectTemplateProperty }) {
  if (template.type === "user") {
    return <CustomUserProperty size="full" name={template.name} required={template.required} />;
  }
  return <CustomProperty name={template.name} type={template.type} required={template.required} />;
}
