import { workflowStatus } from "@db/schema";

export type InsertWorkflowStatuseData = typeof workflowStatus.$inferInsert;
export type WorkflowStatus = Omit<typeof workflowStatus.$inferSelect, "deletedAt" | "">;
