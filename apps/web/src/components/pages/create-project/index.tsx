"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectDetailsForm } from "./project-details-form";
import { ChooseTemplate } from "./choose-template";
import { TemplateProperty, WorkflowStatus } from "@types";
import { EditTaskTypes } from "./task-types";
import { EditWorkflow } from "./workflow";
import { EditTaskProperties } from "./task-property";
import { EditPriority } from "./priority";
import { EditAssignee } from "./assignee";
import { Priority, ProjectTemplateDetail, TaskType } from "@tdata/shared/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CreateProjectPageProps = {
  templates: ProjectTemplateDetail[];
};

export default function CreateProjectPage({ templates }: CreateProjectPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplateDetail | undefined>(templates[0]);
  const [step, setStep] = useState<"template" | "details">("template");

  const handleTemplateSelect = (templateId: number) => {
    setSelectedTemplate(templates.find((t) => t.id === templateId)!);
  };

  const setTemplateName = (name: string) => {
    setSelectedTemplate({ ...selectedTemplate!, name });
  };

  const setTemplateDescription = (description: string) => {
    setSelectedTemplate({ ...selectedTemplate!, description });
  };

  const setTaskTypes = (taskTypes: TaskType[]) => {
    setSelectedTemplate({ ...selectedTemplate!, taskTypes });
  };

  const setWorkflow = (statuses: WorkflowStatus[]) => {
    setSelectedTemplate({ ...selectedTemplate!, statuses });
  };

  const setPriority = (priorities: Priority[]) => {
    setSelectedTemplate({ ...selectedTemplate!, priorities });
  };

  const setAssignee = (singleAssignee: boolean) => {
    setSelectedTemplate({ ...selectedTemplate!, singleAssignee });
  };

  const setTaskPropertys = (taskProperties: TemplateProperty[]) => {
    setSelectedTemplate({ ...selectedTemplate!, taskProperties });
  };

  if (step === "details") {
    return <ProjectDetailsForm template={selectedTemplate!} onBack={() => setStep("template")} />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-6">
      {/* Template List */}
      <ChooseTemplate templates={templates} onSelect={handleTemplateSelect} />

      {/* Template Details */}
      {selectedTemplate && (
        <div className="flex-1 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <Input
              placeholder="Add Template Title"
              value={selectedTemplate.name}
              onChange={(e) => setTemplateName(e.target.value)}
              className="text-2xl sm:text-2xl md:text-2xl px-0 font-semibold border-none"
            />
            <Button onClick={() => setStep("details")}>Use template</Button>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Add Template Description"
              value={selectedTemplate.description || ""}
              onChange={(e) => setTemplateDescription(e.target.value)}
              className="border-none p-0"
            />

            {/* Metadata */}
            <div className="space-y-8">
              <EditTaskTypes types={selectedTemplate.taskTypes} setTaskTypes={setTaskTypes} />
              <EditWorkflow workflows={selectedTemplate.statuses} setWorkflow={setWorkflow} />
              <EditPriority prioritys={selectedTemplate.priorities} setPriority={setPriority} />
              <EditAssignee singleAssignee={selectedTemplate.singleAssignee} setAssignee={setAssignee} />
              <EditTaskProperties attributes={selectedTemplate.taskProperties || []} setAttributes={setTaskPropertys} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
