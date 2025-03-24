import { organizations, Roles } from "@db/schema";
import { Project } from "./project";
import { User } from "./user";

export type InsertOrganizationData = typeof organizations.$inferInsert;
export type Organization = Omit<typeof organizations.$inferSelect, "deletedAt" | "updatedAt">;

export type OrganizationDetail = Organization & {
  projects: Project[];
  members: User[];
};

export type Role = (typeof Roles)[number];
