import { nanoid } from "nanoid";
import { FlowVariableType, ProjectDetail } from "@tdata/shared/types";
import { FlowValue, FlowVariable } from "@/automation-ui/types";
import invariant from "tiny-invariant";

export const createCustomVariable = (name: string, value: string, type: FlowVariableType, description: string = ""): FlowVariable => {
  return {
    id: nanoid(),
    name,
    value,
    type,
    description,
  };
};

export const createTriggeringTaskFieldVariableName = (fieldName: string) => {
  return `triggering-task.${fieldName.replace(/\s+/g, "_").toLowerCase()}`;
};

export const extractTriggeringTaskFieldNameFromVariableName = (variableName: string) => {
  const splittedName = variableName.split(".");
  invariant(splittedName.length >= 2, "Invalid variable name");
  return splittedName[1].replace(/_/g, " ");
};

export const extractValueFromFlowValue = (value: FlowValue) => {
  if (value.type == "static") {
    return value.value;
  } else if (value.type == "variable") {
    return value.value.value;
  }
  return "";
};

/**
 * Create system variables
 * System variables will depend on te trigger type
 * Currently we only have task event based triggers so the following is appropriate
 * But in the future, if we want to add additional triggers like Time based (CRON), then there wont be any tasks in the trigger context initially
 */
export const getSystemVariables = (project: ProjectDetail): FlowVariable[] => {
  const systemVariables: FlowVariable[] = [
    {
      id: nanoid(),
      name: "project.name",
      value: project.name,
      type: "text",
      description: "The name of the project",
    },
    {
      id: nanoid(),
      name: "project.id",
      type: "number",
      description: "The ID of the project",
    },
    {
      id: nanoid(),
      name: "project.description",
      type: "text",
      description: "The description of the project",
    },
    {
      id: nanoid(),
      name: "project.created_at",
      type: "date",
      description: "The date and time the project was created",
    },

    // user
    {
      id: nanoid(),
      name: "user.id",
      type: "number",
      description: "Id of the user who triggered the automation",
    },
    {
      id: nanoid(),
      name: "user.name",
      type: "text",
      description: "The name of the user who triggered the automation",
    },
    {
      id: nanoid(),
      name: "user.email",
      type: "text",
      description: "The email of the user who triggered the automation",
    },

    // task
    {
      id: nanoid(),
      name: createTriggeringTaskFieldVariableName("id"),
      type: "number",
      description: "The ID of the task",
    },
    {
      id: nanoid(),
      name: createTriggeringTaskFieldVariableName("title"),
      type: "text",
      description: "The name of the task",
    },
    {
      id: nanoid(),
      name: createTriggeringTaskFieldVariableName("status"),
      type: "status",
      description: "The description of the task",
    },
    {
      id: nanoid(),
      name: createTriggeringTaskFieldVariableName("priority"),
      type: "priority",
      description: "The description of the task",
    },
    {
      id: nanoid(),
      name: createTriggeringTaskFieldVariableName("assignee"),
      type: "user",
      description: "The description of the task",
    },
    ...(project.template.taskProperties
      ? project.template.taskProperties.map((property) => ({
          id: nanoid(),
          name: createTriggeringTaskFieldVariableName(property.name),
          type: property.type,
          description: `Value of custom task property ${property.name}`,
        }))
      : []),

    // Trigger
    {
      id: nanoid(),
      name: "trigger.timestamp",
      type: "date",
      description: "The date and time the automation was triggered",
    },
  ];
  return systemVariables;
};
