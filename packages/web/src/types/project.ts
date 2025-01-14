import { projects } from '@/db/schema'

export type InsertProjectData = typeof projects.$inferInsert
export type Project = typeof projects.$inferSelect
