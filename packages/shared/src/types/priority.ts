import { priorities } from "@db/schema";

export type InsertPriorityData = typeof priorities.$inferInsert;
export type Priority = typeof priorities.$inferSelect;
