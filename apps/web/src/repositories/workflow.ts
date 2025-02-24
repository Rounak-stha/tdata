import { db as database } from "@db";
import { workflows, workflowStatus } from "@tdata/shared/db/schema";

import { InsertWorkflowData, Workflow } from "@tdata/shared/types";
import { ProjectTemplateWorkflow } from "@types";

export class WorkflowRepository {
  static async create(
    data: { workflow: InsertWorkflowData; status: ProjectTemplateWorkflow[] },
    tx?: Parameters<Parameters<typeof database.transaction>[0]>[0]
  ): Promise<Workflow> {
    const db = tx ? tx : database;
    const workflow = (await db.insert(workflows).values(data.workflow).returning())[0];
    const wfStatusData = data.status.map((status, index) => ({
      ...status,
      workflowId: workflow.id,
      order: index,
      createdBy: workflow.createdBy,
      organizationId: workflow.organizationId,
    }));
    await db.insert(workflowStatus).values(wfStatusData).returning();
    return workflow;
  }
}

export default WorkflowRepository;
