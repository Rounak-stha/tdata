import { organizations } from '@/db/schema'

export type InsertOrganizationData = typeof organizations.$inferInsert
export type Organization = typeof organizations.$inferSelect
