import { invitations } from "@db/schema";
import { Organization } from "./organization";
import { User } from "./user";

export type InsertInvitationData = typeof invitations.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type UpdateInvitationData = Pick<InsertInvitationData, "acceptedAt" | "role">;

export type InvitationDetail = Invitation & {
  organization: Organization;
  invitedby: User;
};

export type InvitationWithUserDetail = Invitation & {
  invitedby: User;
};
