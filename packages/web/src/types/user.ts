import { users } from '@/db/schema'
import { Role } from './organization'

export type InsertUserData = typeof users.$inferInsert
export type User = Omit<typeof users.$inferSelect, 'active' | 'deletedAt' | 'updatedAt'> & { role: Role }

// InfantUser type is for users who have signed up but have not yet been onbaorded
export type InfantUser = Pick<User, 'id' | 'name' | 'email' | 'imageUrl'>
