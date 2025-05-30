import { createDrizzleSupabaseClient } from "@db";

import { and, eq, isNull, lt, or } from "drizzle-orm";

import { invitations, organizationMemberships, organizations, users } from "@tdata/shared/db/schema";
import { Invitation, InsertInvitationData, InvitationDetail, InvitationWithUserDetail, UpdateInvitationData } from "@tdata/shared/types";
import { InvitationDetailSelect } from "./selects";
import { UserRepository } from "./user";
import { createDrizzleSupabaseServiceRoleClient } from "@tdata/shared/db";

export class InvitationRepository {
  static async create(data: InsertInvitationData): Promise<Invitation> {
    const db = await createDrizzleSupabaseClient();
    return await db.rls(async (tx) => {
      const insertedInvitationData = await tx.insert(invitations).values(data).returning();
      if (insertedInvitationData.length === 0) throw new Error("Document not inserted");
      return insertedInvitationData[0];
    });
  }

  static async getInvitationByToken(token: string): Promise<InvitationDetail | null> {
    // Invitation page might be accessed by non authenticated users as well
    const db = await createDrizzleSupabaseServiceRoleClient();
    return await db.rls(async (tx) => {
      const invitationData = await tx
        .select(InvitationDetailSelect)
        .from(invitations)
        .leftJoin(organizations, eq(invitations.organizationId, organizations.id))
        .leftJoin(users, eq(invitations.invitedById, users.id))
        .where(eq(invitations.token, token));
      if (invitationData.length === 0) return null;
      return invitationData[0];
    });
  }

  static async update(id: number, data: UpdateInvitationData): Promise<Invitation | null> {
    const db = await createDrizzleSupabaseClient();

    return await db.rls(async (tx) => {
      const updatedInvitation = await tx.update(invitations).set(data).where(eq(invitations.id, id)).returning();
      if (updatedInvitation.length == 0) return null;
      return updatedInvitation[0];
    });
  }

  static async acceptInvitation(token: string, userId: string): Promise<InvitationDetail> {
    const invitationDetail = await this.getInvitationByToken(token);
    const user = await UserRepository.getUserById(userId);

    if (!invitationDetail || !user) throw new Error("Invalid Invite");

    const db = await createDrizzleSupabaseClient();

    await db.rls(async (tx) => {
      const { organizationId } = invitationDetail;
      await tx.update(invitations).set({ acceptedAt: new Date() }).execute();
      await tx.insert(organizationMemberships).values({ organizationId, userId: user.id, role: invitationDetail.role });
      return true;
    });

    return invitationDetail;
  }

  static async getOrganizationUnAcceptedInvitation(organizationId: number): Promise<InvitationWithUserDetail[]> {
    const db = await createDrizzleSupabaseClient();
    return await db.rls(async (tx) => {
      const invitationData = await tx
        .select(InvitationDetailSelect)
        .from(invitations)
        .leftJoin(organizations, eq(invitations.organizationId, organizations.id))
        .leftJoin(users, eq(invitations.invitedById, users.id))
        .where(and(eq(invitations.organizationId, organizationId), or(lt(invitations.expiresAt, new Date()), isNull(invitations.acceptedAt))));
      return invitationData;
    });
  }
}
