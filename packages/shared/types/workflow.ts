import { workflows, workflowStatus } from "@db/schema";

export type InsertWorkflowData = typeof workflows.$inferInsert;
export type Workflow = typeof workflows.$inferSelect;

export type InsertWorkflowStatuseData = typeof workflowStatus.$inferInsert;
export type WorkflowStatus = Omit<typeof workflowStatus.$inferSelect, "deletedAt" | "">;

export type WorkflowDetail = Workflow & {
  statuses: WorkflowStatus[];
};
