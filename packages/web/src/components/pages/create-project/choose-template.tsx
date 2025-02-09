import { FC, useState } from "react";

import { cn } from "@/lib/utils";
import { ProjectTemplateUI } from "@/types/template";

type ChooseTemplateProps = {
  templates: ProjectTemplateUI[];
  onSelect: (templateId: string) => void;
};

export const ChooseTemplate: FC<ChooseTemplateProps> = ({ templates, onSelect }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onSelect(templateId);
  };

  return (
    <div className="lg:col-span-1 min-h-screen">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Choose a template</h1>
          <p className="text-muted-foreground text-sm">Start with a template that best suits your team&apos;s needs</p>
        </div>

        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn("p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors", selectedTemplateId === template.id && "border-primary bg-primary/5")}
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
