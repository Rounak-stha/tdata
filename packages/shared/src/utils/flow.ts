import { FlowValue, FlowVariable, ProjectDetail, TaskDetail, User, FlowOperator, FlowOperatorValue, FlowVariableType } from "@types";

import invariant from "tiny-invariant";
import { FlowOperators } from "@lib";

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
export const getSystemVariables = (project: ProjectDetail, task?: TaskDetail, user?: User): FlowVariable[] => {
  const systemVariables: FlowVariable[] = [
    {
      id: "project.name",
      name: "project.name",
      value: project.name,
      type: "text",
      description: "The name of the project",
    },
    {
      id: "project.id",
      name: "project.id",
      type: "number",
      description: "The ID of the project",
    },
    {
      id: "project.description",
      name: "project.description",
      type: "text",
      description: "The description of the project",
    },
    {
      id: "project.created_at",
      name: "project.created_at",
      type: "date",
      description: "The date and time the project was created",
    },

    // user
    {
      id: "user.id",
      name: "user.id",
      type: "number",
      value: user?.id,
      description: "Id of the user who triggered the automation",
    },
    {
      id: "user.name",
      name: "user.name",
      type: "text",
      value: user?.name,
      description: "The name of the user who triggered the automation",
    },
    {
      id: "user.email",
      name: "user.email",
      type: "text",
      value: user?.email,
      description: "The email of the user who triggered the automation",
    },

    // task
    {
      id: createTriggeringTaskFieldVariableName("id"),
      name: createTriggeringTaskFieldVariableName("id"),
      type: "number",
      value: String(task?.id),
      description: "The ID of the task",
    },
    {
      id: createTriggeringTaskFieldVariableName("title"),
      name: createTriggeringTaskFieldVariableName("title"),
      type: "text",
      value: task?.title,
      description: "The name of the task",
    },
    {
      id: createTriggeringTaskFieldVariableName("status"),
      name: createTriggeringTaskFieldVariableName("status"),
      type: "status",
      value: String(task?.statusId),
      description: "The description of the task",
    },
    {
      id: createTriggeringTaskFieldVariableName("priority"),
      name: createTriggeringTaskFieldVariableName("priority"),
      type: "priority",
      value: String(task?.priorityId),
      description: "The description of the task",
    },
    {
      id: createTriggeringTaskFieldVariableName("assignee"),
      name: createTriggeringTaskFieldVariableName("assignee"),
      type: "user",
      value: String(task?.userRelations ? task.userRelations["assignee"][0]?.id : ""),
      description: "The description of the task",
    },
    ...(project.template.taskProperties
      ? project.template.taskProperties.map((property) => ({
          id: createTriggeringTaskFieldVariableName(property.name),
          name: createTriggeringTaskFieldVariableName(property.name),
          type: property.type,
          value: task?.properties ? task?.properties[property.name] : undefined,
          description: `Value of custom task property ${property.name}`,
        }))
      : []),

    // Trigger
    {
      id: "trigger.timestamp",
      name: "trigger.timestamp",
      type: "date",
      description: "The date and time the automation was triggered",
    },
  ];
  return systemVariables;
};

const SupportedTypes = new Set<FlowVariableType>(["boolean", "number", "text", "date", "status", "priority", "multiSelect", "select", "user"]);

const OperatorCompatibility: Record<FlowVariableType, FlowOperatorValue[]> = {
  boolean: ["eq", "neq"],
  number: ["eq", "neq", "gt", "gte", "lt", "lte"],
  text: ["eq", "neq"],
  date: ["eq", "neq", "gt", "gte", "lt", "lte"],
  status: ["eq", "neq"],
  priority: ["eq", "neq"],
  multiSelect: ["contains"],
  select: ["eq", "neq"],
  user: ["eq", "neq"],
};

export const getFlowOperators = (type: FlowVariableType): FlowOperator[] => {
  return FlowOperators.filter((operator) => OperatorCompatibility[type].includes(operator.value));
};

export const isOperatorCompatible = (operator: FlowOperatorValue, type: FlowVariableType): boolean => {
  return OperatorCompatibility[type].includes(operator);
};

export const isSupportedType = (type: FlowVariableType): boolean => {
  return SupportedTypes.has(type);
};
