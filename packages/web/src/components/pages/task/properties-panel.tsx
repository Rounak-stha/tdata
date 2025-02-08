"use client";

import { CustomProperty, CustomUserProperty } from "@/components/common/custom-property";
import { AssigneeSelect } from "@/components/selects/assignee";
import { PrioritySelect } from "@/components/selects/priority";
import { StatusSelect } from "@/components/selects/status";
import { useUser } from "@/hooks";
import { updateTask } from "@/lib/actions/task";
import { AssigneeFieldName } from "@/lib/constants";
import { calcUserDiff } from "@/lib/utils";
import { ChangeParams, TaskDetail, TaskPropertyValue, TaskStandardFieldUpdateKeys, TemplateProperty, User, WorkflowStatus } from "@/types";
import { FC, useMemo } from "react";

type PropertiesPanelProps = {
  task: TaskDetail;
};

export const PropertiesPanel: FC<PropertiesPanelProps> = ({ task }) => {
  const { user } = useUser();
  const statuses = task.projectTemplate.workflow.statuses;
  const initialStatus = useMemo(() => statuses.find((status) => status.id === task.statusId), [statuses, task.statusId]);
  const templateProperties = task.projectTemplate.taskProperties;
  const userRelations = task.userRelations;

  const handleStatusUpdate = async (change: ChangeParams<WorkflowStatus>) => {
    await updateTask(
      { id: task.id, organizationId: task.organizationId },
      {
        name: "StandardFieldUpdate",
        performedBy: user.id,
        data: { statusId: change.newValue.id, previous: change.previousValue.name, value: change.newValue.name },
      }
    );
  };

  const handleStandardFieldPrimitiveValueUpdate = async (change: ChangeParams<string>, name: TaskStandardFieldUpdateKeys) => {
    await updateTask(
      { id: task.id, organizationId: task.organizationId },
      {
        name: "StandardFieldUpdate",
        performedBy: user.id,
        data: { [name]: change.newValue, previous: change.previousValue, value: change.newValue },
      }
    );
  };

  const handlePriorityUpdate = async (change: ChangeParams<string>) => {
    handleStandardFieldPrimitiveValueUpdate(change, "priority");
  };

  const handleCustomFieldUpdate = async (change: ChangeParams<TaskPropertyValue>, name: string) => {
    await updateTask(
      { id: task.id, organizationId: task.organizationId },
      {
        name: "CustomFieldUpdate",
        performedBy: user.id,
        data: {
          name,
          previousValue: change.previousValue,
          newValue: change.newValue,
        },
      }
    );
  };

  const handleUserRelationUpdate = async (change: ChangeParams<User[]>, name: string) => {
    const { action, diff } = calcUserDiff(change.previousValue, change.newValue);
    await updateTask(
      { id: task.id, organizationId: task.organizationId },
      {
        name: "UserRelationUpdate",
        performedBy: user.id,
        data: {
          name,
          newUser: action == "add" ? { id: diff[0].id, name: diff[0].name } : undefined,
          previousUser: action == "remove" ? { id: diff[0].id, name: diff[0].name } : undefined,
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium">Properties</h3>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Status</label>
          <StatusSelect size="full" allStatus={task.projectTemplate.workflow.statuses} status={initialStatus} onChange={handleStatusUpdate} />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Priority</label>
          <PrioritySelect size="full" priority={task.priority} onChange={handlePriorityUpdate} />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">Assignee</label>
          <AssigneeSelect
            size="full"
            assignee={userRelations[AssigneeFieldName]}
            singleUser={task.projectTemplate.singleAssignee}
            onChange={(change) => handleUserRelationUpdate(change, AssigneeFieldName)}
          />
        </div>
        {templateProperties &&
          templateProperties.map((property) => {
            if (property.type == "user") {
              return (
                <CustomUserProperty
                  key={property.name}
                  size="full"
                  value={userRelations[property.name]}
                  {...property}
                  onChange={(change) => handleUserRelationUpdate(change, property.name)}
                />
              );
            }
            return (
              <CustomProperty
                key={property.name}
                size="full"
                value={task.properties ? task.properties[property.name] : undefined}
                {...property}
                type={property.type as Exclude<TemplateProperty["type"], "user">}
                onChange={(change) => handleCustomFieldUpdate(change, property.name)}
              />
            );
          })}
      </div>
    </div>
  );
};
