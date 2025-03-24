import { FC, useState } from "react";

import { cn } from "@/lib/utils";
import { ProjectTemplateDetail } from "@tdata/shared/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "react-day-picker";

type ChooseTemplateProps = {
  templates: ProjectTemplateDetail[];
  onSelect: (templateId: number) => void;
};

export const ChooseTemplate: FC<ChooseTemplateProps> = ({ templates, onSelect }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const handleSelect = (templateId: number) => {
    setSelectedTemplateId(templateId);
    onSelect(templateId);
  };

  return (
    <div className="lg:min-h-screen">
      <div className="lg:space-y-6 space-y-4">
        <div>
          <h1 className="text-base lg:text-2xl font-semibold mb-1">Choose a template</h1>
          <p className="text-muted-foreground text-sm">Start with a template that best suits your team&apos;s needs</p>
        </div>
        <div className="lg:hidden">
          <TemplateSelect templates={templates} onSelect={handleSelect} />
        </div>
        <div className="space-y-3 hidden lg:block">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn("p-4 rounded-sm border cursor-pointer hover:border-primary transition-colors", selectedTemplateId === template.id && "border-primary bg-primary/5")}
              onClick={() => handleSelect(template.id)}
            >
              <h3 className="font-medium">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TemplateSelect: FC<ChooseTemplateProps> = ({ templates, onSelect }) => {
  const handleSelect = (templateId: string) => {
    onSelect(parseInt(templateId));
  };
  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.id} value={template.id.toString()}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
