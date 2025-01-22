import { projects, projectTemplates } from '@/db/schema'

export type InsertProjectData = typeof projects.$inferInsert
export type Project = typeof projects.$inferSelect
export type InsertProjectTemplate = Exclude<typeof projectTemplates.$inferInsert, 'id'>
export type ProjectTemplate = typeof projectTemplates.$inferSelect
