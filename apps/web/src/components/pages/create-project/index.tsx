"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { ProjectDetailsForm } from "./project-details-form";
import { ChooseTemplate } from "./choose-template";
import { ProjectTemplateUI, ProjectTemplateAssignee, ProjectTemplatePriority, ProjectTemplateTaskType, ProjectTemplateWorkflow, TemplateProperty } from "@types";
import { EditTaskTypes } from "./task-types";
import { EditWorkflow } from "./workflow";
import { EditTaskProperties } from "./task-property";
import { EditPriority } from "./priority";
import { EditAssignee } from "./assignee";

const templates: ProjectTemplateUI[] = [
  {
    id: "scrum",
    name: "Scrum",
    description: "The Scrum template helps teams work together using sprints to break down large, complex projects into bite-sized pieces of value.",
    features: [
      {
        title: "Plan upcoming work in a backlog",
        description:
          "Prioritize and plan your team's work on the backlog. Break down work from your project timeline, and order work items so your team knows what to deliver first.",
      },
      {
        title: "Organize cycles of work into sprints",
        description: "Sprints are short, time-boxed periods when a team collaborates to complete a set amount of customer value. Use sprints to drive incremental delivery.",
      },
      {
        title: "Understand your team's velocity",
        description: "Improve predictability on planning and delivery with out-of-the-box reports, including the sprint report and velocity chart.",
      },
    ],
    taskTypes: [
      { name: "Epic", icon: "Epic" },
      { name: "Story", icon: "Story" },
      { name: "Bug", icon: "Bug" },
      { name: "Task", icon: "Task" },
      { name: "Sub-task", icon: "Task" },
    ],
    workflow: [
      { name: "To Do", icon: "ToDo" },
      { name: "In Progress", icon: "InProgress" },
      { name: "Completed", icon: "Completed" },
    ],
    priority: [
      { name: "Low", icon: "Low" },
      { name: "Medium", icon: "Medium" },
      { name: "High", icon: "High" },
      { name: "Urgent", icon: "Urgent" },
    ],
    assignee: { multiple: false },
    taskProperties: [
      { name: "Due Date", type: "date", required: false },
      { name: "Story Points", type: "number", required: true },
    ],
    recommendedFor: ["Teams that deliver work on a regular cadence", "DevOps teams that want to connect work across their tools"],
  },
  {
    id: "kanban",
    name: "Kanban",
    description: "Visualize and manage work in a continuous flow. Best for teams that want to manage work in a flexible way.",
    features: [
      {
        title: "Visualize work in progress",
        description: "See all work items at a glance and quickly identify bottlenecks in your process.",
      },
      {
        title: "Limit work in progress",
        description: "Set WIP limits to help your team focus on finishing work before starting new items.",
      },
      {
        title: "Measure cycle time",
        description: "Track how long it takes work to flow through your process and optimize for efficiency.",
      },
    ],
    taskTypes: [
      { name: "Task", icon: "Task" },
      { name: "Bug", icon: "Bug" },
      { name: "Feature", icon: "Story" },
    ],
    workflow: [
      { name: "Backlog", icon: "Backlog" },
      { name: "In Progress", icon: "InProgress" },
      { name: "Review", icon: "InReview" },
      { name: "Done", icon: "Completed" },
    ],
    priority: [
      { name: "Low", icon: "Low" },
      { name: "Medium", icon: "Medium" },
      { name: "High", icon: "High" },
      { name: "Urgent", icon: "Urgent" },
    ],
    assignee: { multiple: false },
    taskProperties: [{ name: "Due Date", type: "date", required: true }],
    recommendedFor: ["Teams that prefer a continuous flow of work", "Support and maintenance teams"],
  },
];

export default function CreateProject() {
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplateUI | null>(null);
  const [step, setStep] = useState<"template" | "details">("template");

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templates.find((t) => t.id === templateId) || null);
  };

  const setTaskTypes = (taskTypes: ProjectTemplateTaskType[]) => {
    setSelectedTemplate({ ...selectedTemplate!, taskTypes });
  };

  const setWorkflow = (workflow: ProjectTemplateWorkflow[]) => {
    setSelectedTemplate({ ...selectedTemplate!, workflow });
  };

  const setPriority = (priority: ProjectTemplatePriority[]) => {
    setSelectedTemplate({ ...selectedTemplate!, priority });
  };

  const setAssignee = (assignee: ProjectTemplateAssignee) => {
    setSelectedTemplate({ ...selectedTemplate!, assignee });
  };

  const setTaskPropertys = (taskProperties: TemplateProperty[]) => {
    setSelectedTemplate({ ...selectedTemplate!, taskProperties });
  };

  if (step === "details") {
    return <ProjectDetailsForm template={selectedTemplate!} onBack={() => setStep("template")} />;
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8 p-6">
      {/* Template List */}
      <ChooseTemplate templates={templates} onSelect={handleTemplateSelect} />

      {/* Template Details */}
      {selectedTemplate && (
        <div className="lg:col-span-4 min-h-screen">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">{selectedTemplate.name}</h2>
            <Button onClick={() => setStep("details")}>Use template</Button>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground">{selectedTemplate.description}</p>

            {/* Features */}
            <div className="space-y-4">
              {selectedTemplate.features.map((feature, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Metadata */}
            <div className="space-y-8">
              <EditTaskTypes types={selectedTemplate.taskTypes} setTaskTypes={setTaskTypes} />
              <EditWorkflow workflows={selectedTemplate.workflow} setWorkflow={setWorkflow} />
              <EditPriority prioritys={selectedTemplate.priority} setPriority={setPriority} />
              <EditAssignee assignee={selectedTemplate.assignee} setAssignee={setAssignee} />
              <EditTaskProperties attributes={selectedTemplate.taskProperties} setAttributes={setTaskPropertys} />

              <div>
                <h3 className="text-sm font-medium mb-2">Recommended for</h3>
                <div className="space-y-2">
                  {selectedTemplate.recommendedFor.map((text, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
