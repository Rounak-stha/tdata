import { taskTypes } from "@db/schema";

export type InsertTaskTypeData = typeof taskTypes.$inferInsert;
export type TaskType = typeof taskTypes.$inferSelect;
